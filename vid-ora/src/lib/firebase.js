import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBXbLuY69WRCWsa4NJnCQaa6mFl2loQ2oo",
  authDomain: "vid-ora.firebaseapp.com",
  projectId: "vid-ora",
  storageBucket: "vid-ora.firebasestorage.app",
  messagingSenderId: "744867558783",
  appId: "1:744867558783:web:d29fb9bda46749dd37164a",
  measurementId: "G-Z1TVY1HVQY",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };