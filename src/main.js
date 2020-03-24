import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

// Import and configure Firebase
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAZb5I_7Ivy_O9HOSasR7GPec9ssZmVYIk",
  authDomain: "myosotis-io.firebaseapp.com",
  databaseURL: "https://myosotis-io.firebaseio.com",
  projectId: "myosotis-io",
  storageBucket: "myosotis-io.appspot.com",
  messagingSenderId: "883981309723",
  appId: "1:883981309723:web:5282f2cfdf8cba0cbf25be",
  measurementId: "G-FX2SR1LV6S"
};

// Initialize Firebase & Firestore
let firebaseApp = firebase.initializeApp(firebaseConfig);

// Make available to components
Vue.prototype.$db = firebase.firestore(firebaseApp);
Vue.prototype.$storage = firebase.storage().ref();

// Set up Vue
Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
