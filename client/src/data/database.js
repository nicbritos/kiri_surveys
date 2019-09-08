import firebase from "firebase/app";
require("firebase/firestore");
require("firebase/auth");

export default {
  loadEndpoints: loadEndpoints,
  loadQuestions: loadQuestions

  // onAuthStateChanged: onAuthStateChanged,
  // signInWithEmailAndPassword: signInWithEmailAndPassword,
  // createUserWithEmailAndPassword: createUserWithEmailAndPassword,
  // prepareGoogleSignIn: prepareGoogleSignIn,
  // sendEmailVerification: sendEmailVerification,
  // // forceReLogin: forceReLogin,
  // signOut: signOut,
  //
  // getUserInformation: getUserInformation
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

const COLLECTIONS = {
  USERS: {
    collection: "u",
    document: {
      name: "n"
    }
  },
  QUESTIONS: {
    collection: "q",
    document: {
      answered: "a",
      measurable: "m",
      feedback: "f",
      name: "n",
      values: {
        field: "v",
        children: {
          value: "v",
          description: "d"
        }
      }
    }
  },
  ENDPOINTS: {
    collection: "e",
    document: {
      name: "e",
      description: "d"
    }
  },
  WORKSHOPS: {
    collection: "w",
    document: {
      name: "e",
      date: "d"
    }
  },
  RESPONSES: {
    collection: "a",
    document: {
      answers: {
        field: "a",
        children: {
          question: "q",
          type: "t",
          value: "v"
        }
      }
    }
  }
};

firebase.initializeApp(config);
let db = firebase.firestore();

// -------- AUTH --------
// // Observer must be a function receiving a user. If user != null then it is signed in.
// // Returns the function that de-registers it
// function onAuthStateChanged(observer) {
//   return firebase.auth().onAuthStateChanged(observer);
// }
//
// // Returns a promise
// function signInWithEmailAndPassword(email, password) {
//   return firebase.auth().signInWithEmailAndPassword(email, password);
// }
//
// // Returns a promise
// function createUserWithEmailAndPassword(email, password) {
//   return new Promise(function(resolve, reject) {
//     firebase
//       .auth()
//       .createUserWithEmailAndPassword(email, password)
//       .then(function() {
//         sendEmailVerification()
//           .then(resolve)
//           .catch(reject);
//       })
//       .catch(reject);
//   });
// }
//
// // Returns a promise
// function prepareGoogleSignIn() {
//   let provider = new firebase.auth.GoogleAuthProvider();
//   return firebase.auth().signInWithPopup(provider);
// }
//
// // Returns a promise.
// // Automatically called after a successful createUserWithEmailAndPassword
// // Token should be refreshed after verification completed. TODO: Test
// function sendEmailVerification() {
//   return new Promise(function(resolve, reject) {
//     if (firebase.auth().currentUser != null) {
//       firebase
//         .auth()
//         .currentUser.sendEmailVerification()
//         .then(resolve)
//         .catch(reject);
//     } else {
//       reject(
//         new Error(
//           "Cannot send verification email if user is not authenticated."
//         )
//       );
//     }
//   });
// }
//
// // Returns a promise
// function signOut() {
//   return firebase.auth().signOut();
// }
//
// // -----------------------
//
// function getUserInformation(username) {
//
// }

async function loadEndpoints() {
  return [
    {
      id: "def",
      name: "Instituto Inmaculada",
      description: "Talleres hechos en Instituto Inmaculada de Castelar",
      quantity: 4
    },
    {
      id: "ghi",
      name: "ITBA",
      description:
        "Talleres hechos en el Instituto Tecnologico de Buenos Aires",
      quantity: 12
    },
    {
      id: "jkl",
      name: "ITBA Postgrado",
      description: "Talleres hechos en ITBA Postgrado",
      quantity: 3
    },
    {
      id: "mno",
      name: "ORT",
      description: "Talleres hechos en la escuela ORT",
      quantity: 2
    },
    {
      id: "abc",
      name: "UBA",
      description: "Talleres hechos en la UBA",
      quantity: 0
    }
  ];
}

async function loadQuestions() {
  return [
    {
      id: "abc",
      name: "Que piensa sobre el CC?",
      measurable: true,
      feedback: true,
      answered: false,
      values: {
        1: "Poco",
        2: "Medio",
        3: "Mucho"
      }
    },
    {
      id: "def",
      name: "Aguante Peron",
      measurable: true,
      feedback: true,
      answered: false,
      values: []
    },
    {
      id: "ghi",
      name: "Tu vieja? Si, tu vieja.",
      measurable: false,
      feedback: false,
      answered: false,
      values: []
    }
  ];
}

// init();
// signInWithEmailAndPassword('hola@hotmail.com', 'example');
// onAuthStateChanged(function (user) {
//     getUserInformation();
// });
