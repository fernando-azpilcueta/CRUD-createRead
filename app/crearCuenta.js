
import {createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"

import {auth} from "./firebase.js";
import { showMessage } from "./showMessage.js";

const formCrearCuenta = $("#formCrearCuenta");



formCrearCuenta.submit(async function(event) {
    // Evita que el formulario se envíe
    event.preventDefault();
    
    // Realiza cualquier acción necesaria aquí

    console.log(formCrearCuenta);
    var correo = formCrearCuenta.find('#correoCrearCuenta').val();
    var contra = formCrearCuenta.find('#contraCrearCuenta').val();
    console.log(correo);
    console.log(contra);
    

    try{
        const credencialesUsuario = await createUserWithEmailAndPassword(auth,correo,contra);
        console.log(credencialesUsuario);

        //Cerrar modal de crear cuenta
        const modalCrearCuenta = $("#modalCrearCuenta");
        const modal = bootstrap.Modal.getInstance(modalCrearCuenta);
        modal.hide();

        //resetear el form
        formCrearCuenta.trigger('reset');
        //mostrar mensaje de bienvenida
        alert("Bienvenido "+credencialesUsuario.user.email);



    }catch(error){
        console.log("error")
        if (error.code === 'auth/email-already-in-use') {
            showMessage("Email en uso", "error")
          } else if (error.code === 'auth/invalid-email') {
            showMessage("Invalido email", "error")
          } else if (error.code === 'auth/weak-password') {
            showMessage("Password corto", "error")
          } else if (error.code) {
            showMessage("Algo salio mal", "error")
          }
    }

});