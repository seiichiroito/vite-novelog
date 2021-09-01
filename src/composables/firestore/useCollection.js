import { ref } from "vue";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/config";

const useCollection = (collectionName) => {
  const error = ref(null);
  const isPending = ref(false);

  const addDocument = async (doc) => {
    error.value = null;
    isPending.value = true;

    try {
      const docData = {
        ...doc,
        createdAt: Timestamp.fromDate(new Date()),
      };

      const res = await addDoc(collection(db, collectionName), docData);
      isPending.value = false;
      return res;
    } catch (err) {
      error.value = err.message;
      isPending.value = false;
    }
  };

  return { error, addDocument, isPending };
};

export default useCollection;
