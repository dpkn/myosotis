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
     <p>Aiming to see each other at least every {{Math.round(1/this.relation.decaySpeed)}} days</p>

    <v-sheet
      class="mx-auto mt-5 ma-2"
      elevation="0"
      max-width="600px"
    >
      <v-sparkline
        :value="values"
        auto-draw
        line-width="4"
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
        @click="add(-0.1)"
      >🥺🥺 I miss you

      </v-btn>

      <v-btn
        class="ma-2"
        color="red darken-2"
        dark
        @click="add(0.1)"
      >🥰🥰 We had a great time
      </v-btn>

    </div>

  </div>
</template>

<script>
export default {
  name: "FriendNodeSheet",
  props: { activeNode: Object, userNode:Object, relations:Array},
  data() {
    return {
      lastValue:0,
      values:[]
    };
  },
  mounted(){
    this.getValues();
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
    },
    getValues(){
      for(let change of this.relation.changes){
        this.values.push(change.value);
      }
    }
  },
  computed:{
    relation(){
     return this.relations.find(x=>{
       return (x.from === this.userNode.id && x.to === this.activeNode.id) || (x.from === this.activeNode.id && x.to === this.userNode.id)
      });
    },
  },
  watch:{
    activeNode: function(){
      this.getValues();
    }
  }
};
</script>