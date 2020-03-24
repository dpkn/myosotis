<template>
  <div
    ref="visualization"
    class="visualization"
  ></div>
</template>

<script>
import { Network } from "vis-network/peer/esm/vis-network";
import "vis-network/styles/vis-network.css";

export default {
  name: "Visualization",
  props: ["relations", "nodes","userNode"],
  mounted() {
    this.setUpNetwork();
  },
  // Watch for updates to the network.
  watch: {
    nodes: function(){this.updateNetwork()},
    relations: function(){this.updateNetwork()}
  },
  methods:{
    setUpNetwork(){
          // Vis.js Network options
      let options = {
        clickToUse: false,
        nodes: {
          shape: "circularImage",
          scaling: {
            min: 40,
            max: 80
          },
          borderWidth: 0,
          color: {
            border: "#5C6BC0",
            background:"#5C6BC0",
            highlight: {
              border: "#5C6BC0",
              background:"#5C6BC0",
            }
          },
          font: { color: "#fff", size:20, multi:true},
          shadow: true
        },
        edges: {
          color: "#5C6BC0",
          scaling: {
            min: 5,
            max: 20
          },
        },
        interaction: {
          selectConnectedEdges: false,
          dragView: false,
          zoomView: false
        },
        physics:{
          enabled: true,
          barnesHut: {
            avoidOverlap: 0.9,
            springLength:150,
            gravitationalConstant:-3000,
            centralGravity:0.3,
            damping:0.6
          }
        },
        layout:{
          
        }
      };
      let container = this.$refs.visualization;
      let data = this.getNetworkData();

      // Set up Vis.js network
      this.network = new Network(container, data, options);

      // Register event handler for clicking on a Node
      this.network.on("click", this.setActiveNode);
    },
    /**
     *  Emit to App to set the active/selected node
     *  Called when User clicks on a node
     * 
     * @param {Event} event Event object of the click
     */
    setActiveNode(event){
      let activeNodeId = event.nodes[0];
      if (activeNodeId) {
        this.$emit("set-active-node", activeNodeId);
      } else {
        this.$emit("set-active-node", false);
      }
    },
     /**
     *  Convert App data (relations, nodes) to a format for Vis.js
     * 
     */
    getNetworkData(){
      let visNodes =[];
      let visEdges = [];

      // Add user node
      visNodes.push({
        id: this.userNode.id,
        value: 10,
        label: '<b>You</b>',
        image: this.userNode.profileImage ?  this.userNode.profileImage : '',
        fixed:true
      });

      // Add friend nodes
      for (let node of this.nodes) {
        visNodes.push({
          id: node.id,
          value: node.level === 0 ? 8 : 4,
          label: '<b>'+ (node.level === 0 ? node.privateName : node.displayName)+'</b>',
          image: node.profileImage ?  node.profileImage : ''
        });
      }
      for (let relation of this.relations) {
        visEdges.push({
          from: relation.from,
          to: relation.to,
          value: relation.strength*2
        });
      }
      return {
        nodes: visNodes,
        edges: visEdges
      };
    },
    /**
     *  Get Network Data and set it.
     * 
     */
    updateNetwork(){
      this.network.setData(this.getNetworkData());
    }
  }
};
</script>

<style scoped>
.visualization {
  width: 100%;
  height: 1000px;
}
</style>
