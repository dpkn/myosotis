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

    <h2>{{activeNode.privateName}}</h2>
    <p>{{activeNode.id}}</p>

    <v-sheet
      class="mx-auto mt-5 ma-2"
      color="indigo lighten-5"
      elevation="1"
      max-width="500px"
    >
      <v-sparkline
        :value="values"
        line-width="2"
        stroke-linecap="round"
        :gradient="['red','blue']"
        smooth="4"
      ></v-sparkline>
    </v-sheet>
    <div>
      <v-btn
        class="ma-2"
        color="blue darken-2"
        dark
        @click="add(-1)"
      >🥺🥺 I miss you

      </v-btn>

      <v-btn
        class="ma-2"
        color="red darken-2"
        dark
        @click="add(1)"
      >🥰🥰 We had a great time
      </v-btn>

    </div>

  </div>
</template>

<script>
export default {
  name: "FriendNodeSheet",
  props: { activeNode: Object },
  data() {
    return {
      values: [0, 2, 5, 9, 5, 10, 3, 5, -4, -10, 1, 8, 2, 9, 0]
    };
  },
  methods: {
    add(value) {
      let lastValueIndex = this.values.length - 1;
      this.$set(
        this.values,
        lastValueIndex,
        this.values[lastValueIndex] + value
      );
      // this.values.push(lastValue+value)
    }
  }
};
</script>