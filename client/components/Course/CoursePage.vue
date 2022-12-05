<template>
    <div>
      <h2>{{ this.course.name }}</h2>
  
      <h3 v-if="course.term">
        {{ this.course.term.charAt(0) + this.course.term.slice(1).toLowerCase() }}
        {{ this.course.year }}
      </h3>
  
      <div v-if="$store.state.student">
        <div v-if="course.active">
          <button v-if="!enrolled" @click="enroll">Enroll</button>
          <button v-else @click="unenroll">Unenroll</button>
        </div>
        <div v-else>
          This class is inactive and you can no longer enroll or unenroll in it.
        </div>
      </div>
      <div v-else>
        <button v-if="active" @click="deactivate">Deactivate Course</button>
        <button v-else @click="activate">Activate Course</button>
        <button @click="deleteCourse">Delete Course</button>
      </div>
      <p></p>
      <div>
        <div>Lectures</div>
        <div v-for="lecture in lectures">
          <router-link :to="'/lecture/' + lecture._id">
            {{ lecture.name }}</router-link
          >
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import router from "@/router.ts";
  export default {
    name: "CoursePage",
    data() {
      return {
        course: {},
        lectures: [],
        enrolled: false,
        active: false,
      };
    },
    methods: {
      async getCourse() {
        try {
          const url = `/api/course/id?courseId=${this.$route.params.courseId}`;
          const res = await fetch(url);
          const course = await res.json();
          if (!res.ok) {
            throw new Error(res.error);
          }
  
          this.course = course.course;
          this.active = this.course.active;
          this.enrolled = this.course.enrolled.includes(this.$store.state.id);
        } catch (e) {}
      },
  
      async getLectures() {
        try {
          const url = `/api/lecture/course?courseId=${this.$route.params.courseId}`;
          const res = await fetch(url);
          const lectures = await res.json();
  
          if (!res.ok) {
            throw new Error(res.error);
          }
          this.lectures = lectures.lectures;
        } catch (e) {}
      },
  
      async changeEnrollment(enrolling) {
        try {
          const url = enrolling
            ? `/api/course/add-student`
            : `/api/course/delete-student`;
          const options = {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
          };
          options.body = JSON.stringify({
            courseId: this.course._id,
          });
          const res = await fetch(url, options);
          const lectures = await res.json();
  
          if (!res.ok) {
            throw new Error(res.error);
          }
          this.enrolled = enrolling;
          this.$store.commit("refreshEnrolled");
        } catch (e) {}
      },
  
      async enroll() {
        this.changeEnrollment(true);
      },
  
      async unenroll() {
        this.changeEnrollment(false);
      },
  
      async changeActivity(activating) {
        try {
          const url = activating
            ? `/api/course/activate`
            : `/api/course/deactivate`;
          const options = {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
          };
          options.body = JSON.stringify({
            courseId: this.course._id,
          });
          const res = await fetch(url, options);
          const lectures = await res.json();
  
          if (!res.ok) {
            throw new Error(res.error);
          }
          this.active = activating;
        } catch (e) {}
      },
  
      async activate() {
        this.changeActivity(true);
      },
  
      async deactivate() {
        this.changeActivity(false);
      },
  
      async deleteCourse() {
        try {
          const url = "/api/course";
          const options = {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
          };
          options.body = JSON.stringify({
            courseId: this.course._id,
          });
          const res = await fetch(url, options);
          const lectures = await res.json();
  
          if (!res.ok) {
            throw new Error(res.error);
          }
          this.$store.commit("refreshInstructing");
          router.push({ name: "Home" });
        } catch (e) {}
      },
    },
  
    mounted() {
      this.getCourse();
      this.getLectures();
    },
  };
  </script>
  