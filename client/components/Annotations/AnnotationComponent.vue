<template>
  <div class="annotationContainer">
    <div v-if="!editing">
      <b-button
        v-if="this.$store.state.id"
        variant="outline-primary"
        @click="switchEditing"
      >
        Edit
      </b-button>

      <b-button v-if="this.$store.state.id" v-b-modal="('delete-modal' + this.id)" variant="outline-primary">Delete</b-button>
      <b-modal :ref="('delete-modal'+ this.id)" :id="('delete-modal'+ this.id)" hide-footer ok-title="Yes" cancel-title="No">
        <div class="d-block text-center">
          <h4>Delete This Annotation?</h4>
        </div>
        <b-button class="mt-3" id="cancel-action-modal" block @click="hideModal">Cancel</b-button>
        <b-button class="mt-3" id="delete-annotation-modal" block @click="deleteAnnotation">Delete</b-button>
      </b-modal>

      <div>
        {{ this.formatTime() }}
      </div>
      <!-- Commented out for now to reflect comment in user testing -->
      <!-- <div>
        Created: {{ dateCreated }}
      </div> -->

      <div>{{ content }}</div>

    </div>
    <div v-else>
      <div>
        <textarea :value="content" @input="content = $event.target.value" />
      </div>
      <b-button variant="outline-primary" @click="submit">Confirm</b-button>
      <b-button variant="outline-primary" @click="switchEditing">Cancel</b-button>
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
    }
  },
  computed: {
    content: {
      get() {
        return this.annotationObject.content;
      },
      set(newValue) {
        // Note: we are using destructuring assignment syntax here.
        this.annotationObject.content = newValue;
      }
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
    }
  },
  data() {
    return {
      editing: false,
    };
  },
  methods: {
    hideModal() {
        this.$refs[`delete-modal${this.id}`].hide()
    },
    formatNumber(num) {
      return num < 10 ? "0" + num.toString() : num;
    },
    formatTime() {
      let hour = this.formatNumber(this.hour);
      let minute = this.formatNumber(this.minute);
      let second = this.formatNumber(this.second);

      return `Timestamp: ${hour}:${minute}:${second}`;
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

#delete-annotation-modal {
  background-color: #d11a2a;
}
</style>
