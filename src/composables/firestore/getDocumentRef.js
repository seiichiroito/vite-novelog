import { doc } from "firebase/firestore";
import { ref } from "vue";

import { db } from "../../firebase/config";

const getDocumentRef = (collectionName, id) => {
  const docRef = ref(null);
  docRef.value = doc(db, collectionName, id);
  return { docRef };
};

export default getDocumentRef;
