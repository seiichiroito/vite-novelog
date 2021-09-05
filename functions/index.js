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
    photoURL: user.photoURL,
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

exports.updateUserProfile = functions.https.onCall((data, context) => {
  // check auth
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "only authenticated users can update profile"
    );
  }

  const user = admin.firestore().collection("users").doc(context.auth.uid);

  return user.update({
    displayName: data.displayName,
  });
});

exports.updateUsername = functions.https.onCall(async (data, context) => {
  // check auth
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "only authenticated users can update profile"
    );
  }

  if (data.username.length < 3) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "username must be longer then 3 characters"
    );
  }

  const allUsersRef = admin.firestore().collection("users");

  const snapshot = await allUsersRef
    .where("username", "==", data.username)
    .get();

  if (!snapshot.empty) {
    throw new functions.https.HttpsError(
      "already-exists",
      "the username is already used"
    );
  }

  const user = admin.firestore().collection("users").doc(context.auth.uid);

  return user.update({
    username: data.username,
  });
});

exports.follow = functions.https.onCall(async (data, context) => {
  // check auth
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "only authenticated users can follow other user"
    );
  }

  // Restrict follow yourself
  if (context.auth.uid === data.uid) {
    throw new functions.https.HttpsError(
      "cancelled",
      "you can't follow yourself."
    );
  }

  const user = admin.firestore().collection("users").doc(context.auth.uid);

  const followUser = admin.firestore().collection("users").doc(data.uid);

  const doc = await user.get();

  // check if following user exists
  if (!followUser) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "the user doesn't exist."
    );
  }

  // check if user hasn't already followed
  const isFollowing = doc.data().following.some((followingUser) => {
    return followingUser.path === followUser.path;
  });

  if (isFollowing) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "you're already following this user."
    );
  }

  return user.update({
    following: [...doc.data().following, followUser],
  });
});

exports.unFollow = functions.https.onCall(async (data, context) => {
  // check auth
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "only authenticated users can follow other user"
    );
  }

  // Restrict follow yourself
  if (context.auth.uid === data.uid) {
    throw new functions.https.HttpsError(
      "cancelled",
      "you can't unfollow yourself."
    );
  }

  const user = admin.firestore().collection("users").doc(context.auth.uid);

  const unFollowUser = admin.firestore().collection("users").doc(data.uid);

  const doc = await user.get();

  // check if following user exists
  if (!unFollowUser) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "the user doesn't exist."
    );
  }
  const updatedFollowing = doc.data().following.filter((followingUser) => {
    followingUser.path !== unFollowUser.path;
  });

  return user.update({
    following: updatedFollowing,
  });
});

// Favorite Novel
exports.favoriteNovel = functions.https.onCall(async (data, context) => {
  // const {novelId} = data
  // check auth
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "only authenticated users can favorite a novel"
    );
  }

  const novel = admin.firestore().collection("novels").doc(data.novelId);

  const doc = await novel.get();

  // check if novel exists
  if (!doc) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "the novel doesn't exist."
    );
  }

  // check if user hasn't already followed
  const isFavorited = doc.data().favorited.some((userId) => {
    return userId === context.auth.uid;
  });

  if (isFavorited) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "you're already favorited this novel."
    );
  }

  const updatedFavorited = [...doc.data().favorited, context.auth.uid];

  return novel.update({
    favorited: updatedFavorited,
    favorited_count: updatedFavorited.length,
  });
});

// UnFavorite Novel
exports.unFavoriteNovel = functions.https.onCall(async (data, context) => {
  // const {novelId} = data
  // check auth
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "only authenticated users can unFavorite a novel"
    );
  }

  const novel = admin.firestore().collection("novels").doc(data.novelId);
  const doc = await novel.get();

  // check if the novel exists
  if (!doc) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "the novel doesn't exist."
    );
  }

  const updatedFavorited = doc.data().favorited.filter((userId) => {
    return userId !== context.auth.uid;
  });

  return novel.update({
    favorited: updatedFavorited,
    favorited_count: updatedFavorited.length,
  });
});
