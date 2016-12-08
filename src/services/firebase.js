import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyDnSQdro-sLZa3ftteaJxnUWG_NF0jVv2Q',
  authDomain: 'chat-sandbox-88b42.firebaseapp.com',
  databaseURL: 'https://chat-sandbox-88b42.firebaseio.com',
  storageBucket: 'chat-sandbox-88b42.appspot.com',
  messagingSenderId: '486045074886'
};
firebase.initializeApp(firebaseConfig);

export const firebaseMessagesRef = firebase.database().ref('messages');
export const firebaseAuth = firebase.auth();
export const firebaseAuthProvider = firebase.auth;
