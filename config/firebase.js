const firebase = require('firebase');

firebase.initializeApp({
  apiKey: process.env.FIREBASE_KEY,
  authDomain: 'fizzcal-90a6f.firebaseapp.com',
  databaseURL: 'https://fizzcal-90a6f.firebaseio.com',
  projectId: 'fizzcal-90a6f',
  storageBucket: '',
  messagingSenderId: '1025855591618',
  appId: '1:1025855591618:web:8fb81218aa4e8321',
});

module.exports = {
  db: firebase.database(),
  auth: firebase.auth(),
};
