<template>
    <div>
      Explore and enroll in active classes!
  
      <div v-for="course in $store.state.courses">
        <router-link :to="'/course/' + course._id">{{ course.name }}</router-link>
      </div>
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
  