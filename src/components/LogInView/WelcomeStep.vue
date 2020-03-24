<template>
  <v-stepper-content step="1">
    <v-card-text>
      <p class="display-1">🌸</p>
      <div>[ mahy•uh•<b>soh</b>•tis ]</div>
      <p class="display-1 text--primary">
        <b>Myosotis</b>
      </p>
      <p class="text--primary">1. <i>noun:</i> any plant belonging to the genus Myosotis, of the borage family, colloquially known as <b>forget-me-nots</b></p>
    </v-card-text>

    <v-form
      ref="form"
      class="pa-5"
    >

      <v-text-field
        v-model="email"
        label="Your Email Adress"
        required
        outlined
        rounded
        :disabled="isLoading"
        color="indigo lighten-1"
        @keydown.enter.prevent="login"
      ></v-text-field>

      <v-btn
        color="indigo lighten-1"
        large
        class="white--text"
        :disabled="!emailIsValid"
        :loading="isLoading"
        @click="login"
      >
        Send Login Link
      </v-btn>

    </v-form>
  </v-stepper-content>
</template>

<script>
export default {
  name: "WelcomeStep",
  data() {
    return {
      email: "",
      isLoading: false
    };
  },
  computed: {
    emailIsValid() {
      return /\S+@\S+\.\S+/.test(this.email);
    }
  },
  methods: {
    login() {
      if (this.emailIsValid) {
        this.isLoading = true;
        this.$emit("send-login-link", this.email);
      }
    }
  }
};
</script>
