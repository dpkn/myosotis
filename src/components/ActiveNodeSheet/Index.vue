<template>
    <v-sheet class="text-center pa-5 pt-0" height="400px">
        <OwnNodeSheet v-if="activeNode.isUser" :active-node="activeNode" :url="url" />
        <FriendNodeSheet v-else-if="activeNode.level===1" :active-node="activeNode" :user-node="userNode"
        :relations="relations" />
        <StrangerNodeSheet v-else :active-node="activeNode" />
    </v-sheet>
</template>

<script>
import OwnNodeSheet from './OwnNodeSheet';
import FriendNodeSheet from './FriendNodeSheet'
import StrangerNodeSheet from './StrangerNodeSheet'

export default {
  name: 'ActiveNodeSheet',
  props:{activeNode: Object, userNode:Object, relations:Array, url:String},
  components:{
      OwnNodeSheet,
      FriendNodeSheet,
      StrangerNodeSheet
  }
};
</script>

<style>
.nodeAvatar{
    margin-top:-75px!important;
    border:2px solid #fff;
}
</style>