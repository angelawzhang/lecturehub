<template>
  <div class="appContainer">
    <NavBar />
    <router-view class="sideContainer" />
  </div>
</template>

<script>
import NavBar from "@/components/common/NavBar.vue";

import Vue from "vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

export default {
  name: "App",
  components: { NavBar },
  beforeCreate() {
    // Sync stored username to current session
    fetch("/api/users/session", {
      credentials: "same-origin", // Sends express-session credentials with request
    })
      .then((res) => res.json())
      .then((res) => {
        const user = res.user;
        this.$store.commit("setUsername", user ? user.name : null);
        this.$store.commit("setId", user ? user._id : null);
        this.$store.commit("setStudent", user ? user.isStudent : null);
      });

    // Clear alerts on page refresh
    this.$store.state.alerts = {};
  },

  mounted() {
    this.$store.state.student
      ? this.$store.commit("refreshEnrolled")
      : this.$store.commit("refreshInstructing");
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;1,300;1,400&display=swap");
* {
  box-sizing: border-box;
}

body {
  height: 100vh;
  flex-direction: column;
  /* flex-direction: row; */
  display: flex;
  padding: 0;
  margin: 0;
  font-size: 1.2em;
  font-family: "Lato", sans-serif;
}

main {
  padding: 0 5em 5em;
}

div,
h3 {
  color: #8eced2;
}
.appContainer {
  display: flex;
  height: 100vh;
  width: 100vw;
}

.sideContainer {
  height: 100%;
  width: 100vw;
  overflow: scroll;
  background-color: #2c2d32;
}

.alerts {
  position: absolute;
  z-index: 99;
  bottom: 0;
  top: 100%;
  left: 50%;
  transform: translate(-50%, 10%);
  width: 100%;
  text-align: center;
}

.alerts article {
  border-radius: 5px;
  padding: 10px 20px;
  color: #fff;
}

.alerts p {
  margin: 0;
}

.alerts .error {
  background-color: rgb(166, 23, 33);
}

.alerts .success {
  background-color: rgb(45, 135, 87);
}

a:link {
  text-decoration: none;
}

a:visited {
  text-decoration: none;
}

a:hover {
  text-decoration: none;
}

a:active {
  text-decoration: none;
}

textarea {
  width: 80%;
  height: 100%;
  resize: none;
  background: #dcdada;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 5px;
  font-size: 14px;
  outline: none;
}

button:focus {
  outline: 0;
}

.black {
  color: black;
}

.black:hover {
  color: black;
}
.blue {
  color: #8eced2;
}

.blue:hover {
  color: #719395;
}

@keyframes fadeFast {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.fadeFast {
  animation: fadeFast 1s cubic-bezier(0.4, 0, 0.6, 1);
  animation-fill-mode: forwards;
}

@keyframes fadeMedium {
  0% {
    opacity: 0;
  }
  66% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.fadeMedium {
  animation: fadeMedium 1.3s cubic-bezier(0.4, 0, 0.6, 1);
  animation-fill-mode: forwards;
}

@keyframes fadeSlow {
  0% {
    opacity: 0;
  }
  75% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.fadeSlow {
  animation: fadeSlow 1.9s cubic-bezier(0.4, 0, 0.6, 1);
  animation-fill-mode: forwards;
}
</style>
