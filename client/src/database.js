import firebase from "firebase/app";
require("firebase/firestore");
require("firebase/auth");

export default {
  init: init,

  onAuthStateChanged: onAuthStateChanged,
  signInWithEmailAndPassword: signInWithEmailAndPassword,
  createUserWithEmailAndPassword: createUserWithEmailAndPassword,
  prepareGoogleSignIn: prepareGoogleSignIn,
  sendEmailVerification: sendEmailVerification,
  // forceReLogin: forceReLogin,
  signOut: signOut,

  getUserInformation: getUserInformation
};

let config = {
  apiKey: "AIzaSyDi-HAD6aS6swA8mHMtpsCXRuDVGQ95J00",
  authDomain: "kiri-team-fracassi.firebaseapp.com",
  databaseURL: "https://kiri-team-fracassi.firebaseio.com",
  projectId: "kiri-team-fracassi",
  storageBucket: "kiri-team-fracassi.appspot.com",
  messagingSenderId: "692507051582",
  appId: "1:692507051582:web:c150b943842bd9a2"
};

let COLLECTIONS = {
  endpoints: "e",
  workshops: "w",
  users: "u",
  questions: "q",
  answers: "a"
};

let data = {
  endpoints: {},
  questions: {},
  workshops: {},
  responses: {}
};

var db = null;

// Must be called before using any other method.
function init() {
  firebase.initializeApp(config);
  db = firebase.firestore();
}

// -------- AUTH --------

// Observer must be a function receiving a user. If user != null then it is signed in.
// Returns the function that de-registers it
function onAuthStateChanged(observer) {
  return firebase.auth().onAuthStateChanged(observer);
}

// Returns a promise
function signInWithEmailAndPassword(email, password) {
  return firebase.auth().signInWithEmailAndPassword(email, password);
}

// Returns a promise
function createUserWithEmailAndPassword(email, password) {
  return new Promise(function(resolve, reject) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(function() {
        sendEmailVerification()
          .then(resolve)
          .catch(reject);
      })
      .catch(reject);
  });
}

// Returns a promise
function prepareGoogleSignIn() {
  let provider = new firebase.auth.GoogleAuthProvider();
  return firebase.auth().signInWithPopup(provider);
}

// Returns a promise.
// Automatically called after a successful createUserWithEmailAndPassword
// Token should be refreshed after verification completed. TODO: Test
function sendEmailVerification() {
  return new Promise(function(resolve, reject) {
    if (firebase.auth().currentUser != null) {
      firebase
        .auth()
        .currentUser.sendEmailVerification()
        .then(resolve)
        .catch(reject);
    } else {
      reject(
        new Error(
          "Cannot send verification email if user is not authenticated."
        )
      );
    }
  });
}

// Returns a promise
function signOut() {
  return firebase.auth().signOut();
}

// -----------------------

function getUserInformation(username) {

}


async function loadEndpoints() {
  let querySnapshot = await db.collection(COLLECTIONS.endpoints).get();


}

async function loadQuestions() {

}



// init();
// signInWithEmailAndPassword('hola@hotmail.com', 'example');
// onAuthStateChanged(function (user) {
//     getUserInformation();
// });
