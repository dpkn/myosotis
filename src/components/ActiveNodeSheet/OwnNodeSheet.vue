<template>
  <div>
    <v-avatar
      size="150"
      class="elevation-2 nodeAvatar"
    >
      <img
        :src="activeNode.profileImage"
        :alt="'Profile Image of '+activeNode.displayName"
      >
    </v-avatar>

    <h2>{{activeNode.privateName}} <span v-if="activeNode.isUser">(you)</span></h2>
    <div class="ma-5">
      <p>To add people to your network, share this URL with them:</p>

      <v-text-field
        :value="url"
        label="Your Personal Link"
        append-icon="mdi-content-copy"
        @focus="$event.target.select()"
        @click:append="copyToClipboard()"
        ref="personalLink"
        outlined
        rounded
        readonly
        color="indigo lighten-1"
        class="mx-auto mt-8"
        style="max-width:500px"
      ></v-text-field>
    </div>

    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      class="text-center"
    >
      <span class="mx-auto"> Copied your personal link to clipboard
      </span>

    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "OwnNodeSheet",
  props: { activeNode: Object, url: String },
  data() {
    return {
      snackbar: false
    };
  },
  methods: {
    /**
     * Copies content of PersonalLink input to clipboard
     */
    copyToClipboard() {
      let target = this.$refs.personalLink.$el.querySelector("input");

      target.select();
      target.setSelectionRange(0, 99999); /*For mobile devices*/

      document.execCommand("copy");
      this.snackbar = true;
    }
  }
};
</script>