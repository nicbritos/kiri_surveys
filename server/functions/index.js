let functions = require("firebase-functions");
let admin = require("firebase-admin");

admin.initializeApp();
let db = admin.firestore();
let storage = admin.storage();

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
      name: "e",
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

let ERRORS = {
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

// This method handles an export request.
exports.exportData = functions.https.onCall(async (data, context) => {
  if (context.auth.uid == null) return formatError(ERRORS.AUTH);
  if (context.auth.token.tier === 0) return formatError(ERRORS.PERMISSIONS);
  if (
    typeof data.w != "object" &&
    typeof data.e != "object" &&
    typeof data.e != "string"
  )
    return formatError(ERRORS.ARGS);

  if (typeof data.e == "object" && data.e.length != null && data.e.length > 0) {
    let urls = [];
    for (let endpointId of data.e) {
      if (context.auth.token.tier < 3) {
        if (
          !(await hasPermission(
            context.auth.uid,
            db.collection(COLLECTIONS.ENDPOINTS.collection).doc(endpointId),
            COLLECTIONS.ENDPOINTS.document.permissions
          ))
        ) {
          return formatError(ERRORS.PERMISSIONS);
        }
      }

      let reference = storage.ref(
        COLLECTIONS.ENDPOINTS.collection + "/" + endpointId
      );
      let list = await reference.list();
      for (let wRef of list.items()) {
        try {
          urls.push(await wRef.getDownloadURL());
        } catch (e) {
          console.error(e);
          return formatError(ERRORS.DOC_NOT_FOUND);
        }
      }
    }

    return formatData({ u: urls });
  }

  if (typeof data.e == "string" && data.w.length != null && data.w.length > 0) {
    let urls = [];
    for (let workshopId of data.w) {
      if (context.auth.token.tier < 3) {
        if (
          !(await hasPermission(
            context.auth.uid,
            db
              .collection(COLLECTIONS.ENDPOINTS.collection)
              .doc(data.e)
              .collection(COLLECTIONS.WORKSHOPS.collection)
              .doc(workshopId),
            COLLECTIONS.WORKSHOPS.document.permissions
          ))
        ) {
          return formatError(ERRORS.PERMISSIONS);
        }
      }
      let reference = storage.ref(
        COLLECTIONS.ENDPOINTS.collection + "/" + data.e + "/" + workshopId
      );
      try {
        urls.push(await reference.getDownloadURL());
      } catch (e) {
        console.error(e);
        return formatError(ERRORS.DOC_NOT_FOUND);
      }

      return formatData({ u: urls });
    }
  }

  return formatError(ERRORS.ARGS);
});
