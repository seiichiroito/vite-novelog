import { ref, watchEffect } from "vue";
import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/config";
const getNextCollection = (collectionName, lastDoc, limitNumber) => {
  const error = ref(null);
  const documents = ref([]);

  const queryData = query(
    collection(db, collectionName),
    orderBy("createdAt", "desc"),
    limit(limitNumber),
    startAfter(lastDoc)
  );

  const unSubscribe = onSnapshot(
    queryData,
    async (snap) => {
      documents.value = await Promise.all(
        snap.docs.map(async (snapDoc) => {
          let owner;
          if (snapDoc.data().owner) {
            const ownerRef = doc(db, snapDoc.data().owner.path);
            owner = await getDoc(ownerRef);
          }

          return {
            id: snapDoc.id,
            ...snapDoc.data(),
            owner: owner && {
              id: owner.id,
              ...owner.data(),
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

export default getNextCollection;
