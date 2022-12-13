<template>
  <div class="annotationSectionContainer">
    <div class="annotationsTitle">
        Annotations
    </div>
    <div class="annotationsContainer">
      <div v-for="annotations in this.annotations" class="annotationChainContainer">
        <AnnotationComponent 
          :callback="getAnnotations"
          :annotationObject="annotations"
          :setTime="setTime" />
      </div>
    </div>
    <CreateAnnotationForm
      :callback="getAnnotations"
      :lectureId="lectureId"
      :placeholderContent="'Create a new annotation'"
      :getTime="getTime"
    />
  </div>
</template>
<script>
import CreateAnnotationForm from "@/components/Annotations/CreateAnnotationForm.vue";
import AnnotationComponent from "@/components/Annotations/AnnotationComponent.vue";
export default {
  name: "AnnotationSection",
  components: {
    CreateAnnotationForm,
    AnnotationComponent,
  },
  data() {
    return {
      annotations: {},
      content: "",
    };
  },
  props: {
    lectureId: {
      type: String,
      required: true,
    },
    getTime: {
      type: Function,
    },
    setTime: {
      type: Function,
    }
  },
  methods: {
    async getAnnotations() {
      try {
        const res = await fetch(`/api/annotation?lectureId=${this.lectureId}`);
        const annotations = await res.json();
        if (!res.ok) {
          throw new Error(res.error);
        }
        this.annotations = annotations.annotations;
        console.log(annotations.annotations);
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },

  mounted() {
    this.getAnnotations();
  },
};
</script>

<style scoped>
.annotationsContainer {
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: scroll;
  overflow: scroll;
  overflow:scroll;
  padding-bottom: 5rem;
}

.annotationsTitle {
  border-width: 3px;
  border-style: none none double none;
  text-align: center;
  width: 100%;
}
.annotationChainContainer {
  /* border-style: solid none none none; */
  border-style: none none solid none;
  border-width: 0.5px;
  /* border: 0px; */
  /* border-bottom: 1px; */
  padding: 8px;
}

.annotationSectionContainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-top: -30px;
  margin-bottom: -20px;
  background-color: #8eced2;;
  padding: 20px;
  padding-bottom: 70px;
  border-radius: 15px;
}

.childAnnotation {
  margin-left: 25px;
}
</style>
