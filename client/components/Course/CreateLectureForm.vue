<template>
  <b-modal
    id="addModal"
    hide-footer
    hide-header
    ok-title="Yes"
    cancel-title="No"
  >
    <div class="create">
      <h2 class="fadeFast">Create a Lecture</h2>
      <h5 class="fadeMedium">Please enter information about the lecture</h5>
      <div class="fadeSlow">
        <div>
          <div class="form-section">Lecture Name</div>
          <input
            class="text-input"
            :placeholder="'Enter a lecture name'"
            @input="name = $event.target.value"
          />
        </div>
        <div>
          <div class="form-section">Date</div>
          <input
            :placeholder="'Enter the lecture date'"
            @input="date = $event.target.value"
          />
        </div>
        <div>
          <div class="form-section">Video Link</div>
          <input
            :placeholder="'Enter the lecture video link'"
            @input="src = $event.target.value"
          />
        </div>
        <br />
        <div class="modal-footer">
          <b-button
            class="button"
            data-dismiss="addModal"
            variant="success"
            @click="submit"
            >Add</b-button
          >
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import BlockForm from "@/components/common/BlockForm.vue";

export default {
  name: "CreateLectureForm",
  mixins: [BlockForm],
  data() {
    return {
      name: "",
      date: "",
      src: "",
      alerts: {},
    };
  },
  props: {
    courseId: {
      type: String,
      required: true,
    },
    callback: {
      type: Function,
    },
  },
  methods: {
    async submit() {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // Sends express-session credentials with request
      };
      if (this.name === "" || this.date === "" || this.src === "") {
        this.$set(
          this.alerts,
          "You must provide a name, date, and video link",
          "error"
        );
        setTimeout(
          () =>
            this.$delete(
              this.alerts,
              "You must provide a name, date, and video link"
            ),
          3000
        );
        console.log("here");
        console.log(this.alerts);
        return;
      }
      options.body = JSON.stringify({
        name: this.name,
        date: this.date,
        src: this.src,
        course: this.courseId,
      });

      try {
        const url = "/api/lecture";
        const r = await fetch(url, options);
        const res = await r.json();

        if (!r.ok) throw new Error(res.error);
      } catch (e) {}
    },
  },
};
</script>

<style scoped>
.form-section {
  padding-top: 10px;
}
</style>
