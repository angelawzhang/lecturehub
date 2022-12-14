<template>
  <div class="create">
    <h1 class="fadeFast">Create a Course</h1>
    <h4 class="fadeMedium">Please enter information about your course</h4>
    <div class="formSection fadeSlow">
      <div>
        <div>Course Name</div>
        <input
          :placeholder="'Enter a course name'"
          @input="name = $event.target.value"
        />
      </div>
      <div>
        <div>Course Description</div>
        <textarea
          :placeholder="'Enter a course description'"
          @input="description = $event.target.value"
        />
      </div>
      <div>
        <div>Term</div>
        <select v-model="term">
          <option v-bind:value="'SPRING'">Spring</option>
          <option v-bind:value="'FALL'">Fall</option>
        </select>
      </div>
      <div>
        <div>Year</div>
        <select v-model="year">
          <option v-bind:value="2022">2022</option>
          <option v-bind:value="2023">2023</option>
        </select>
      </div>
      <b-button class="button" variant="success" @click="submit"
        >Confirm</b-button
      >
    </div>
  </div>
</template>

<script>
import router from "@/router.ts";
export default {
  name: "CreatePage",
  data() {
    return {
      term: "FALL",
      year: 2022,
      name: "",
      description: "",
      alerts: {},
    };
  },

  methods: {
    async submit() {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // Sends express-session credentials with request
      };
      if (this.name === "" || this.description === "") {
        this.$set(
          this.alerts,
          "You must provide a name and description",
          "error"
        );
        setTimeout(
          () =>
            this.$delete(
              this.alerts,
              "You must provide a name and description"
            ),
          3000
        );
        console.log("here");
        console.log(this.alerts);
        return;
      }
      options.body = JSON.stringify({
        name: this.name,
        term: this.term,
        year: this.year,
        description: this.description,
      });

      try {
        const url = "/api/course";
        const r = await fetch(url, options);
        const res = await r.json();

        if (!r.ok) throw new Error(res.error);

        this.name = "";
        this.term = "FALL";
        this.year = 2022;

        const courseId = res.course._id;
        this.$store.commit("refreshInstructing");
        router.push({ path: `course/${courseId}` });
      } catch (e) {}
    },
  },
};
</script>

<style scoped>
.alerts {
  position: absolute;
  z-index: 99;
  bottom: 20;
  top: 100%;
  left: 50%;
  transform: translate(-50%, 10%);
  width: 100%;
  text-align: center;
}

input {
  background-color: #dcdada;
  border-radius: 10px;
  width: 20rem;
  height: 2.5rem;
  padding-left: 10px;
}

input:focus {
  text-decoration: none;
  outline: none;
}

select {
  background-color: #dcdada;
  border-radius: 10px;
  width: 5rem;
  height: 1.7rem;
}

.create {
  padding: 30px;
}

.formSection {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.button {
  width: 8rem;
  background-color: #14a3b7;
  border-color: #14a3b7;
}
</style>
