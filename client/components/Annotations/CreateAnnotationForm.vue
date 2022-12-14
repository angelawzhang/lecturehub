<template>
  <div>
    <textarea
      :placeholder="placeholderContent"
      :value="content"
      @input="content = $event.target.value"
    />
    <b-button variant="info" @click="submit">Submit</b-button>
  </div>
</template>

<script>
export default {
  name: "CreateAnnotationForm",
  data() {
    return {
      content: "",
      hour: "",
      minute: "",
      second: "",
    };
  },
  props: {
    lectureId: {
      type: String,
      required: true,
    },
    callback: {
      type: Function,
    },
    placeholderContent: {
      type: String,
    },
    getTime: {
      type: Function,
    },
  },
  methods: {
    async submit() {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
      };
      let timeInSeconds = this.getTime();
      let hours = Math.floor(timeInSeconds / 3600);
      timeInSeconds %= 3600;
      let minutes = Math.floor(timeInSeconds / 60);
      let seconds = Math.floor(timeInSeconds % 60);
      console.log(timeInSeconds);

      options.body = JSON.stringify({
        lectureId: this.lectureId,
        content: this.content,
        hour: hours,
        minute: minutes,
        second: seconds,
      });

      try {
        const url = `/api/annotation`;
        const res = await fetch(url, options);
        if (!res.ok) {
          throw new Error(res.error);
        }

        this.content = "";
        if (this.callback) this.callback();
        // this.getAnnotations();
      } catch (e) {}
    },
  },
};
</script>

<style scoped>
textarea {
  width: 100%;
  height: 50px;
  resize: none;
  background: #dcdada;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 5px;
  font-size: 14px;
  outline: none;
}
</style>
