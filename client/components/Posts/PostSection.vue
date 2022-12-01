<template>
  <div class="postSectionContainer">
    <div class="postsContainer">
      <div v-for="posts in this.posts" class="postChainContainer">
        <PostComponent :postObject="posts[0]" />
        <PostComponent
          class="childPost"
          v-for="childPosts in posts.slice(1)"
          :postObject="childPosts"
        />
        <CreatePostForm
          :callback="getPosts"
          :lectureId="lectureId"
          :parentId="posts[0]._id"
          :placeholder="'Write a follow up'"
        />
      </div>
    </div>
    <CreatePostForm
      :callback="getPosts"
      :lectureId="lectureId"
      :placeholder="'Create a new post'"
    />
  </div>
</template>
<script>
import CreatePostForm from "@/components/Posts/CreatePostForm.vue";
import PostComponent from "@/components/Posts/PostComponent.vue";
export default {
  name: "PostSection",
  components: {
    CreatePostForm,
    PostComponent,
  },
  data() {
    return {
      posts: {},
      content: "",
    };
  },
  props: {
    lectureId: {
      type: String,
      required: true,
    },
  },
  methods: {
    async getPosts() {
      try {
        const res = await fetch(`/api/post?lectureId=${this.lectureId}`);
        const posts = await res.json();
        if (!res.ok) {
          throw new Error(res.error);
        }
        this.posts = posts.posts;
        console.log(posts.posts);
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },

  mounted() {
    this.getPosts();
  },
};
</script>

<style scoped>
.postsContainer {
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: scroll;
}
.postChainContainer {
  border-style: solid;
  padding: 8px;
}

.postSectionContainer {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 50vh;
}

.childPost {
  margin-left: 25px;
}
</style>
