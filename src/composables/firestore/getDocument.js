import { ref, watchEffect } from "vue";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

import { db } from "../../firebase/config";

const getDocument = (collectionName, id) => {
  const error = ref(null);
  const document = ref(null);

  const docRef = doc(db, collectionName, id);

  const unSubscribe = onSnapshot(
    docRef,
    async (snap) => {
      if (!snap.data()) {
        error.value = "that document does not exist";
        return;
      }
      let owners = [];
      if (snap.data().owners) {
        await Promise.all(
          snap.data().owners.map(async (ownerRef) => {
            const owner = await getDoc(ownerRef);
            owners.push({
              id: owner.id,
              ...owner.data(),
            });
          })
        );
      }
      let messages;
      if (snap.data().messages) {
        messages = await Promise.all(
          snap.data().messages.map(async (message) => {
            const sender = await getDoc(message.senderRef);
            return {
              ...message,
              sender: {
                id: sender.id,
                ...sender.data(),
              },
            };
          })
        );
      }

      document.value = {
        id: snap.id,
        ...snap.data(),
        owners,
        messages,
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
