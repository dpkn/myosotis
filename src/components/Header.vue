<template>
  <v-app-bar
    absolute
    color="white"
  >
    <v-app-bar-nav-icon></v-app-bar-nav-icon>

    <v-toolbar-title>🌸&nbsp;&nbsp;Myosotis</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn
      icon
      v-if="isLoggedIn"
      @click="$emit('show-account')"
    >
      <v-icon>mdi-account</v-icon>
    </v-btn>

    <v-btn
      icon
      v-if="isLoggedIn"
      @click="$emit('logout')"
    >
      <v-icon>mdi-exit-run</v-icon>
    </v-btn>

  </v-app-bar>
</template>

<script>
export default {
  name: "Header",
  props: ["isLoggedIn"]
};
</script>
