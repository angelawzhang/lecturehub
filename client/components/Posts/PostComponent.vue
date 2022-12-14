<template>
  <div class="postContainer">
    <div class="metadataContainer">
      <div>
        <div class="postAuthor">{{ this.postObject.author }}</div>
        <i class="postDate">{{ this.postObject.dateCreated }}</i>
      </div>
      <button
        class="btn"
        v-if="
          this.postObject.authorId === this.$store.state.id && !this.editing
        "
        @click="switchEditing"
      >
        <span class="editIcon"></span>
      </button>
    </div>
    <div v-if="!editing">
      <div class="postContent">{{ this.content }}</div>
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
  padding-left: 10px;
  width: 80%;
}

.metadataContainer {
  display: flex;
  gap: 20px;
}

.postDate {
  font-size: 13px;
  margin-bottom: 5px;
}

.postAuthor {
  font-size: 20px;
}

.editIcon {
  background: url("../../public/draw.png") no-repeat center;
  float: left;
  width: 30px;
  height: 30px;
}

.btn {
  padding: 0px;
  margin-top: -8px;
  outline: none;
}

.btn:focus {
  outline: none;
}
.buttons {
  margin: 4px;
  height: 40px;
  width: 100px;
  border-radius: 15px;
}
div {
  color: black;
}
</style>
