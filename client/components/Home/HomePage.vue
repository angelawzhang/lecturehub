<template>
  <div>
    <div class="home">
      <div v-if="$store.state.name">
        <h1 class="homeTitleText fadeFast">
          Welcome, {{ this.$store.state.name }}!
        </h1>
        <div v-if="$store.state.student">
          <div class="courseSection fadeMedium">Your Courses:</div>
          <i
            class="fadeSlow"
            v-if="
              $store.state.enrolled.filter((course) => course.active).length ===
              0
            "
          >
            None
          </i>
          <b-card-group deck class="fadeMedium">
            <b-card
              v-for="course in $store.state.enrolled"
              v-if="course.active"
              class="card"
              border-variant="Secondary"
              header-tag="header"
              header-text-variant="black"
              header-class="color"
              body-class="color"
              style="min-width: 15rem; max-width: 15rem; margin-bottom: 30px"
            >
              <template #header>
                <h6 class="mb-0">{{ course.term }} {{ course.year }}</h6>
              </template>
              <router-link class="color" :to="'/course/' + course._id">{{
                course.name
              }}</router-link>
            </b-card>
          </b-card-group>

          <div class="courseSection fadeSlow">Previous Courses:</div>
          <i
            class="fadeSlow"
            v-if="
              $store.state.enrolled.filter((course) => !course.active)
                .length === 0
            "
          >
            None
          </i>
          <b-card-group deck class="fadeSlow">
            <b-card
              v-for="course in $store.state.enrolled"
              v-if="!course.active"
              class="card"
              border-variant="Secondary"
              header-tag="header"
              header-text-variant="black"
              header-class="color"
              body-class="color"
              style="min-width: 15rem; max-width: 15rem; margin-bottom: 30px"
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
        <div v-else>
          <div class="courseSection fadeMedium">Your Taught Courses:</div>
          <i
            class="fadeSlow"
            v-if="
              $store.state.instructing.filter((course) => course.active)
                .length === 0
            "
          >
            None
          </i>
          <b-card-group deck class="fadeMedium">
            <b-card
              v-for="course in $store.state.instructing"
              v-if="course.active"
              class="card"
              border-variant="Secondary"
              header-tag="header"
              header-text-variant="black"
              header-class="color"
              body-class="color"
              style="min-width: 15rem; max-width: 15rem; margin-bottom: 30px"
            >
              <template #header>
                <h6 class="mb-0">{{ course.term }} {{ course.year }}</h6>
              </template>
              <router-link class="color" :to="'/course/' + course._id">{{
                course.name
              }}</router-link>
            </b-card>
          </b-card-group>
          <div class="courseSection fadeSlow">Previously Taught Courses:</div>

          <i
            class="fadeSlow"
            v-if="
              $store.state.instructing.filter((course) => !course.active)
                .length === 0
            "
          >
            None
          </i>
          <b-card-group deck class="fadeSlow">
            <b-card
              v-for="course in $store.state.instructing"
              v-if="!course.active"
              class="card"
              border-variant="Secondary"
              header-tag="header"
              header-text-variant="black"
              header-class="color"
              body-class="color"
              style="min-width: 15rem; max-width: 15rem; margin-bottom: 30px"
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
      </div>
      <div v-else>
        <h1>Welcome to LectureHub!</h1>
        <p>Login or create an account to continue.</p>
      </div>
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
  padding: 30px;
}

.homeTitleText {
  font-weight: bold;
}

.courseSection {
  padding-top: 20px;
  padding-bottom: 10px;
}

.color {
  background-color: #b3d2d3;
  color: black;
  text-decoration: none;
}
</style>
