<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md">
      <q-form
        ref="loginForm"
        @submit="loginUser"
        @reset="onReset"
        class="q-gutter-md"
      >
        <q-input
          v-model="loginInformation.email"
          filled
          type="email"
          label="Email"
        />

        <q-input
          v-model="loginInformation.password"
          filled
          :type="isPwd ? 'password' : 'text'"
          label="Password"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <div>
          <q-btn label="Login" type="submit" color="primary" />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "LoginPage",
  props: {
    dark: Boolean
  },
  data() {
    return {
      isPwd: true,
      loginInformation: {
        email: null,
        password: null
      }
    };
  },
  methods: {
    ...mapActions("auth", ["LOGIN"]),
    loginUser() {
      this.$refs.loginForm.validate().then(success => {
        if (success) {
          // Login User
          this.LOGIN(this.loginInformation);

          // Reset the form
          this.onReset();
        } else {
          /* Alert User That login failed */
          this.$q.notify({
            color: "red-4",
            position: "top",
            textColor: "white",
            icon: "check-circle",
            message: "Login Failed"
          });
        }
      });
    },

    onReset() {
      // reset validations:
      this.$refs.loginForm.resetValidation();
      // reset form fields
      this.loginInformation.email = null;
      this.loginInformation.password = null;
    }
  }
};
</script>

<style></style>
