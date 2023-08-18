import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

interface Product {
  name: string;
  description: string;
  price: number;
  location: {
    latitude: number;
    longitude: number;
  };
  categoria: string; // Nuevo campo
  fechaCreacion: firebase.firestore.Timestamp; // Nuevo campo
}

const firebaseConfig = {
  apiKey: "AIzaSyAxyTBpHDzCPdtRyu6Gkh6iSTo1YfiEuds",
  authDomain: "offerange.firebaseapp.com",
  databaseURL: "https://offerange-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "offerange",
  storageBucket: "offerange.appspot.com",
  messagingSenderId: "282494476871",
  appId: "1:282494476871:web:a282aa840596e5fa0dc762",
  measurementId: "G-R6DXNB653X",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const uploadImage = async (uri, imageName) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = firebase.storage().ref().child(`images/${imageName}`);
    await ref.put(blob);

    const downloadURL = await ref.getDownloadURL();
    return downloadURL;
  } catch (error) {
    console.error("Error al subir la imagen: ", error);
    throw error;
  }
};

export const registerUser = async (email, password) => {
  try {
    const userCredential = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    await firebase.firestore().collection('users').doc(user.uid).set({
      email: user.email,
      displayName: '',
      photoURL: '',
    });

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await firebase.auth().signOut();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createProduct = async (
  name,
  description,
  price,
  latitude,
  longitude,
  imageUrl,
  categoria, // Nuevo argumento
  fechaCreacion, // Nuevo argumento
  updateOffers
) => {
  try {
    const currentUser = firebase.auth().currentUser;

    if (currentUser) {
      await firebase.firestore().collection("products").add({
        name,
        description,
        price: Number(price),
        location: new firebase.firestore.GeoPoint(latitude, longitude),
        imageUrl,
        userId: currentUser.uid,
        categoria, // Añade la categoría
        fechaCreacion, // Añade la fecha de creación
      });

      console.log("Producto creado exitosamente");

      if (updateOffers) {
        updateOffers(); // Actualiza los productos
      }
    } else {
      console.log("No hay usuario registrado");
    }
  } catch (error) {
    console.log("Error al crear el producto: ", error);
  }
};

export const updateOffers = async (setProducts) => {
  try {
    const products = await getProducts();
    setProducts(products);
  } catch (error) {
    console.error("Error al actualizar las ofertas: ", error);
  }
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const snapshot = await firebase.firestore().collection("products").get();
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.imageUrl,
        userId: data.userId,
        location: {
          latitude: data.location.latitude,
          longitude: data.location.longitude
        },
        categoria: data.categoria, // Añade la categoría
        fechaCreacion: data.fechaCreacion // Añade la fecha de creación
      }
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
