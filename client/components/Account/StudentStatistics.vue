<template>
  <div>
    <div v-if="!annotationsFetched || !postsFetched">Loading Statistics...</div>
    <div v-else class="statsContainer">
      <div>
        <h2>Lifetime Statistics</h2>
        <div class="column">
          <div>
            {{ $store.state.enrolled.length }}
            {{ $store.state.enrolled.length === 1 ? "Class" : "Classes" }} Taken
          </div>
          <div>
            {{ annotations }} Personal
            {{ annotations === 1 ? "Annotation" : "Annotations" }}
          </div>
          <div>{{ posts }} {{ posts === 1 ? "Post" : "Posts" }} Created</div>
        </div>
      </div>
      <img src="@/public/trophy.png" width="200px" />
    </div>
  </div>
</template>

<script>
export default {
  name: "StudentStatistics",
  data() {
    return {
      annotations: 0,
      posts: 0,
      annotationsFetched: false,
      postsFetched: false,
    };
  },

  methods: {
    async getAnnotationCount() {
      try {
        const url = "/api/annotation/user";
        const res = await fetch(url);
        const annotations = await res.json();
        if (!res.ok) {
          throw new Error(res.error);
        }
        this.annotations = annotations.annotations.length;
        this.annotationsFetched = true;
      } catch (e) {}
    },

    async getPostCount() {
      try {
        const url = "/api/post/user";
        const res = await fetch(url);
        const posts = await res.json();
        if (!res.ok) {
          throw new Error(res.error);
        }
        this.posts = posts.posts.length;
        this.postsFetched = true;
      } catch (e) {}
    },
  },
  mounted() {
    this.getAnnotationCount();
    this.getPostCount();
  },
};
</script>

<style scoped>
div {
  font-size: 25px;
}

.statsContainer {
  display: flex;
  justify-content: space-between;
  width: 60%;
}

.column {
  padding: 0.5rem;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
