<template>
  <v-app>
    <Header
      @logout="logOut"
      @show-account="setActiveNode(user.uid)"
      :is-logged-in="isLoggedIn"
    />

    <v-content>
      <LogInView
        v-if="!isLoggedIn || (isLoggedIn && needToSetUpProfile) || (isLoggedIn && !needToSetUpProfile && !networkIsReady)"
        @send-login-link="sendLoginLink"
        @set-up-profile="setUpProfile"
        :login-step="loginStep"
        :user-node="userNode"
      />

      <LoggedInView
        v-if="isLoggedIn && !needToSetUpProfile && networkIsReady"
        @set-active-node="setActiveNode"
        :nodes="nodes"
        :user-node="userNode"
        :relations="relations"
      />
    </v-content>

    <v-bottom-sheet
      inset
      v-model="nodeSheetIsOpen"
    >
      <ActiveNodeSheet
        :active-node="activeNode"
        :url="url"
      />
    </v-bottom-sheet>

    <v-dialog
      max-width="400"
      persistent
      v-if="friendRequestNode && !needToSetUpProfile"
      v-model="friendRequestDialog"
    >
      <FriendRequestDialog
        :friend-request-node="friendRequestNode"
        @accept-friendship="acceptFriendship"
        @close-dialog="friendRequestDialog = false"
      />
    </v-dialog>

  </v-app>
</template>

<script>
import * as firebase from "firebase/app";

// Import Views
import LogInView from "./views/LogInView";
import LoggedInView from "./views/LoggedInView";

// Import components
import Header from "./components/Header";
import FriendRequestDialog from "./components/FriendRequestDialog";
import ActiveNodeSheet from "./components/ActiveNodeSheet/Index";

