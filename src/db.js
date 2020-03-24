import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "wera-todo.firebaseapp.com",
    databaseURL: "https://wera-todo.firebaseio.com",
    projectId: "wera-todo",
    storageBucket: "wera-todo.appspot.com",
    messagingSenderId: "143970156227",
    appId: "1:143970156227:web:8986a49f87d1390e7d2c76",
    measurementId: "G-L55BEXFZBY"
  };
var db = firebase.initializeApp(firebaseConfig);
export default db;
export const getCurrentUser = () => firebase.auth().currentUser;
export const taskCollectionRef = (uid) => db.firestore().collection('tasks').doc(uid).collection('todo').orderBy("dueDate", "asc");
export const mondayCollectionRef = (uid) => db.firestore().collection('tasks').doc(uid).collection('monday');
export const tuesdayCollectionRef = (uid) => db.firestore().collection('tasks').doc(uid).collection('tuesday');
export const wednesdayCollectionRef = (uid) => db.firestore().collection('tasks').doc(uid).collection('wednesday');
export const thursdayCollectionRef = (uid) => db.firestore().collection('tasks').doc(uid).collection('thursday');
export const fridayCollectionRef = (uid) => db.firestore().collection('tasks').doc(uid).collection('friday');