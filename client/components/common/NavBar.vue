<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <div class="navContainer">
      <div class="titleAndLogo">
        <h1 class="title">LectureHub</h1>
        <img src="../../public/logo.svg">
      </div>
      
      <div v-if="$store.state.name" class="routerContainer">
        <router-link to="/"> Home </router-link>
        <router-link v-if="$store.state.student" to="/explore">
          Explore
        </router-link>
        <router-link v-else to="/create"> Create </router-link>
        <router-link to="/account"> Profile </router-link>
        <!-- <router-link v-else to="/login"> Login </router-link> -->
      </div>
      <!-- <section class="alerts">
        <article
          v-for="(status, alert, index) in $store.state.alerts"
          :key="index"
          :class="status"
        >
          <p>{{ alert }}</p>
        </article>
      </section> -->
      <router-link v-if="!$store.state.name" to="/login"> Login </router-link>

      <a v-else v-on:click="logout" href="">Logout</a>
    </div>
  </nav>
</template>

<script>
export default {
  methods: {
    async logout() {
      const url = "/api/users/session";
      const options = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // Sends express-session credentials with request
      };

      const callback = () => {
        this.$router.push({ name: "Not Found" }); // Goes to Home page after signing out
        this.$store.commit("alert", {
          message: "You are now signed out!",
          status: "success",
        });
      };

      try {
        const r = await fetch(url, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit("setUsername", null);

        callback();
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>
<style scoped>
nav {
  padding: 1vw 2vw;
  background-color: #8eced2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* position: relative; */
  height: 100vh;
  /* position: fixed; */
  /* position: sticky; */
  float: left;
}

.title {
  font-size: 32px;
  margin: 0 5px;
}

img {
  height: 32px;
}

.navContainer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  text-align: center;
}

.titleAndLogo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.routerContainer {
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
}
.left {
  display: flex;
  align-items: center;
  /* float: left; */
}

.right {
  font-size: 20px;
  display: grid;
  gap: 16px;
  grid-auto-flow: column;
  align-items: center;
}

.right a {
  margin-left: 5px;
}

.alerts {
  width: 25%;
}
</style>
