import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    id: null,
    student: true,
    name: null, // Username of the logged in user
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    courses: [],
    enrolled: [],
    instructing: [],
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, name) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.name = name;
    },
    setId(state, id) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.id = id;
    },

    setCourses(state, courses) {
      state.courses = courses;
    },

    async refreshEnrolled(state) {
      const url = "/api/course/student";
      const res = await fetch(url).then(async (res) => res.json());
      state.enrolled = res.courses;
    },

    async refreshInstructing(state) {
      const url = `/api/course/instructor?userId=${state.id}`;
      const res = await fetch(url).then(async (res) => res.json());
      state.instructing = res.courses;
    },

    setStudent(state, status) {
      state.student = status;
    },
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()],
});

export default store;
