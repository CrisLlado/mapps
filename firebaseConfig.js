

export const firebaseConfig = {
  apiKey: "AIzaSyAxyTBpHDzCPdtRyu6Gkh6iSTo1YfiEuds",
  authDomain: "offerange.firebaseapp.com",
  databaseURL:
    "https://offerange-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "offerange",
  storageBucket: "offerange.appspot.com",
  messagingSenderId: "282494476871",
  appId: "1:282494476871:web:a282aa840596e5fa0dc762",
  measurementId: "G-R6DXNB653X",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
