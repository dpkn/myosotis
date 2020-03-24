<template>
  <v-stepper-content step="3">
    <h1>Set up your account</h1>
    <v-form
      ref="form"
      class="pa-5"
    >
      <input
        type="file"
        ref="fileUploader"
        accept="image/png"
        style="display: none"
        @change="setProfileImage"
      >
      <v-avatar
        size="100"
        class="border"
        @click="$refs.fileUploader.click()"
        color="grey"
      >
        <img
          alt="'Profile Image"
          v-if="profileImage"
          :src="profileImage"
        >
        <span
          v-else
          class="white--text headline"
        >
          <v-icon>mdi-camera</v-icon>
        </span>
      </v-avatar>

      <v-text-field
        v-model="privateName"
        label="Your Private name"
        persistent-hint
        hint="This is how you'll be shown to friends in your direct circle"
        required
        outlined
        color="indigo lighten-1"
        @keydown.enter.prevent="$refs.displayNameInput.focus()"
        :disabled="isLoading"
        class="pa-5"
      ></v-text-field>

      <v-text-field
        v-model="displayName"
        ref="displayNameInput"
        label="Your Public name"
        persistent-hint
        hint="This how you will be shown to everyone else"
        required
        outlined
        color="indigo lighten-1"
        keydown.enter.prevent="setUpProfile"
        :disabled="isLoading"
        class="pa-5"
      ></v-text-field>

      <v-btn
        color="indigo lighten-1"
        large
        class="white--text"
        :disabled="!profileIsFinished"
        :loading="isLoading"
        @click="setUpProfile"
      >
        Finish Profile
      </v-btn>

    </v-form>
  </v-stepper-content>
</template>

<script>
export default {
  name: "SetUpProfileStep",
  data() {
    return {
      isLoading: false,
      displayName: "",
      privateName: "",
      profileImage: ""
    };
  },
  props:["userNode"],
  computed: {
    profileIsFinished() {
      return (
        this.displayName.length > 0 &&
        this.privateName.length > 0 &&
        this.profileImage !== ""
      );
    }
  },
  methods: {
    // Check if profile is complete, and then emit setUp event to parent
    setUpProfile() {
      if (this.profileIsFinished) {
        this.isLoading = true;
        this.$emit("set-up-profile", {
          displayName: this.displayName,
          privateName: this.privateName
        });
      }
    },
    // Handle file-change event on file input
    setProfileImage() {
      let files = this.$refs.fileUploader.files;
      if (files.length === 1) {
        let profileBlob = files[0];
        this.uploadPicture(profileBlob);
        this.profileImage = URL.createObjectURL(profileBlob);
      } else {
        this.profileImage = "";
        this.profileBlob = "";
      }
    },
     /**
     *  Upload a user file to firebase
     * 
     * @param {File} file The File object of the image
     */
    uploadPicture(file) {
      let userImageRef = this.$storage.child(
        "profileImages/" + this.userNode.id + ".png"
      );
      userImageRef.put(file).then(function(snapshot) {
        console.log("Uploaded a blob or file!", snapshot);
      });
    },
  }
};
</script>
