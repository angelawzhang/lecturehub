<template>
  <div class="annotationSectionContainer">
    <div class="annotationsContainer">
      <div v-for="annotations in this.annotations" class="annotationChainContainer">
        <AnnotationComponent 
          :callback="getAnnotations"
          :annotationObject="annotations" />
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
  height: 100%;
}
.annotationChainContainer {
  border-style: solid;
  padding: 8px;
}

.annotationSectionContainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  height: 50vh;
}

.childAnnotation {
  margin-left: 25px;
}
</style>
