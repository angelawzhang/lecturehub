<template>
  <div>
    <textarea
      :placeholder="placeholderContent"
      :value="content"
      @input="content = $event.target.value"
    />
    <button @click="submit">Submit</button>
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
      second: ""
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
  },
  methods: {
    async submit() {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
      };
      options.body = JSON.stringify({
        lectureId: this.lectureId,
        content: this.content,
        hour: this.hour,
        minute: this.minute,
        second: this.second
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
