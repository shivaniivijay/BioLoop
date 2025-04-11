import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfYgmrk_CDwgZhsV7f9ATGo80UMKEMlN8",
  authDomain: "foodwasteapp-sj.firebaseapp.com",
  projectId: "foodwasteapp-sj",
  storageBucket: "foodwasteapp-sj.appspot.com",
  messagingSenderId: "58384204516",
  appId: "1:58384204516:web:99afd1c2ea8cb007e522f1",
  measurementId: "G-CFPQL9TBNZ"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };