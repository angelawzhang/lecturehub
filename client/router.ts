import Vue from "vue";
import VueRouter from "vue-router";
import AccountPage from "./components/Account/AccountPage.vue";
import LoginPage from "./components/Login/LoginPage.vue";
import NotFound from "./NotFound.vue";
import ExplorePage from "./components/Course/ExplorePage.vue";
import CoursePage from "./components/Course/CoursePage.vue";
import LecturePage from "./components/Lecture/LecturePage.vue";
import HomePage from "./components/Home/HomePage.vue";
import CreatePage from "./components/Create/CreatePage.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", name: "Home", component: HomePage },
  { path: "/account", name: "Account", component: AccountPage },
  { path: "/login", name: "Login", component: LoginPage },
  { path: "/explore", name: "Explore", component: ExplorePage },
  { path: "/create", name: "Create", component: CreatePage },
  { path: "/course/:courseId", name: "Course", component: CoursePage },
  { path: "/lecture/:lectureId", name: "Lecture", component: LecturePage },
  { path: "*", name: "Not Found", component: NotFound },
];

const router = new VueRouter({ routes });

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    if (to.name === "Login" && router.app.$store.state.name) {
      next({ name: "Account" }); // Go to Account page if user navigates to Login and are signed in
      return;
    }

    if (
      (to.name === "Account" ||
        to.name === "Explore" ||
        to.name === "Course" ||
        to.name === "Lecture") &&
      !router.app.$store.state.name
    ) {
      next({ name: "Home" }); // Go to Login page if user navigates to Account and are not signed in
      return;
    }

    if (router.app.$store.state.student && to.name === "Create") {
      next({ name: "Home" });
      return;
    }
  }

  next();
});

export default router;
