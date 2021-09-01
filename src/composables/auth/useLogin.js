import { ref } from "vue";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";

const error = ref();
const isPending = ref(false);

const login = async ({ email, password }) => {
  error.value = null;
  isPending.value = true;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (!userCredential) {
      throw new Error("Could not complete login");
    }

    isPending.value = false;

    return userCredential.user;
  } catch (err) {
    error.value = err.message;
    isPending.value = false;
  }
};

const useLogin = () => {
  return { error, login, isPending };
};

export default useLogin;
