<template>
  <div
    class="annotationContainer"
    @click="setTime((hour * 60 + minute) * 60 + second)"
  >
    <div v-if="!editing && !deleting">
      <div class="timeStampButtons">
        <i class="timeStamp">
          {{ this.formatTime() }}
        </i>
        <div v-if="!deleting">
          <button
            class="btn"
            v-if="this.$store.state.id"
            @click="switchEditing"
          >
            <span class="editIcon"></span>
          </button>

          <button
            class="btn"
            v-if="this.$store.state.id"
            @click="switchDeleting"
          >
            <span class="trashIcon"></span>
          </button>
        </div>
      </div>

      <div>{{ content }}</div>
    </div>
    <div v-else-if="deleting">
      <div>Do you want to delete this annotation?</div>

      <b-button
        class="buttons"
        variant="outline-primary"
        @click="deleteAnnotation"
        >Delete</b-button
      >
      <b-button class="buttons" variant="outline-danger" @click="switchDeleting"
        >Cancel</b-button
      >
    </div>
    <div v-else>
      <div>
        <textarea :value="content" @input="content = $event.target.value" />
      </div>

      <b-button class="buttons" variant="outline-primary" @click="submit"
        >Confirm</b-button
      >
      <b-button class="buttons" variant="outline-danger" @click="switchEditing"
        >Cancel</b-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "AnnotationComponent",
  props: {
    annotationObject: {
      type: Object,
      required: true,
    },
    callback: {
      type: Function,
    },
    setTime: {
      type: Function,
    },
  },
  computed: {
    content: {
      get() {
        return this.annotationObject.content;
      },
      set(newValue) {
        // Note: we are using destructuring assignment syntax here.
        this.annotationObject.content = newValue;
      },
    },
    hour() {
      return this.annotationObject.hour;
    },
    minute() {
      return this.annotationObject.minute;
    },
    second() {
      return this.annotationObject.second;
    },
    dateCreated() {
      return this.annotationObject.dateCreated;
    },
    id() {
      return this.annotationObject._id;
    },
  },
  data() {
    return {
      editing: false,
      deleting: false,
    };
  },
  methods: {
    switchDeleting() {
      this.deleting = !this.deleting;
    },
    hideModal() {
      this.$refs[`delete-modal${this.id}`].hide();
    },
    formatNumber(num) {
      return num < 10 ? "0" + num.toString() : num;
    },
    formatTime() {
      let hour = this.formatNumber(this.hour);
      let minute = this.formatNumber(this.minute);
      let second = this.formatNumber(this.second);

      return `${hour}:${minute}:${second}`;
    },
    switchEditing() {
      this.editing = !this.editing;
      this.content = this.annotationObject.content;
    },
    async deleteAnnotation() {
      const options = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
      };
      console.log("deleting annotation: ", this.id);
      try {
        const url = `/api/annotation/${this.id}`;
        const res = await fetch(url, options);
        if (!res.ok) {
          throw new Error(res.error);
        }
        this.callback();
      } catch (e) {}
      this.$bvModal.hide("delete-modal" + this.id);
    },
    async submit() {
      const options = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
      };
      options.body = JSON.stringify({
        content: this.content,
      });

      try {
        const url = `/api/annotation/${this.id}`;
        const res = await fetch(url, options);
        if (!res.ok) {
          throw new Error(res.error);
        }

        this.editing = false;
      } catch (e) {}
    },
  },
};
</script>

<style scoped>
.annotationContainer {
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  margin-bottom: 8px;
}

.btn {
  padding: 0px;
  margin-top: -8px;
}

.editIcon {
  background: url("../../public/draw.png") no-repeat center;
  float: left;
  width: 30px;
  height: 30px;
}

.trashIcon {
  background: url("../../public/trash.png") no-repeat center;
  float: left;
  width: 30px;
  height: 30px;
}

.timeStamp {
  font-family: "Lato", sans-serif;
  font-style: italic;
  font-size: 16px;
}

.timeStampButtons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.annotateBtn {
  justify-self: right;
}
#delete-annotation-modal {
  background-color: #d11a2a;
}

.buttons {
  margin: 4px;
  height: 30px;
  width: 90px;
  border-radius: 15px;
}
.confirmDelete {
  display: flex;
  flex-direction: column;
}
div {
  color: black;
}
</style>
