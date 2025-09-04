import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FireBase_apiKey,
  projectId: process.env.REACT_APP_FireBase_projectId,
  storageBucket: process.env.REACT_APP_FireBase_storageBucket,
  messagingSenderId: process.env.REACT_APP_FireBase_messagingSenderId,
  appId: process.env.REACT_APP_FireBase_appId,
  measurementId: process.env.REACT_APP_FireBase_measurementId,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);
