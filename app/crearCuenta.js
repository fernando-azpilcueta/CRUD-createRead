
import {createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"

import {auth, guardarPerfil} from "./firebase.js";
import { mostrarMensaje } from "./mostrarMensaje.js";

const formCrearCuenta = $("#formCrearCuenta");



formCrearCuenta.submit(async function(event) {
    // Evita que el formulario se envíe
    event.preventDefault();
    
    // Realiza cualquier acción necesaria aquí

    //console.log(formCrearCuenta);

    //correo y contra (para crear cuenta con Authentication de Firebase)
    var correo = formCrearCuenta.find('#correoCrearCuenta').val();
    var contra = formCrearCuenta.find('#contraCrearCuenta').val();

    //demas campos para crear el perfil con los datos del usuario

    var nombres = formCrearCuenta.find('#nombresCrearCuenta').val();
    var apellidos = formCrearCuenta.find('#apellidosCrearCuenta').val();
    var edad = formCrearCuenta.find('#edadCrearCuenta').val();
    var sexo = formCrearCuenta.find('#sexoCrearCuenta').val();
    

    try{
        //Crear nueva cuenta en Authentication
        const credencialesUsuario = await createUserWithEmailAndPassword(auth,correo,contra);
        //Crear nuevo perfil de la cuenta en Firestore
        guardarPerfil(nombres,apellidos,edad,sexo,correo);



        //Cerrar modal de crear cuenta
        const modalCrearCuenta = $("#modalCrearCuenta");
        const modal = bootstrap.Modal.getInstance(modalCrearCuenta);
        modal.hide();

        //resetear el form
        formCrearCuenta.trigger('reset');
        //mostrar mensaje de bienvenida
        mostrarMensaje("Bienvenido "+nombres);



    }catch(error){
        console.log("error")
        if (error.code === 'auth/email-already-in-use') {
            mostrarMensaje("Email en uso", "error")
          } else if (error.code === 'auth/invalid-email') {
            mostrarMensaje("Invalido email", "error")
          } else if (error.code === 'auth/weak-password') {
            mostrarMensaje("Password corto", "error")
          } else if (error.code) {
            mostrarMensaje("Algo salio mal", "error")
          }
    }

});