<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <div class="account">
    <h1 class="fadeFast">Welcome, {{ $store.state.name }}</h1>

    <StudentStatistics
      v-if="$store.state.student"
      class="stats fadeMedium"
    ></StudentStatistics>

    <div class="fadeSlow">
      <h3>Account Management</h3>
      <ChangeUsernameForm />
      <ChangePasswordForm />
    </div>
  </div>
</template>

<script>
import ChangeUsernameForm from "@/components/Account/ChangeUsernameForm.vue";
import ChangePasswordForm from "@/components/Account/ChangePasswordForm.vue";
import DeleteAccountForm from "@/components/Account/DeleteAccountForm.vue";
import LogoutForm from "@/components/Account/LogoutForm.vue";
import StudentStatistics from "@/components/Account/StudentStatistics.vue";

export default {
  name: "AccountPage",
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    DeleteAccountForm,
    LogoutForm,
    StudentStatistics,
  },
};
</script>

<style scoped>
.account {
  padding: 30px;
}

.stats {
  margin-top: 30px;
  margin-bottom: 20px;
}
</style>
