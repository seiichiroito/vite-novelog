import { ref, watchEffect } from "vue";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase/config";
const getCollection = (collectionName, filterQuery) => {
  const error = ref(null);
  const documents = ref([]);

  let queryData;
  if (filterQuery) {
    queryData = query(collection(db, collectionName), where(...filterQuery));
  } else {
    queryData = collection(db, collectionName);
  }

  const unSubscribe = onSnapshot(
    queryData,
    (snap) => {
      documents.value = snap.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
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
