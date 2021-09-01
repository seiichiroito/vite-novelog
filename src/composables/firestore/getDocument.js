import { ref, watchEffect } from "vue";
import { doc, onSnapshot } from "firebase/firestore";

import { db } from "../../firebase/config";

const getDocument = (collectionName, id) => {
  const error = ref(null);
  const document = ref(null);

  const docRef = doc(db, collectionName, id);

  const unSubscribe = onSnapshot(
    docRef,
    (doc) => {
      if (!doc.data()) {
        error.value = "that document does not exist";
        return;
      }

      document.value = {
        id: doc.id,
        ...doc.data(),
      };
      error.value = null;
    },
    (err) => {
      error.value = "could not fetch the document";
      document.value = null;
    }
  );

  watchEffect((onInvalidate) => {
    onInvalidate(() => unSubscribe());
  });

  return {
    error,
    document,
  };
};

export default getDocument;
