import { ref } from "vue";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/config";

const checkLoggedIn = (user) => {
  if (!user) {
    return false;
  }

  if (
    user.providerData[0].providerId === "google.com" ||
    user.providerData[0].providerId === "password"
  ) {
    return user.emailVerified;
  }

  return true;
};

const currentUser = ref(auth.currentUser);
const isLoggedIn = ref(checkLoggedIn(auth.currentUser));

onAuthStateChanged(auth, (user) => {
  currentUser.value = user;
  isLoggedIn.value = checkLoggedIn(user);
});

const getUser = () => {
  return { currentUser, isLoggedIn };
};

export default getUser;
