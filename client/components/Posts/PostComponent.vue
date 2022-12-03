<template>
  <div class="postContainer">
    <div v-if="!editing">
      <div>{{ this.content }}</div>

      <button
        v-if="this.postObject.authorId === this.$store.state.id"
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
    <div>{{ this.postObject.author }} on {{ this.postObject.dateCreated }}</div>
  </div>
</template>

<script>
export default {
  name: "PostComponent",
  props: {
    postObject: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editing: false,
      content: this.postObject.content,
    };
  },
  methods: {
    switchEditing() {
      this.editing = !this.editing;
      this.content = this.postObject.content;
    },
    async submit() {
      const options = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
      };
      options.body = JSON.stringify({
        postId: this.postObject._id,
        content: this.content,
      });

      try {
        const url = `/api/post`;
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
.postContainer {
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  margin-bottom: 8px;
}
</style>
