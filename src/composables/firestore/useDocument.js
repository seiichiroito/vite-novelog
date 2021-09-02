import { ref } from "vue";
import { Timestamp, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase/config";

const useDocument = (collectionName, id) => {
  const error = ref(null);
  const isPending = ref(false);

  const updateField = async (data) => {
    error.value = null;
    isPending.value = true;

    const docRef = doc(db, collectionName, id);

    try {
      const docData = {
        ...data,
        createdAt: Timestamp.fromDate(new Date()),
      };

      await updateDoc(docRef, {
        updatedAt: Timestamp.fromDate(new Date()),
        messages: arrayUnion(docData),
      });

      isPending.value = false;
      return res;
    } catch (err) {
      error.value = err.message;
      isPending.value = false;
    }
  };

  return { error, updateField, isPending };
};

export default useDocument;
