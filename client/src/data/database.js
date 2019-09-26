import firebase from "firebase/app";
require("firebase/firestore");
require("firebase/auth");

let config = {
  apiKey: "AIzaSyDi-HAD6aS6swA8mHMtpsCXRuDVGQ95J00",
  authDomain: "kiri-team-fracassi.firebaseapp.com",
  databaseURL: "https://kiri-team-fracassi.firebaseio.com",
  projectId: "kiri-team-fracassi",
  storageBucket: "kiri-team-fracassi.appspot.com",
  messagingSenderId: "692507051582",
  appId: "1:692507051582:web:c150b943842bd9a2"
};

// TODO: Questions must be a dict
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
const TIERS = {
  0: "Unauthorized user",
  1: "Can view all questions, specific endpoints and specific workshop's response",
  2: "Tier 1 + Can edit all questions, specific endpoints and specific workshops. Can add/edit/delete specific workshop's response",
  3: "Tier 2 + Can delete questions, specific endpoints and workshop's",
  4: "Tier 3 + Can manage all endpoints, workshops and same-or-lower-tier users",
  5: "Tier 4 + Can manage all users"
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

async function loadUsers() {
  return [
    {
      id: "asdasdsa",
      n: "Nicolas Britos",
      e: "nbritos@itba.edu.ar",
      t: 5
    },
    {
      id: "asdasdsa",
      n: "Juan Perez",
      e: "jperez@itba.edu.ar",
      t: 4
    },
    {
      id: "JuanaPerez",
      n: "Juana Perez",
      e: "japerez@itba.edu.ar",
      t: 3
    },
    {
      id: "testt",
      n: "Test",
      e: "test@example.com",
      t: 2
    },
    {
      id: "Example",
      n: "This is an Example",
      e: "example@example.com",
      t: 1
    },
    {
      id: "newUser",
      n: "New User",
      e: "nuser@example.com",
      t: 0
    }
  ];
}

async function loadQuestions() {
  let file = await fetch("/out_q.json");
  return await file.json();
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
  // return [
  //   //   {
  //   //     id: "def",
  //   //     n: "Instituto Inmaculada",
  //   //     d: "Talleres hechos en Instituto Inmaculada de Castelar",
  //   //     q: 4,
  //   //     w: []
  //   //   },
  //   //   {
  //   //     id: "ghi",
  //   //     n: "ITBA",
  //   //     d: "Talleres hechos en el Instituto Tecnologico de Buenos Aires",
  //   //     q: 12,
  //   //     w: []
  //   //   },
  //   //   {
  //   //     id: "jkl",
  //   //     n: "ITBA Postgrado",
  //   //     d: "Talleres hechos en ITBA Postgrado",
  //   //     q: 3,
  //   //     w: []
  //   //   },
  //   //   {
  //   //     id: "mno",
  //   //     n: "ORT",
  //   //     d: "Talleres hechos en la escuela ORT",
  //   //     q: 2,
  //   //     w: []
  //   //   },
  //   //   {
  //   //     id: "abc",
  //   //     n: "UBA",
  //   //     d: "Talleres hechos en la UBA",
  //   //     q: 0,
  //   //     w: []
  //   //   }
  //   // ];
  // let reference = db.collection(COLLECTIONS.ENDPOINTS.collection);
  // let endpoints = [];
  // (await reference.get()).forEach(doc => {
  //   let data = doc.data();
  //   data.id = doc.id;
  //   endpoints.push(data);
  // });
  // return endpoints;
  return [
    {
      id: "def",
      n: "Instituto Inmaculada",
      d: "Talleres hechos en Instituto Inmaculada de Castelar",
      w: []
    },
    {
      id: "abc",
      n: "ITBA",
      d: "Talleres hechos en el Instituto Tecnologico de Buenos Aires",
      w: []
    }
  ];
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
  if (endpointId === "abc") {
    let file = await fetch("/out_w_wce.json");
    let data = await file.json();
    for (let workshop of data) {
      workshop.r = [];
    }
    return data;
  } else {
    return [];
  }
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
  // return {
  //   NB1: [
  //     {
  //       id: "abcdef",
  //       p: "NB1",
  //       q: "abc",
  //       t: "PRE",
  //       v: 1
  //     }
  //   ]
  // };

  if (endpointId === "abc" && workshopId === "0") {
    let file = await fetch("/out_w_wce.json");
    return (await file.json())[0].r;
  } else {
    return [];
  }
}

export default {
  loadUsers: loadUsers,
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
  signOut: signOut,

  COLLECTIONS: COLLECTIONS,
  TIERS: TIERS
};
