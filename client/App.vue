<template>
  <div id="app">
    <div class="appContainer">
      <NavBar />
      <router-view class="sideContainer" />
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/common/NavBar.vue";

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
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400&display=swap');
* {
  box-sizing: border-box;
}

body {
  height: 100vh;
  flex-direction: column;
  display: flex;
  padding: 0;
  margin: 0;
  font-size: 1.2em;
  font-family: 'Lato', sans-serif;
}

main {
  padding: 0 5em 5em;
}

.appContainer {
  display: flex;
  height: 100vh;
}

.sideContainer {
  width: 70%;
  padding-left: 10px;
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

a:link { text-decoration: none; }


a:visited { text-decoration: none; }


a:hover { text-decoration: none; }


a:active { text-decoration: none; }
</style>
