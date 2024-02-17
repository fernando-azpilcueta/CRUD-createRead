import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"
import { auth } from "./firebase.js";

const formIniciarSesion = $("#formIniciarSesion");
import { showMessage } from "./showMessage.js";

formIniciarSesion.submit(async function(event) {
    // Evita que el formulario se envíe
    event.preventDefault();
    
    // Realiza cualquier acción necesaria aquí

    console.log(formCrearCuenta);
    var correo = formIniciarSesion.find('#correoIniciarSesion').val();
    var contra = formIniciarSesion.find('#contraIniciarSesion').val();
    console.log(correo);
    console.log(contra);
    

    try{
        const credencialesUsuario = await signInWithEmailAndPassword(auth,correo,contra);
        console.log(credencialesUsuario);

        //Cerrar modal de crear cuenta
        const modal = bootstrap.Modal.getInstance(formIniciarSesion.closest('.modal'));
        modal.hide();

        //resetear el form
        formIniciarSesion.trigger('reset');
        //mostrar mensaje de bienvenida
        showMessage("Bienvenido "+credencialesUsuario.user.email);



    }catch(error){
        console.log("error")
        if (error.code === 'auth/wrong-password') {
          showMessage("Password equivocado", "error")
        } else if (error.code === 'auth/user-not-found') {
          showMessage("No se encuentra usuario", "error")
        } else {
          showMessage("Algo salio mal", "error") //si todo esta ok podrias cambiarlo como Tu email o pass estan equivocados
        }
    }

});