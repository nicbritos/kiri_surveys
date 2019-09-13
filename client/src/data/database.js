import firebase from "firebase/app";
require("firebase/firestore");
require("firebase/auth");

export default {
  loadQuestions: loadQuestions,
  loadEndpoints: loadEndpoints,
  loadWorkshops: loadWorkshops,
  loadResponses: loadResponses,

  onAuthStateChanged: onAuthStateChanged,
  signInWithEmailAndPassword: signInWithEmailAndPassword,
  createUserWithEmailAndPassword: createUserWithEmailAndPassword,
  prepareGoogleSignIn: prepareGoogleSignIn,
  sendEmailVerification: sendEmailVerification,
  isLoggedIn: isLoggedIn,
  // forceReLogin: forceReLogin,
  signOut: signOut

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
      description: "d",
      permissions: "u"
    }
  },
  WORKSHOPS: {
    collection: "w",
    document: {
      endpointId: "e",
      name: "n",
      date: "d",
      permissions: "u"
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
async function createUserWithEmailAndPassword(email, password) {
  await firebase.auth().createUserWithEmailAndPassword(email, password);

  return sendEmailVerification();
}

// Returns a promise
function prepareGoogleSignIn() {
  return firebase
    .auth()
    .signInWithPopup(new firebase.auth.GoogleAuthProvider());
}

// Returns a promise.
// Automatically called after a successful createUserWithEmailAndPassword
// Token should be refreshed after verification completed.
function sendEmailVerification() {
  if (firebase.auth().currentUser != null) {
    return firebase.auth().currentUser.sendEmailVerification();
  } else {
    throw new Error(
      "Cannot send verification email if user is not authenticated."
    );
  }
}

function isLoggedIn() {
  return firebase.auth().currentUser != null;
}

// Returns a promise
function signOut() {
  return firebase.auth().signOut();
}

// -----------------------

function getUserInformation(username) {}

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
  // let reference = db.collection(COLLECTIONS.QUESTIONS.collection);
  // let questions = [];
  // (await reference.get()).forEach(doc => {
  //   let data = doc.data();
  //   data.id = doc.id;
  //   questions.push(data);
  // });
  // return questions;
}

async function loadEndpoints() {
  return [
    {
      id: "def",
      name: "Instituto Inmaculada",
      description: "Talleres hechos en Instituto Inmaculada de Castelar",
      quantity: 4,
      workshops: []
    },
    {
      id: "ghi",
      name: "ITBA",
      description:
        "Talleres hechos en el Instituto Tecnologico de Buenos Aires",
      quantity: 12,
      workshops: []
    },
    {
      id: "jkl",
      name: "ITBA Postgrado",
      description: "Talleres hechos en ITBA Postgrado",
      quantity: 3,
      workshops: []
    },
    {
      id: "mno",
      name: "ORT",
      description: "Talleres hechos en la escuela ORT",
      quantity: 2,
      workshops: []
    },
    {
      id: "abc",
      name: "UBA",
      description: "Talleres hechos en la UBA",
      quantity: 0,
      workshops: []
    }
  ];

  // let reference = db.collection(COLLECTIONS.ENDPOINTS.collection);
  // let endpoints = [];
  // (await reference.get()).forEach(doc => {
  //   let data = doc.data();
  //   data.id = doc.id;
  //   endpoints.push(data);
  // });
  // return endpoints;
}

async function loadWorkshops(endpointId) {
  // let reference = db
  //   .collection(COLLECTIONS.ENDPOINTS.collection)
  //   .doc(endpointId)
  //   .collection(COLLECTIONS.WORKSHOPS.collection);
  // let workshops = [];
  // (await reference.get()).forEach(doc => {
  //   let data = doc.data();
  //   data.id = doc.id;
  //   workshops.push(data);
  // });
  // return workshops;
  return [
    {
      id: "w1",
      quantity: 400,
      name: "ITBA1",
      date: undefined,
      responses: []
    }
  ];
}

async function loadResponses(endpointId, workshopId) {
  // let reference = db
  //   .collection(COLLECTIONS.ENDPOINTS.collection)
  //   .doc(endpointId)
  //   .collection(COLLECTIONS.WORKSHOPS.collection)
  //   .doc(workshopId)
  //   .collection(COLLECTIONS.RESPONSES.collection);
  // let responses = [];
  // (await reference.get()).forEach(doc => {
  //   let data = doc.data();
  //   data.id = doc.id;
  //   responses.push(data);
  // });
  // return responses;
  return {
    NB1: [
      {
          id: "abcdef",
        person: "NB1",
        q: "abc",
        t: "PRE",
        v: "asas"
      }
    ]
  };
}
