import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyACQuOY8s5UryvDKd0QRm1QnJzCbNFnI9A",
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