const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

const uniqueUsername = () => {
  return Math.random().toString(36).substr(2, 9);
};

exports.newUserSignUp = functions.auth.user().onCreate((user) => {
  return admin.firestore().collection("users").doc(user.uid).set({
    displayName: user.displayName,
    email: user.email,
    photoUrl: user.photoURL,
    bio: "",
    following: [],
    favorites: [],
    username: uniqueUsername(),
  });
});

exports.userDeleted = functions.auth.user().onDelete((user) => {
  const doc = admin.firestore().collection("users").doc(user.uid);
  return doc.delete();
});
