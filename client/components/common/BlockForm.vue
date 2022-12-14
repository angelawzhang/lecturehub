<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form @submit.prevent="submit">
    <h3>{{ title }}</h3>
    <article v-if="fields.length">
      <div v-for="field in fields" :key="field.id">
        <label :for="field.id">{{ field.label }}:</label>
        <div v-if="field.id === 'isStudent'">
          <b-button
            class="button"
            type="button"
            :variant="isStudent ? 'info' : 'secondary'"
            @click="toggle"
          >
            Student
          </b-button>
          <b-button
            class="button"
            type="button"
            :variant="!isStudent ? 'info' : 'secondary'"
            @click="toggle"
          >
            Instructor
          </b-button>
        </div>
        <textarea
          v-if="field.id === 'content'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        />
        <input
          v-if="field.id !== 'isStudent' && field.id !== 'content'"
          :type="field.id === 'password' ? 'password' : 'text'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        />
      </div>
    </article>
    <article v-else>
      <p>{{ content }}</p>
    </article>
    <b-button class="button" variant="info" @click="submit"> Confirm </b-button>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </form>
</template>

<script>
export default {
  name: "BlockForm",
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      url: "", // Url to submit form to
      method: "GET", // Form request method
      hasBody: false, // Whether or not form request has a body
      setUsername: false, // Whether or not stored username should be updated after form submission
      alerts: {}, // Displays success/error messages encountered during form submission
      callback: null, // Function to run after successful form submission,
      isStudent: true,
    };
  },
  methods: {
    toggle() {
      this.isStudent = !this.isStudent;
    },
    async submit() {
      /**
       * Submits a form with the specified options from data().
       */
      const options = {
        method: this.method,
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // Sends express-session credentials with request
      };
      if (this.hasBody) {
        options.body = JSON.stringify(
          Object.fromEntries(
            this.fields.map((field) => {
              if (field.id === "isStudent") {
                field.value = this.isStudent;
              }
              const { id, value } = field;
              field.value = "";
              return [id, value];
            })
          )
        );
      }

      try {
        const r = await fetch(this.url, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        if (this.setUsername) {
          const text = await r.text();
          const res = text ? JSON.parse(text) : { user: null };
          this.$store.commit("setUsername", res.user ? res.user.name : null);
          this.$store.commit("setId", res.user ? res.user._id : null);
          this.$store.commit(
            "setStudent",
            res.user ? res.user.isStudent : null
          );
          this.$store.commit("refreshEnrolled");
          this.$store.commit("refreshInstructing");
        }

        if (this.callback) {
          this.callback();
        }
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style scoped>
form {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
}

article > div {
  display: flex;
  flex-direction: column;
}

form > article p {
  margin: 0;
}

form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}

textarea {
  font-family: inherit;
  font-size: inherit;
}

input {
  background-color: #dcdada;
  border-radius: 10px;
  width: 20rem;
  height: 2.5rem;
  padding-left: 10px;
}

input:focus {
  text-decoration: none;
  outline: none;
}

.button {
  width: 6rem;
  height: 2.5rem;
  border-radius: 10px;
  margin-right: 10px;
}

.button:active {
  background-color: green;
}
.button.active {
  background-color: green;
}
</style>
