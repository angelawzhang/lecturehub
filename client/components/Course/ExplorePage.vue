<template>
  <div class="explore">
    <h1 class="explore-text">Explore</h1>
    Explore and enroll in active classes!
    <br />
    <br />
    <b-card-group deck>
      <b-card
        v-for="course in $store.state.courses"
        class="card"
        border-variant="Secondary"
        header-tag="header"
        header-bg-variant="light"
        header-text-variant="grey"
      >
        <template #header>
          <h6 class="mb-0">{{ course.term }} {{ course.year }}</h6>
        </template>
        <router-link :to="'/course/' + course._id">{{
          course.name
        }}</router-link>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
export default {
  name: "ExplorePage",

  data() {
    return {
      courses: [],
    };
  },

  methods: {
    async getCourses() {
      try {
        const url = "/api/course";
        const res = await fetch(url);
        const courses = await res.json();
        if (!res.ok) {
          throw new Error(res.error);
        }
        this.$store.commit("setCourses", courses.courses);
      } catch (e) {}
    },
  },

  mounted() {
    this.getCourses();
  },
};
</script>

<style scoped>
.explore {
  padding-top: 30px;
  padding-left: 40px;
}
.explore-text {
  font-weight: bold;
  padding-bottom: 10px;
}
</style>
