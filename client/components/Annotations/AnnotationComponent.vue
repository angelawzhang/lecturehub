<template>
  <div class="annotationContainer">
    <div v-if="!editing">
      <div>
        {{ this.formatTime() }}
      </div>

      <div>{{ this.content }}</div>

      <button
        v-if="this.$store.state.id"
        @click="switchEditing"
      >
        Edit
      </button>
      
    </div>
    <div v-else>
      <div>
        <textarea :value="content" @input="content = $event.target.value" />
      </div>
      <button @click="submit">Confirm</button>
      <button @click="switchEditing">Cancel</button>
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
  },
  data() {
    return {
      editing: false,
      content: this.annotationObject.content,
      hour: this.annotationObject.hour,
      minute: this.annotationObject.minute,
      second: this.annotationObject.second,
    };
  },
  methods: {
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
    async submit() {
      const options = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
      };
      options.body = JSON.stringify({
        annotationId: this.annotationObject._id,
        content: this.content,
      });

      try {
        const url = `/api/annotations`;
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
</style>
