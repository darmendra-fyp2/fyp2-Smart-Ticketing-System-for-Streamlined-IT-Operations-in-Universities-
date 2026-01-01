// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOaHzIMdXZHOfgDS56sKKL6NLRT41dBmM",
  authDomain: "it-helpdesk-fyp2.firebaseapp.com",
  projectId: "it-helpdesk-fyp2",
  storageBucket: "it-helpdesk-fyp2.firebasestorage.app",
  messagingSenderId: "168621686870",
  appId: "1:168621686870:web:a3cd6fd0c36b60c0adbbf7",
  measurementId: "G-MVE0EDPWTT"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
