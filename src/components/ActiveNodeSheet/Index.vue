<template>
    <v-sheet class="text-center pa-5 pt-0" height="400px">
        <OwnNodeSheet v-if="activeNode.isUser" :active-node="activeNode" :url="url" />
        <FriendNodeSheet v-else-if="activeNode.level===0" :active-node="activeNode" />
        <StrangerNodeSheet v-else :active-node="activeNode" />
    </v-sheet>
</template>

<script>
import OwnNodeSheet from './OwnNodeSheet';
import FriendNodeSheet from './FriendNodeSheet'
import StrangerNodeSheet from './StrangerNodeSheet'

export default {
  name: 'ActiveNodeSheet',
  props:{activeNode: Object, url:String},
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