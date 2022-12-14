<template>
    <div>
      <div>
        <div>Course Name</div>
        <input
          :placeholder="'Enter a course name'"
          @input="name = $event.target.value"
        />
        <div>Course Description</div>
        <input
          :placeholder="'Enter a course description'"
          @input="description = $event.target.value"
        />
      </div>
      <div>
        Term: {{ term }}
        <select v-model="term">
          <option v-bind:value="'SPRING'">Spring</option>
          <option v-bind:value="'FALL'">Fall</option>
        </select>
      </div>
      <div>
        Year: {{ year }}
        <select v-model="year">
          <option v-bind:value="2022">2022</option>
          <option v-bind:value="2023">2023</option>
        </select>
      </div>
      <button @click="submit">Confirm</button>
    </div>
  </template>
  
  <script>
  import router from "@/router.ts";
  export default {
    name: "CreatePage",
    data() {
      return {
        term: "FALL",
        year: 2022,
        name: "",
        description: "",
      };
    },
  
    methods: {
      async submit() {
        const options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin", // Sends express-session credentials with request
        };
        options.body = JSON.stringify({
          name: this.name,
          term: this.term,
          year: this.year,
          description: this.description,
        });
  
        try {
          const url = "/api/course";
          const r = await fetch(url, options);
          const res = await r.json();
  
          if (!r.ok) throw new Error(res.error);
  
          this.name = "";
          this.term = "FALL";
          this.year = 2022;
  
          const courseId = res.course._id;
          this.$store.commit("refreshInstructing");
          router.push({ path: `course/${courseId}` });
        } catch (e) {}
      },
    },
  };
  </script>
  