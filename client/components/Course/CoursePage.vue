<template>
  <div>
    <div class="course fadeFast">
      <div v-if="!loaded">Loading course information...</div>
      <div v-else class="course-header">
        <h1 class="course-name">{{ this.course.name }}</h1>
        <div class="course-button" v-if="$store.state.student">
          <div v-if="course.active">
            <b-button variant="info" v-if="!enrolled" @click="enroll"
              >Enroll</b-button
            >
            <b-button variant="danger" v-else @click="unenroll"
              >Unenroll</b-button
            >
          </div>
          <div v-else>
            This class is inactive and you can no longer enroll or unenroll in
            it.
          </div>
        </div>
        <div v-else>
          <b-button variant="info" v-if="active" @click="deactivate"
            >Deactivate Course</b-button
          >
          <b-button variant="success" v-else @click="activate"
            >Activate Course</b-button
          >
          <b-button class="button" v-b-modal="'delete-modal'" variant="danger"
            >Delete Course</b-button
          >
          <b-modal
            id="delete-modal"
            hide-footer
            ok-title="Yes"
            cancel-title="No"
          >
            <div class="d-block text-center">
              <h4>Delete This Course?</h4>
            </div>
            <b-button
              class="mt-3"
              id="cancel-action-modal"
              block
              @click="$bvModal.hide('delete-modal')"
              >Cancel</b-button
            >
            <b-button
              class="mt-3"
              id="delete-course-modal"
              block
              @click="deleteCourse"
              >Delete</b-button
            >
          </b-modal>
        </div>
      </div>

      <h3 class="course-info" v-if="course.term">
        Instructor: {{ this.instructor }} &mdash;
        {{
          this.course.term.charAt(0) + this.course.term.slice(1).toLowerCase()
        }}
        {{ this.course.year }}
      </h3>
      <h3 class="course-info" v-if="course.description">
        Description: {{ this.course.description }}
      </h3>
      <hr class="line-break" />
      <p></p>
      <div>
        <div class="lecture-header">
          <h2>Lectures</h2>
          <div v-if="!$store.state.student">
            <b-button variant="success" @click="addLecture"
              >Add Lecture</b-button
            >
            <CreateLectureForm
              ref="addModal"
              :courseId="$route.params.courseId"
              :placeholderContent="'Create a new lecture'"
            />
          </div>
        </div>

        <div v-for="lecture in lectures">
          <div class="course-header">
            <router-link class="blue" :to="'/lecture/' + lecture._id">
              {{ lecture.name }}</router-link
            >
            <h3 class="course-info">{{ lecture.date.split(",")[0] }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from "@/router.ts";
import CreateLectureForm from "@/components/Course/CreateLectureForm.vue";
export default {
  name: "CoursePage",
  components: {
    CreateLectureForm,
  },
  data() {
    return {
      course: {},
      lectures: [],
      enrolled: false,
      active: false,
      instructor: "",
      loaded: false,
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

        this.loaded = true;
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
        console.log(this.lectures);
      } catch (e) {}
    },

    async getInstructor() {
      try {
        const url = `/api/course/instructor-name?courseId=${this.$route.params.courseId}`;
        const res = await fetch(url);
        const user = await res.json();

        if (!res.ok) {
          throw new Error(res.error);
        }
        this.instructor = user.user.name;
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

        // allows deactivate/activate course to be reflected on home page without refresh
        this.$store.commit("refreshInstructing");
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
      this.$bvModal.hide("delete-modal");
    },

    addLecture() {
      this.$root.$emit("bv::show::modal", "addModal");
    },
  },

  mounted() {
    this.getCourse();
    this.getLectures();
    this.getInstructor();
  },
};
</script>

<style scoped>
.course {
  padding: 30px;
}
.course-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 8px;
  margin-bottom: 8px;
}
.lecture-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}
.course-name {
  font-weight: bold;
}

.course-button {
  display: flex;
  justify-content: center;
  align-items: center;
}
.course-info {
  font-size: large;
  color: #8eced2;
}

#delete-course-modal {
  background-color: #d11a2a;
}

.button {
  margin-left: 10px;
}
.line-break {
  background-color: #60a7ac;
}
</style>
