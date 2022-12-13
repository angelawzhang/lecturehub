<template>
  <div>
    <textarea
      :placeholder="placeholder"
      :value="content"
      @input="content = $event.target.value"
    />
    <b-button variant="outline-primary" @click="submit">Submit</b-button>
  </div>
</template>

<script>
export default {
  name: "CreatePostForm",
  data() {
    return {
      content: "",
    };
  },
  props: {
    parentId: {
      type: String,
    },

    lectureId: {
      type: String,
      required: true,
    },

    callback: {
      type: Function,
    },
    placeholder: {
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
        parentId: this.parentId,
        content: this.content,
      });

      try {
        const url = `/api/post`;
        const res = await fetch(url, options);
        if (!res.ok) {
          throw new Error(res.error);
        }

        this.content = "";
        if (this.callback) this.callback();
        // this.getPosts();
      } catch (e) {}
    },
  },
};
</script>
