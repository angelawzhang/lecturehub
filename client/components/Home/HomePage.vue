<template>
  <div class="home">
    <div v-if="$store.state.name">
      <h1 class="homeTitleText">Welcome, {{ this.$store.state.name }}!</h1>
      <div v-if="$store.state.student">
        <div class="courseSection">Your Courses:</div>

        <b-card-group deck>
          <b-card
            v-for="course in $store.state.enrolled"
            v-if="course.active"
            class="card"
            border-variant="Secondary"
            header-tag="header"
            header-bg-variant="light"
            header-text-variant="grey"
            style="max-width: 15rem"
          >
            <template #header>
              <h6 class="mb-0">{{ course.term }} {{ course.year }}</h6>
            </template>
            <router-link :to="'/course/' + course._id">{{
              course.name
            }}</router-link>
          </b-card>
        </b-card-group>

        <div class="courseSection">Previous Courses:</div>
        <b-card-group deck>
          <b-card
            v-for="course in $store.state.enrolled"
            v-if="!course.active"
            class="card"
            border-variant="Secondary"
            header-tag="header"
            header-bg-variant="light"
            header-text-variant="grey"
            style="max-width: 15rem"
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
  </div>
</template>

<script>
export default {
  name: "HomePage",
};
</script>

<style scoped>
.home {
  padding-top: 30px;
  padding-left: 40px;
}

.homeTitleText {
  font-weight: bold;
}

.courseSection {
  padding-top: 20px;
  padding-bottom: 10px;
}
</style>
