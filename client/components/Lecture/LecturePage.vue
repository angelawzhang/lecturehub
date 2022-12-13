<template>
    <div>
      <h1>{{ this.lecture.name }}</h1>
      <div class="container"> 
        <div class="videoContainer">
            <video id="lecture" v-if="src !== ''" width="800" height="500" controls>
            <source :src="src" type="video/mp4" />
            </video>
        </div>
        <div class="annotationsContainer">
            <AnnotationSection :lectureId="$route.params.lectureId" :getTime="getTime" :setTime="setTime"/>
        </div>
      </div>
      <!-- <button @click="getTime">Click to print time</button> -->
      <PostSection :lectureId="$route.params.lectureId" />
    </div>
  </template>
  
  <script>
  import PostSection from "@/components/Posts/PostSection.vue";
  import AnnotationSection from "@/components/Annotations/AnnotationSection.vue"
    
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
      AnnotationSection
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
          console.log("HERE 1");
          console.log(this.vid);
          console.log("HERE 2")
          console.log("LECTURE", this.lecture);
          console.log(this.src);
          console.log("HERE 2");
        } catch (e) {}
      },
      getTime() {
        const vid = document.getElementById("lecture");
        console.log(vid.currentTime);
        return vid.currentTime;
      },

      setTime(time) {
        const vid = document.getElementById("lecture");
        vid.currentTime = time;
      }
    },
  
    mounted() {
      this.getLecture();
    },
  };
  </script>
  


<style scoped>
.container {
  display: flex;
  flex-direction: row;
  margin-top: 8px;
  margin-bottom: 8px;
  height: 70vh;
}

.annotationsContainer {
    padding-left: 20px;
    padding-top: 50px;
    height: 530px;
}

.videoContainer {
    border-radius: 20px;
    border-width: 2px;
    border-color:black;
}
</style>