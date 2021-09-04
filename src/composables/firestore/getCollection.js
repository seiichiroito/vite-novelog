import { ref, watchEffect } from "vue";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/config";
const getCollection = (
  collectionName,
  filterQuery,
  secondFilterQuery,
  orderQuery
) => {
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
  } else if (orderQuery) {
    queryData = query(
      collection(db, collectionName),
      orderBy(orderQuery, "desc")
    );
  } else {
    queryData = query(
      collection(db, collectionName),
      orderBy("createdAt", "desc")
    );
  }

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

export default getCollection;
