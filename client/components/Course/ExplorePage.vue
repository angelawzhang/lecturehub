<template>
  <div class="explore">
    <h1 class="explore-text fadeFast">Explore</h1>
    <div class="fadeFast">Explore and enroll in active classes!</div>
    <br />
    <br />
    <b-card-group class="fadeMedium" deck>
      <b-card
        v-for="course in $store.state.courses"
        v-if="
          !$store.state.enrolled
            .map((course) => course._id)
            .includes(course._id)
        "
        class="card"
        border-variant="Secondary"
        header-tag="header"
        header-text-variant="black"
        header-class="color"
        body-class="color"
        style="max-width: 15rem"
      >
        <template #header>
          <h6 class="mb-0">{{ course.term }} {{ course.year }}</h6>
        </template>
        <router-link class="color" :to="'/course/' + course._id">{{
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
        console.log(this.$store.state.courses);
        console.log(this.$store.state.enrolled);
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
  padding: 30px;
}
.explore-text {
  font-weight: bold;
  padding-bottom: 10px;
}

.color {
  background-color: #b3d2d3;
  color: black;
  text-decoration: none;
}
</style>
