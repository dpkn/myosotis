<template>
  <v-stepper-content step="0">
    <v-progress-circular
      :size="70"
      class="ma-12"
      :width="3"
      color="indigo lighten-1"
      indeterminate
    ></v-progress-circular>
  </v-stepper-content>
</template>

<script>
export default {
  name: "LoadingStep"
};
</script>
