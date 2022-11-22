<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>Welcome, {{ $store.state.username }}</h2>
      </header>
      <ChangeUsernameForm />
      <ChangePasswordForm />
    </section>
  </main>
</template>

<script>
import ChangeUsernameForm from "@/components/Account/ChangeUsernameForm.vue";
import ChangePasswordForm from "@/components/Account/ChangePasswordForm.vue";
import DeleteAccountForm from "@/components/Account/DeleteAccountForm.vue";
import LogoutForm from "@/components/Account/LogoutForm.vue";

export default {
  name: "AccountPage",
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    DeleteAccountForm,
    LogoutForm,
  },
};
</script>
