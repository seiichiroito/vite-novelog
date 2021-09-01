import { ref, watchEffect } from "vue";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/config";
const getCollection = (collectionName, filterQuery, secondFilterQuery) => {
  const error = ref(null);
  const documents = ref([]);

  let queryData;

  if (filterQuery && secondFilterQuery) {
    queryData = query(
      collection(db, collectionName),
      where(...filterQuery),
      where(...secondFilterQuery)
    );
  } else if (filterQuery) {
    queryData = query(collection(db, collectionName), where(...filterQuery));
  } else {
    queryData = collection(db, collectionName);
  }

  const unSubscribe = onSnapshot(
    queryData,
    async (snap) => {
      documents.value = await Promise.all(
        snap.docs.map(async (snapDoc) => {
          let sender;
          if (snapDoc.data().sender) {
            const senderRef = doc(db, snapDoc.data().sender.path);
            sender = await getDoc(senderRef);
          }
          let receiver;
          if (snapDoc.data().receiver) {
            const receiverRef = doc(db, snapDoc.data().receiver.path);
            receiver = await getDoc(receiverRef);
          }

          let author;
          if (snapDoc.data().authorRef) {
            const authorRef = doc(db, snapDoc.data().authorRef.path);
            author = await getDoc(authorRef);
          }

          return {
            id: snapDoc.id,
            ...snapDoc.data(),
            sender: sender && {
              id: sender.id,
              ...sender.data(),
            },
            receiver: receiver && {
              id: receiver.id,
              ...receiver.data(),
            },
            author: author && {
              id: author.id,
              ...author.data(),
            },
          };
        })
      );
      error.value = null;
    },
    (err) => {
      error.value = err.message;
      documents.value = null;
    }
  );

  watchEffect((onInvalidate) => {
    onInvalidate(() => unSubscribe());
  });

  return { error, documents };
};

export default getCollection;
