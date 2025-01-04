import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyAoCvk2eLxDPqZH3YSOITfUVpURfZX__oc",
	authDomain: "detoxify-71df8.firebaseapp.com",
	projectId: "detoxify-71df8",
	storageBucket: "detoxify-71df8.firebasestorage.app",
	messagingSenderId: "628577899751",
	appId: "1:628577899751:web:67db4c0640141bf42cbe42",
	measurementId: "G-K7LLXTYZBT"
  };
	

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };
