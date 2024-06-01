import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getStorage } from "firebase/database";
//initialize firebase
// add you firebase config bellow
// i'll just set the config and get back
// you can call it in the location where you are going to have the upload function

const firebaseConfig = {
  apiKey: "AIzaSyB-4nr7OR6kFKAM5Y53LgnlWNOAJjqa7Ws",
  authDomain: "courseapp-d7d46.firebaseapp.com",
  projectId: "courseapp-d7d46",
  storageBucket: "courseapp-d7d46.appspot.com",
  messagingSenderId: "1062568830626",
  appId: "1:1062568830626:web:bd838110067b1e409399fb",
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const app = firebase.app();
const auth = firebase.auth();
const db = firebase.firestore();
export { firebase, app, db, auth };
