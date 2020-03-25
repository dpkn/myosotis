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
  props: ["relations", "nodes", "userNode"],
  mounted() {
    this.setUpNetwork();
  },
  // Watch for updates to the network.
  watch: {
    nodes: function() {
      this.updateNetwork();
    },
    relations: function() {
      this.updateNetwork();
    },
    userNode: {
      handler:function() {
       this.updateNetwork();
      },
      deep:true
    }
  },
  methods: {
    setUpNetwork() {
      // Vis.js Network options
      let options = {
        clickToUse: false,
        autoResize:false,
        nodes: {
          shape: "circularImage",
          scaling: {
            min: 30,
            max: 90,
            label:{
              enabled:true,
              min:12,
              max:15
            }
          },
          borderWidth: 0,
          borderWidthSelected:3,
          color: {
            border: "rgba(26, 35, 126,1)",
            background: "rgba(121, 134, 203,1)",
            highlight:{
                border: "rgba(26, 35, 126,1)",
              background: "rgba(121, 134, 203,1)",
            }
          },
          font: { color: "#fff", size: 20, multi: true },
          shadow: {
            enabled:true,
            color:'rgba(0,0,0,0.6)',
          }
        },
        edges: {
          scaling: {
            min: 1,
            max: 15,
            customScalingFunction: function (min,max,total,value) {
              value = 1 - value;
              return Math.max(0,(value - min));
            }
          },
          color:{
            opacity:1,
            inherit:'both'
          }
        },
         groups: {
          friends: {
            color: "rgba(121, 134, 203,1)"
          },
          strangers: {
            color:"rgba(197, 202, 233,1)"
          }
        },
        interaction: {
          selectConnectedEdges: false,
          dragView: false,
          zoomView: false
        },
        physics: {
          enabled: true,
          barnesHut: {
            avoidOverlap: 0.9,
            springLength: 150,
            gravitationalConstant: -3000,
            centralGravity: 0.3,
            damping: 0.6
          }
        }
      };

      let container = this.$refs.visualization;
      let data = this.getNetworkData();

      // Set up Vis.js network
      this.network = new Network(container, data, options);

      // Register event handler for clicking on a Node
      this.network.on("click", this.setActiveNode);
      window.onresize = ()=>{
        this.network.setSize('100%','100%');
        this.network.redraw();
      }
    },
    /**
     *  Emit to App to set the active/selected node
     *  Called when User clicks on a node
     *
     * @param {Event} event Event object of the click
     */
    setActiveNode(event) {
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
    getNetworkData() {
      let visNodes = [];
      let visEdges = [];

      // Add user node
      visNodes.push({
        id: this.userNode.id,
        level:0,
        value: 13,
        label: "<b>You</b>",
        image: this.userNode.profileImage ? this.userNode.profileImage : "",
        fixed: true
      });

      // Add friend nodes
      for (let node of this.nodes) {
        let label = node.level===1?  "<b>" + node.displayName + "</b>" : node.displayName;
        
        visNodes.push({
          id: node.id,
          value: node.level === 1 ? 7 : 1,
          label,
          group: node.level === 1 ? "friends" : "strangers",
          image: node.profileImage ? node.profileImage : ""
        });
      }
      for (let relation of this.relations) {
        let value = 1;
        if(relation.changes){
         value = relation.changes[relation.changes.length-1].value
        }
  
        visEdges.push({
          from: relation.from,
          to: relation.to,
          value
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
    updateNetwork() {
      this.network.setData(this.getNetworkData());
    }
  }
};
</script>

<style scoped>
.visualization {
  width: 100%;
  height: 100%;
}
</style>
