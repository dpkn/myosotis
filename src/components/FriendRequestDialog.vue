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

      <v-card-actions class="text-center">
        <div class="mx-auto mt-2 mb-5">
          <v-btn
           color="indigo lighten-1"
           text
          @click="$emit('close-dialog')"
        >
          No, thanks.
        </v-btn>

        <v-btn
          color="indigo lighten-1"
          class="white--text"
          @click="$emit('accept-friendship')"
        >
          Accept Friendship
        </v-btn>
        </div>
      </v-card-actions>
    </v-sheet>
</template>

<script>
export default {
  name: "FriendRequestDialog",
  props: ["friendRequestNode"]
};
</script>
