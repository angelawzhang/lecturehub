<template>
    <div v-if="$store.state.name">
      <h1>Welcome, {{ this.$store.state.name }}</h1>
      <div v-if="$store.state.student">
        <div>Your Courses:</div>
        <div v-for="course in $store.state.enrolled">
          <router-link v-if="course.active" :to="'/course/' + course._id">{{
            course.name
          }}</router-link>
        </div>
  
        <p></p>
        <div>Previous Courses:</div>
        <div v-for="course in $store.state.enrolled">
          <router-link v-if="!course.active" :to="'/course/' + course._id">{{
            course.name
          }}</router-link>
        </div>
      </div>
      <div v-else>
        <div>Your Taught Courses:</div>
        <div v-for="course in $store.state.instructing">
          <router-link v-if="course.active" :to="'/course/' + course._id">{{
            course.name
          }}</router-link>
        </div>
        <div>Previous Taught Courses:</div>
        <div v-for="course in $store.state.instructing">
          <router-link v-if="!course.active" :to="'/course/' + course._id">{{
            course.name
          }}</router-link>
        </div>
      </div>
    </div>
    <div v-else>
      <h1>Welcome to LectureHub!</h1>
      <p>Login or create an account to continue.</p>
    </div>
  </template>
  
  <script>
  export default {
    name: "HomePage",
  };
  </script>
  