import firebase from "firebase";

export default {
  init: init,

  onAuthStateChanged: onAuthStateChanged,
  signInWithEmailAndPassword: signInWithEmailAndPassword,
  createUserWithEmailAndPassword: createUserWithEmailAndPassword,
  prepareGoogleSignIn: prepareGoogleSignIn,
  sendEmailVerification: sendEmailVerification,
  // forceReLogin: forceReLogin,
  signOut: signOut,

  getUserInformation: getUserInformation,

  getDefaultTrips: getDefaultTrips,
  createDefaultTrip: createDefaultTrip,
  bookTrip: bookTrip,

  registerStops: registerStops,
  getStops: getStops
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

// Must be called before using any other method.
function init() {
  firebase.initializeApp(config);
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

// TODO
// Receives a username (nullable). If not used, will return the current user's info
// Returns a promise. If successful, then it returns a JSON with user data:
// GENERAL USER:
// {
//      adminModifiable: {
//          consecutiveMissedTrips: number,
//          customerId: number,
//          isNew: boolean,
//          lastMissedTrip: timestamp,
//          permissions: string,
//          email: string,
//          combi: boolean,
//          id: string,
//          movements: Array of ? TODO
//      },
//      employeeModifiable: {
//          tickets: number
//      },
//      userModifiable: {
//          autoPayment: boolean,
//          displayName: string,
//          emergencyPhone: string,
//          phone: string
//      }
// }
//
// COMBI:
// {
//      adminModifiable: {
//          permissions: string,
//          combi: boolean,
//          id: string
//      },
//      employeeModifiable: {
//          combiType: number,
//          location: geopoint,
//          licensePlate: string,
//          seats: number
//      }
// }
//
// Permissions: Admin and Employee can get info about any user. Users can only retrieve their info
function getUserInformation(username) {
  return new Promise(function(resolve, reject) {
    if (firebase.auth().currentUser != null) {
      let infoReference = firebase
        .firestore()
        .collection("users/" + firebase.auth().currentUser.uid + "/info");

      firebase
        .auth()
        .currentUser.getIdTokenResult()
        .then(function(idToken) {
          let userData = {};

          if (userData.adminModifiable == null) {
            userData.adminModifiable = {};
          }

          if (idToken.claims.admin) {
            userData.adminModifiable.permissions = "admin";
          } else if (idToken.claims.employee) {
            userData.adminModifiable.permissions = "employee";
          } else {
            userData.adminModifiable.permissions = "user";
          }
          userData.adminModifiable.combi = !!idToken.claims.combi;
          userData.adminModifiable.email = firebase.auth().currentUser.email;
          userData.adminModifiable.id = firebase.auth().currentUser.uid;

          if (userData.adminModifiable.combi) {
            let combiReference = firebase
              .firestore()
              .doc("combis/" + firebase.auth().currentUser.uid);

            combiReference
              .get()
              .then(function(doc) {
                if (!doc.exists) {
                  reject(new Error("Error getting combi's document"));
                } else {
                  let data = doc.data();

                  if (userData.employeeModifiable == null) {
                    userData.employeeModifiable = {};
                  }

                  for (let key in data) {
                    if (data.hasOwnProperty(key)) {
                      userData.employeeModifiable[key] = data[key];
                    }
                  }
                }

                resolve(userData);
              })
              .catch(function(error) {
                reject(error);
              });
          } else {
            infoReference
              .get()
              .then(function(snapshot) {
                snapshot.forEach(doc => {
                  let data = doc.data();

                  if (userData[doc.id] == null) {
                    userData[doc.id] = {};
                  }

                  for (let key in data) {
                    if (data.hasOwnProperty(key)) {
                      userData[doc.id][key] = data[key];
                    }
                  }
                });

                resolve(userData);
              })
              .catch(function(error) {
                reject(error);
              });
          }
        })
        .catch(function(error) {
          reject(error);
        });
    } else {
      let reason = new Error("User is not authenticated.");
      reject(reason);
    }
  });
}

// Returns a promise. If successful, returns an array containing
// default trips, which have the following format:
// {
//      id: tripId,
//      description: string,
//      stops: array of stop (first one and last one indicates where the Bus leaves from and arrives to)
// },
//
// Where a stop has the following format:
// {
//      description: string (ex: "Sarmiento y Rodriguez Pena),
//      location: geopoint
// }
//
// Permissions: Admin and Employee
function getDefaultTrips() {
  return new Promise(function(resolve, reject) {
    let defaultTripsRef = firebase.firestore().collection("defaultTrips/");

    defaultTripsRef
      .get()
      .then(function(snapshot) {
        let trips = [];

        snapshot.forEach(doc => {
          let data = doc.data();
          let trip = {};

          trip.id = doc.id;
          trip.description = data.description;
          trip.stops = [];

          for (let stop of data.stops) {
            trip.stops.push(stop);
          }

          trips.push(trip);
        });

        resolve(trips);
      })
      .catch(function(error) {
        reject(error);
      });
  });
}

// Creates a new trip in database.
// Receives a trip and returns a promise.
// Trip format:
// {
//      description: string,
//      stops: array of stop (first one and last one indicates where the Bus leaves from and arrives to)
// },
//
// Where a stop has the following format:
// {
//      description: string (ex: "Sarmiento y Rodriguez Pena),
//      location: geopoint
// }
//
// Note: Stops not registered before will be registered and saved on 'stops' collection.
//
// Permissions: Admin and Employee
function createDefaultTrip(tripData) {
  let defaultTripsRef = firebase.firestore().collection("defaultTrips");

  let stops = [];
  // We deep-copy the array to include only this data (just to be sure)
  for (let stop of tripData.stops) {
    stops.push({
      description: stop.description,
      location: stop.location
    });
  }

  registerStops(stops);

  return defaultTripsRef.set({
    description: tripData.description,
    stops: stops
  });
}

// Receives a trip and returns a promise.
// Trip format:
// {
//      combiId: string (combiId. Same as id in getUserInformation),
//      personId: string (use when possible, may be nullable. Same as id in getUserInformation),
//      customerId: number (used as fallback if personId is null)
//
// }
function bookTrip(tripData) {}

// Registers stops that are not already saved.
// Returns a promise
//
// Permissions: Admin and Employee
function registerStops(stops) {
  return new Promise(function(resolve, reject) {
    getStops()
      .then(function(savedStops) {
        let stopsToAdd = [];
        for (let stop of stops) {
          let add = true;
          for (let savedStop of savedStops) {
            if (savedStop.location.isEqual(stop)) {
              add = false;
              break;
            }
          }

          if (add) {
            stopsToAdd.push(stop);
          }
        }

        resolve(true);
      })
      .catch(function(error) {
        reject(error);
      });
  });
}

// Gets saved stops
// Returns a promise
//
// Permissions: User, Admin and Employee
function getStops() {
  return new Promise(function(resolve, reject) {
    let stopsRef = firebase.firestore().collection("stops");

    stopsRef
      .get()
      .then(function(snapshot) {
        let stops = [];

        snapshot.forEach(doc => {
          let data = doc.data();
          let stop = {};

          stop.description = data.description;
          stop.location = data.location;

          stops.push(stop);
        });

        resolve(stops);
      })
      .catch(function(error) {
        reject(error);
      });
  });
}

function scheduleTrip(trip) {}

function getScheduledTrips() {}

function getCurrentTrips(trip) {}

// init();
// signInWithEmailAndPassword('hola@hotmail.com', 'example');
// onAuthStateChanged(function (user) {
//     getUserInformation();
// });
