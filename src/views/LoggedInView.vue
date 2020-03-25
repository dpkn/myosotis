<template>

    <Visualization
      @set-active-node="$emit('set-active-node',$event)"
      :relations="relations"
      :nodes="nodes"
       :user-node="userNode"
    />

</template>

<script>
import Visualization from "../components/Visualization";

export default {
  name: "LoggedInView",
  components: {
    Visualization
  },
  props: ["relations", "nodes","userNode"],

};
</script>
