<template>
  <div class="annotationSectionContainer">
    <div class="annotationsTitle">Annotations</div>
    <div class="annotationsContainer">
      <div>
        <div
          v-for="annotations in this.annotations"
          class="annotationChainContainer"
        >
          <AnnotationComponent
            :callback="getAnnotations"
            :annotationObject="annotations"
            :setTime="setTime"
          />
        </div>
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
div {
  color: black;
}
.annotationsContainer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 6px;
  overflow: scroll;
  height: 100%;
}

.annotationsTitle {
  border-width: 3px;
  border-style: none none double none;
  text-align: center;
  width: 100%;
}
.annotationChainContainer {
  border-style: none none solid none;
  border-width: 0.5px;
  padding: 8px;
}

.annotationSectionContainer {
  display: flex;
  flex-direction: column;
  gap: 30px;
  background-color: #8eced2;
  padding: 20px;
  border-radius: 25px;
  width: 100%;
  height: 100%;
}

.childAnnotation {
  margin-left: 25px;
}
</style>
