<template>
    <div>
      <h1>{{ this.lecture.name }}</h1>
      <video id="lecture" v-if="src !== ''" width="500" height="500" controls>
        <source :src="src" type="video/mp4" />
      </video>
      <button @click="getTime">Click to print time</button>
      <PostSection :lectureId="$route.params.lectureId" />
    </div>
  </template>
  
  <script>
  import PostSection from "@/components/Posts/PostSection.vue";
  
  export default {
    name: "LecturePage",
    data() {
      return {
        lecture: {},
        src: "",
        vid: null,
      };
    },
    components: {
      PostSection,
    },
  
    methods: {
      async getLecture() {
        try {
          const url = `/api/lecture/id?lectureId=${this.$route.params.lectureId}`;
          const res = await fetch(url);
          const lecture = await res.json();
          if (!res.ok) {
            throw new Error(res.error);
          }
  
          this.lecture = lecture.lecture;
          this.src = lecture.lecture.src;
          this.vid = document.getElementById("lecture");
          console.log(this.vid.currentTime);
          console.log("LECTURE", this.lecture);
          console.log(this.src);
        } catch (e) {}
      },
      getTime() {
        const vid = document.getElementById("lecture");
        console.log(vid.currentTime);
      },
    },
  
    mounted() {
      this.getLecture();
    },
  };
  </script>
  