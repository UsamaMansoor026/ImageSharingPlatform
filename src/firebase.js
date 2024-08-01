import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBERslrP859hju5_LzTY0oKAAA51E8BmnE",
  authDomain: "imagesharingplatform.firebaseapp.com",
  projectId: "imagesharingplatform",
  storageBucket: "imagesharingplatform.appspot.com",
  messagingSenderId: "440971233582",
  appId: "1:440971233582:web:c8d9386115cd7a98de52bf",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
