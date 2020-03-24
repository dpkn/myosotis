const functions = require('firebase-functions');
const admin = require('firebase-admin');

let firebaseApp = admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// exports.createUserData = functions.auth.user().onCreate((user) => {
//     let userName = user.email.substring(0, user.email.lastIndexOf("@"));

//     // Add a new document in collection "cities"
//     admin.firestore().collection("users")
//         .doc(user.uid)
//         .set({
//             private_name:userName,
//             public_name:"",
//             relations: []
//         })
// });