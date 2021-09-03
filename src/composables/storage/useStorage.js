import { ref } from "vue";
import {
  deleteObject,
  getDownloadURL,
  ref as stoRef,
  uploadBytes,
} from "firebase/storage";
import { getUser } from "../auth";
import { storage } from "../../firebase/config";

// const uniqueID = () => {
//   return "_" + Math.random().toString(36).substr(2, 9);
// };

const { currentUser } = getUser();
const useStorage = () => {
  const error = ref(null);
  const url = ref(null);
  const filePath = ref(null);

  const uploadImage = async (file) => {
    filePath.value = `profiles/${currentUser.value.uid}`;

    const storageRef = stoRef(storage, filePath.value);
    try {
      await uploadBytes(storageRef, file);
      url.value = await getDownloadURL(storageRef);
    } catch (err) {
      error.value = err.message;
    }
  };

  const deleteImage = async (path) => {
    const storageRef = stoRef(storage, path);
    try {
      await deleteObject(storageRef);
    } catch (err) {
      error.value = err.message;
    }
  };

  return { url, filePath, error, uploadImage, deleteImage };
};

export default useStorage;
