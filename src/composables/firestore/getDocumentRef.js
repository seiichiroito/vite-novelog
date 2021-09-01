import { doc } from "firebase/firestore";

import { db } from "../../firebase/config";

const getDocumentRef = (collectionName, id) => {
  return doc(db, collectionName, id);
};

export default getDocumentRef;
