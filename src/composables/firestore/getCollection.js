import { ref, watchEffect } from "vue";
import {
  collection,
  doc,
  getDoc,
  limit,
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
      where(...secondFilterQuery),
      limit(100)
    );
  } else if (filterQuery) {
    queryData = query(
      collection(db, collectionName),
      where(...filterQuery),
      limit(100)
    );
  } else if (orderQuery) {
    queryData = query(
      collection(db, collectionName),
      orderBy(orderQuery, "desc"),
      limit(100)
    );
  } else {
    queryData = query(
      collection(db, collectionName),
      orderBy("createdAt", "desc"),
      limit(100)
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

  const loadMore = () => {};

  watchEffect((onInvalidate) => {
    onInvalidate(() => unSubscribe());
  });

  return { error, documents, loadMore };
};

export default getCollection;
