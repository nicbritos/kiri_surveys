let functions = require("firebase-functions");
let admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage().bucket();

const FILE_EXTENSION = ".json";
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
const ERRORS = {
  AUTH: "This method is only available to authenticated users",
  ARGS: "Invalid arguments. May be of the wrong type or unspecified",
  UNKNOWN: "Unknown error. Please, try again later",
  PERMISSIONS: "You don't have enough permissions to execute this method",
  DOC_NOT_FOUND: "Document not found in database or storage"
};

// ---------------- Methods that handle return values ----------------
// Returns an Object with keys error and message if an error was produced, or error and data.
// Error is a boolean representing if an error has occurred.
function formatResult(data, error) {
  if (error !== null) {
    return {
      e: true,
      m: error
    };
  } else {
    return {
      e: false,
      d: data
    };
  }
}

// Shortcut to return an Object after an error was produced
function formatError(error) {
  return formatResult(null, error);
}

// Shortcut to return an Object after a successful operation
function formatData(data) {
  return formatResult(data, null);
}

// Receives a user id, a db reference and a field containing an array with userIds.
// Returns true if the provided userId is in this array.
async function hasPermission(uid, reference, field) {
  try {
    let doc = await reference.get();
    return doc.data()[field].contains(uid);
  } catch (e) {
    console.error(e);
    return false;
  }
}

// ---------------- Main methods ----------------
// Whenever a new user is created, we need to add him/her to the Users collection
// and setup basic data
exports.onUserCreate = functions.auth.user().onCreate(async user => {
  let usersReference = db.collection(COLLECTIONS.USERS.collection);

  await usersReference.doc(user.uid).create({
    [COLLECTIONS.USERS.document.name]: ""
  });

  let customClaims = {
    tier: 0
  };

  await admin.auth().setCustomUserClaims(user.uid, customClaims);
});

// This method listens for any create operation on the workshops' collection.
exports.onWorkshopCreate = functions.firestore
  .document(COLLECTIONS.WORKSHOPS.collection + "/{workshopId}")
  .onCreate(async (snapshot, context) => {
    await storage
      .file(
        snapshot.data()[COLLECTIONS.WORKSHOPS.document.endpointId] +
          "/" +
          context.params.workshopId +
          FILE_EXTENSION
      )
      .save("{}", { resumable: false });
  });

// This method listens for any delete operation on the workshops' collection.
exports.onWorkshopDelete = functions.firestore
  .document(COLLECTIONS.WORKSHOPS.collection + "/{workshopId}")
  .onDelete(async (snapshot, context) => {
    await storage
      .file(
        snapshot.data()[COLLECTIONS.WORKSHOPS.document.endpointId] +
          "/" +
          context.params.workshopId
      )
      .delete();
  });
