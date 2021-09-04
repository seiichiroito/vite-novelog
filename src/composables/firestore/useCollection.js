import { ref } from "vue";
import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/config";

const useCollection = (collectionName) => {
  const error = ref(null);
  const isPending = ref(false);

  const addDocument = async (docData) => {
    error.value = null;
    isPending.value = true;

    try {
      const res = await addDoc(collection(db, collectionName), {
        ...docData,
        createdAt: Timestamp.fromDate(new Date()),
      });
      isPending.value = false;
      return res;
    } catch (err) {
      error.value = err.message;
      isPending.value = false;
    }
  };

  const addDocumentWithId = async (docData, id) => {
    error.value = null;
    isPending.value = true;

    try {
      await setDoc(doc(db, collectionName, id), {
        ...docData,
        createdAt: Timestamp.fromDate(new Date()),
      });
      isPending.value = false;
      return doc(db, collectionName, id);
    } catch (err) {
      error.value = err.message;
      isPending.value = false;
    }
  };

  return { error, addDocument, isPending, addDocumentWithId };
};

export default useCollection;
