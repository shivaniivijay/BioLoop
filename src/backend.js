import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

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
const auth = getAuth(app);
const db = getFirestore(app);

export const addBiogasPlant = async (plantData) => {
  try {
    const docRef = await addDoc(collection(db, "plants"), plantData);
    return docRef.id;
  } catch (error) {
    throw new Error(`Failed to add plant: ${error.message}`);
  }
};

export const logWaste = async (wasteData) => {
  try {
    const docRef = await addDoc(collection(db, "waste"), {
      ...wasteData,
      timestamp: new Date()
    });
    return docRef.id;
  } catch (error) {
    throw new Error(`Failed to log waste: ${error.message}`);
  }
};

export const createUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const matchWasteWithPlants = async (wasteId) => {
  try {
    const [wasteSnap, plantsSnap] = await Promise.all([
      getDocs(collection(db, "waste")),
      getDocs(collection(db, "plants"))
    ]);

    return plantsSnap.docs
      .filter(plantDoc => 
        plantDoc.data().location === wasteSnap.docs.find(d => d.id === wasteId)?.data().location
      )
      .map(plantDoc => ({
        plantId: plantDoc.id,
        plantData: plantDoc.data()
      }));
  } catch (error) {
    throw new Error(`Matching failed: ${error.message}`);
  }
};

export { auth, db };