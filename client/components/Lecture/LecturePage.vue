<template>
  <div>
    <div class="lectureContainer fadeFast">
      <h1>{{ this.lecture.name }}</h1>
      <div class="middleContainer">
        <video id="lecture" v-if="src !== ''" class="video" controls>
          <source :src="src" />
        </video>
        <video v-else class="video"></video>
        <div class="annotationsContainer">
          <AnnotationSection
            :lectureId="$route.params.lectureId"
            :getTime="getTime"
            :setTime="setTime"
          />
        </div>
      </div>
      <PostSection :lectureId="$route.params.lectureId" />
    </div>
  </div>
</template>

<script>
import PostSection from "@/components/Posts/PostSection.vue";
import AnnotationSection from "@/components/Annotations/AnnotationSection.vue";

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
    AnnotationSection,
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
    },
  },

  mounted() {
    this.getLecture();
  },
};
</script>

<style scoped>
.lectureContainer {
  padding: 30px;
  width: 100%;
  height: 100%;
}
.middleContainer {
  height: 65%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 8px;
  padding: 0;
  gap: 10px;
  margin-bottom: 20px;
}

.annotationsContainer {
  width: 30%;
}

.video {
  width: 70%;
}
</style>
