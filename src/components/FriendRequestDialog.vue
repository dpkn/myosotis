<template>
    <v-sheet class="text-center">

      <v-avatar
        size="150"
        class="elevation-2 nodeAvatar"
      >
        <img
          :src="friendRequestNode.profileImage"
          alt="'Profile Image of '+friendRequestNode.displayName'"
        >
      </v-avatar>
      <div class="pa-5">
        <h2>Become friends with {{friendRequestNode.displayName}}</h2>
        <p>
          {{friendRequestNode.displayName}} invited you to join their network.
        </p>
        <v-slider
          color="indigo lighten-1"
          thumb-label
        ></v-slider>
      </div>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          color="green darken-1"
          text
          @click="$emit('close-dialog')"
        >
          No, thanks.
        </v-btn>

        <v-btn
          color="green darken-1"
          text
          @click="$emit('accept-friendship')"
        >
          Agree
        </v-btn>
      </v-card-actions>
    </v-sheet>
</template>

<script>
export default {
  name: "FriendRequestDialog",
  props: ["friendRequestNode"]
};
</script>
