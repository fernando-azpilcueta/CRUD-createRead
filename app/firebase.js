// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {getAuth} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js" 
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

import {getFirestore, collection, addDoc, getDocs, onSnapshot, deleteDoc, doc, updateDoc, getDoc, query, where} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVwY9ZyTt37Hp6Df28ADklOK0I4wUY-6Q",
  authDomain: "fir-app-prueba-62edb.firebaseapp.com",
  projectId: "fir-app-prueba-62edb",
  storageBucket: "fir-app-prueba-62edb.appspot.com",
  messagingSenderId: "19834426313",
  appId: "1:19834426313:web:ffb1179653cd6aa8934e18",
  measurementId: "G-23DWELCXFX"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
//export const analytics = getAnalytics(app);

//CRUD

export const db = getFirestore();

// COLECTION: TAREAS

//Guardar una tarea nueva en Firebase
export function guardarTarea(titulo, descripcion, email,fechaCreacion) {
  addDoc(collection(db, "tareas"), { titulo, descripcion, email,fechaCreacion });
}
//Obtener todas las tareas guardadas en Firebase
export function obtenerTareas() {
  return getDocs(collection(db, 'tareas'));
}
//Obtener todas las tareas guardadas en Firebase (esta funcion se llama constantemente)
export function actualizarObtenerTareas(callback) {
  return onSnapshot(collection(db, "tareas"), callback);
}
//Eliminar una tarea en Firebase
export function eliminarTarea(id) {
  return deleteDoc(doc(db, "tareas", id));
}
//Obtener una tarea guardada en Firebase
export function obtenerTarea(id) {
  return getDoc(doc(db, "tareas", id));
}
//Modificar una tarea en Firebase
export function actualizarTarea(id, nuevosCampos) {
  return updateDoc(doc(db, "tareas", id), nuevosCampos);
}

// COLECTION: PERFILES

//Guardar una tarea nueva en Firebase
export function guardarPerfil(nombres,apellidos,edad,sexo,email) {
  addDoc(collection(db, "perfiles"), { nombres,apellidos,edad,sexo,email});
}

//Obtener perfil por correo
export async function obtenerPerfil(email){
  const q = query(collection(db, "perfiles"), where("email", "==", email));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs[0].data();
}