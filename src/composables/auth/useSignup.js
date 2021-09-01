import { ref } from "vue";
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  GithubAuthProvider,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithRedirect,
  TwitterAuthProvider,
  updateProfile,
} from "firebase/auth";
import { auth, actionCodeSettings, functions } from "../../firebase/config";

import { httpsCallable } from "firebase/functions";

const error = ref(null);
const isPending = ref(null);

const signupWithEmailAndPassword = async ({ email, password, displayName }) => {
  error.value = null;
  isPending.value = true;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (!userCredential) {
      throw new Error("Could not complete signup with email and password");
    }

    await updateProfile(auth.currentUser, {
      displayName,
    });

    const updateUserProfile = httpsCallable(functions, "updateUserProfile");

    updateUserProfile({ displayName });

    await sendLink();

    isPending.value = false;

    return auth.currentUser;
  } catch (err) {
    error.value = err.message;
    isPending.value = false;
  }
};

const sendLink = async () => {
  try {
    await sendEmailVerification(auth.currentUser, actionCodeSettings);
  } catch (err) {
    error.value = err.message;
  }
};

const signupWithOAuth = async (providerName) => {
  let provider;
  switch (providerName) {
    case "google":
      provider = new GoogleAuthProvider();
      break;

    case "twitter":
      provider = new TwitterAuthProvider();
      break;
    case "github":
      provider = new GithubAuthProvider();
    default:
      break;
  }

  signInWithRedirect(auth, provider);
  try {
    const result = await getRedirectResult(auth);
    isPending.value = false;
    return result.user;
  } catch (err) {
    error.value = err.message;
    isPending.value = false;
  }
};

const useSignup = () => {
  return { error, isPending, signupWithEmailAndPassword, signupWithOAuth };
};

export default useSignup;
