<template>
  <div class="mt-0">

    <v-avatar
      size="150"
      class="elevation-2 nodeAvatar"
    >
      <img
        :src="activeNode.profileImage"
        :alt="'Profile Image of '+activeNode.displayName"
      >
    </v-avatar>

    <h2>{{activeNode.displayName}}</h2>
      <p>{{activeNode.displayName}} is not your friend :(</p>
  

  </div>
</template>

<script>
export default {
  name: "StrangerNodeSheet",
  props: { activeNode: Object },
};
</script>