// App
export default {
  name: "App",
  components: {
    Header,
    LogInView,
    LoggedInView,
    ActiveNodeSheet,
    FriendRequestDialog
  },
  data() {
    return {
      userNode: { id: "", isUser: true },
      loginStep: 0,
      isLoggedIn: false,
      needToSetUpProfile: false,
      nodeSheetIsOpen: false,
      activeNode: {},
      friendRequestNode: {},
      friendRequestDialog: false,
      nodes: [],
      relations: [],
      networkIsReady: false
    };
  },
  computed: {
    url: function() {
      let url =
        process.env.NODE_ENV === "development"
          ? "http://" + window.location.hostname + ":8080"
          : "https://" + window.location.host;
      let suffix = "";
      let friendCode = new URLSearchParams(window.location.search).get(
        "friend"
      );

      if (this.userNode.id) {
        suffix = "?friend=" + this.userNode.id;
      } else if (friendCode) {
        suffix = "?friend=" + friendCode;
      }

      return url + suffix;
    }
  },
  // Called when App  is mounted
  mounted() {
    // Check if user is using an login link
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      this.logIn();
    }

    // Register event listener for log-in/out changes
    firebase.auth().onAuthStateChanged(user => {
      this.onAuthStateChanged(user);
    });
  },
  methods: {
    /**
     * Called when Firebase log-in state changes
     *
     * @param {Object} user The firebase user object
     */
    onAuthStateChanged(user) {
      if (user) {
        this.onLogIn(user);
      } else {
        this.onLogOut();
      }
    },
   async onLogIn(user) {
      this.userNode.id = user.uid;
      this.isLoggedIn = true;

      this.getUserData().then(user => {
        if(!this.needToSetUpProfile){
          this.getNodeImageUrl(user.id).then(url => {
            this.userNode.profileImage = url;
          });
        }
      });

      let directFriends = await this.getNetworkFromNode(this.userNode.id);
      for await(let node of directFriends.nodes) {
        await this.getNetworkFromNode(node.id,1);
      }
      this.networkIsReady = true;

      // Check if there is a friend code in the URL, if so activate dialog
      let urlParams = new URLSearchParams(window.location.search);
      let friendCode = urlParams.get("friend");

      if (friendCode) {
        this.showFriendDialog(friendCode);
      }
    },
    onLogOut() {
      this.user = {};
      this.loginStep = 1;
      this.isLoggedIn = false;
    },
    /**
     *  Log in the user using Firebase auth
     *  Called by mounted() when user is visiting with a login link from mail.
     */
    logIn() {
      // Get e-mail from localstorage to prevent session fixation attacks
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        // No localstorage, prompt user for email
        email = window.prompt(
          "You are logging in from a different browser. Please provide your email for confirmation:"
        );
      }

      firebase
        .auth()
        .signInWithEmailLink(email, window.location.href)
        .then(result => {
          window.localStorage.removeItem("emailForSignIn");
          // If user is here first time, prompt with set up window
          this.needToSetUpProfile = result.additionalUserInfo.isNewUser;
          this.loginStep = 3;
        })
        .catch(function(error) {
          console.error(error);
        });
    },
    /**
     *   Log out the user using Firebase auth
     *   Called when user presses Log Out button
     */
    logOut() {
      firebase
        .auth()
        .signOut()
        .catch(function(error) {
          console.error(error);
        });
    },
    /**
     * Send the user a mail with login link
     *
     * @param {String} email The users e-mail
     */
    sendLoginLink(email) {
      let actionCodeSettings = {
        url: this.url,
        handleCodeInApp: true
      };

      firebase
        .auth()
        .sendSignInLinkToEmail(email, actionCodeSettings)
        .then(() => {
          window.localStorage.setItem("emailForSignIn", email);
          this.loginStep = 2;
        })
        .catch(function(error) {
          console.error(error);
        });
    },
    /**
     * Set up the profile of a new user
     *
     * @param {Object} profileInfo The object of the profile
     */
    setUpProfile({ displayName, privateName }) {
      this.$db
        .collection("users")
        .doc(this.userNode.id)
        .set({
          displayName,
          privateName
        })
        .then(() => {
          this.needToSetUpProfile = false;
          this.getUserData();
        })
        .catch(function(error) {
          console.error(error);
        });
    },
    /**
     *  Set the active/selected node
     *
     * @param {String} activeNodeId Id of Node to activate
     */
    setActiveNode(activeNodeId) {
      if (activeNodeId) {
        let findNode = this.nodeLoaded(activeNodeId);
        if (findNode) {
          this.activeNode = findNode;
        } else {
          this.activeNode = this.userNode;
        }

        this.nodeSheetIsOpen = true;
      } else {
        this.nodeSheetIsOpen = false;
      }
    },
    showFriendDialog(friendCode) {
      this.friendRequestNode = this.getNodeData(friendCode).then(node => {
        this.getNodeImageUrl(friendCode).then(url => {
          node.profileImage = url;
          this.friendRequestNode = node;
          this.friendRequestDialog = true;
        });
      });
    },
    acceptFriendship() {
      let userRef = this.$db.collection("users").doc(this.userNode.id);
      let friendRef = this.$db
        .collection("users")
        .doc(this.friendRequestNode.id);
      this.$db.collection("relations").add({
        users: [userRef, friendRef],
        strength: 1
      });
      this.friendRequestNode = {};
      this.friendRequestDialog = false;
    },
    // Get the user data from the users collection
    getUserData() {
      return new Promise((resolve, reject) => {
        var docRef = this.$db.collection("users").doc(this.userNode.id);

        docRef
          .get()
          .then(doc => {
            let result = {};
            if (doc.exists) {
              this.needToSetUpProfile = false;

              result = Object.assign(this.userNode, doc.data());
            } else {
              this.needToSetUpProfile = true;
              this.loginStep = 3;
            }
            resolve(result);
          })
          .catch(function(error) {
            console.error("Error getting document:", error);
            reject();
          });
      });
    },
    // Get all the relations to other nodes the user has
   async getRelationDocs(nodeId) {
        let userRef = this.$db.collection("users").doc(nodeId);

        let result = await this.$db
          .collection("relations")
          .where("users", "array-contains", userRef)
          .get()
          .catch(error => {
            console.error("Error getting documents: ", error);
          });
        
        return result.docs;
    },
    async getRelations(nodeId) {
       let relationDocs = await this.getRelationDocs(nodeId);
        let relations = [];

        for (let relationDoc of relationDocs) {
          let relationData = await relationDoc.data();

          let from, to;

          if (relationData.users[0].id === nodeId) {
            from = relationData.users[0].id;
            to = relationData.users[1].id;
          } else {
            from = relationData.users[1].id;
            to = relationData.users[0].id;
          }

          let relation = {
            from,
            to,
            strength: relationData.strength,
            id: relationDoc.id
          };
          
          relations.push(relation);
  
        }
        return relations;
    },
    relationLoaded(relationId) {
      return this.relations.find(x => x.id === relationId);
    },
    // Check if node id belongs to the user or a friend
    nodeLoaded(nodeId) {
      let result = this.nodes.find(x => x.id === nodeId);
      if(!result && nodeId == this.userNode.id){ result = this.userNode}
      return result;
    },
    async getNodeData(id) {
      var docRef = this.$db.collection("users").doc(id);
      let doc = await docRef.get().catch(function(error) {
        console.error("Error getting document:", error);
      });
      if (doc.exists) {
        let node = {};
        node.id = doc.id;
        Object.assign(node, doc.data());
        return node;
      } else {
        console.error("Requested Node does not exist");
      }
    },
    async getNodeImageUrl(nodeId) {
      return await this.$storage
        .child("profileImages/" + nodeId + ".png")
        .getDownloadURL()
        .catch(error => {
          console.error(error);
        });
    },
    async getNetworkFromNode(nodeId, level = 0) {
      let relations = await this.getRelations(nodeId);
      let nodes = [];

      for (let relation of relations) {
        if (!this.relationLoaded(relation.id)) {
          this.relations.push(relation);
        }

        if (!this.nodeLoaded(relation.to)){
            let node = await this.getNodeData(relation.to);
            node.profileImage = await this.getNodeImageUrl(node.id);
            node.level = level;

            this.nodes.push(node);
            nodes.push(node)
        }
      }
      return {
        relations,
        nodes
      };
    },
  
  }
};
</script>

<style>
#app {
  background: #c5cae9;
}
.v-dialog {
  overflow: visible !important;
}
</style>