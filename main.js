import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"
import { auth, actualizarObtenerTareas, eliminarTarea, actualizarTarea, obtenerTarea } from "./app/firebase.js";

import './app/crearCuenta.js'
import './app/iniciarSesion.js'
import './app/cerrarSesion.js'
import { verificarSesion } from './app/verificarSesion.js'
import { mostrarContenidoVacio } from './app/mostrarContenido.js';
import { mostrarContenido } from './app/mostrarContenido.js';
import { mostrarMensaje } from "./app/mostrarMensaje.js";

import { guardarTarea } from "./app/firebase.js";

const formTareas = $("#form-tareas");
let userGlobal;
let estadoEditar = false;
let id = '';
auth.onAuthStateChanged(async function (user) {
  if (user) {
    userGlobal = user;
    verificarSesion(user);
    const correo = user.email;
    console.log("sesion iniciada");

    actualizarObtenerTareas(querySnapshot => {
      let html = '';
      let html2 = '';
      querySnapshot.forEach(function (doc) {
        const tarea = doc.data();

        if (tarea.email == correo) {
          const fecha = tarea.fechaCreacion.toDate();
          const anio = fecha.getFullYear();
          const mes = fecha.getMonth() + 1; // Se suma 1 ya que los meses van de 0 a 11
          const dia = fecha.getDate();
          const hora = fecha.getHours();
          const minutos = fecha.getMinutes();
          const segundos = fecha.getSeconds();
          html += `
                    <li class="list-group-item list-group-item-action mt-2">
                      <h5>${tarea.titulo}</h5>
                      <p><i>${"Creado el día "+dia+"/"+mes+"/"+anio+" a las "+hora+":"+minutos+":"+segundos}</i></p>
                      <p>${tarea.descripcion}</p>
                      <div>
                        <button class="btn btn-primary btn-eliminar" data-id="${doc.id}">
                          Delete
                        </button>
                        <button class="btn btn-secondary btn-editar" data-id="${doc.id}">
                          Edit
                        </button>
                      </div>
                    </li>
                  `;
        }
      });

      querySnapshot.forEach(function (doc) {
        const tarea = doc.data();

        if (tarea.email != correo) {
          const fecha = tarea.fechaCreacion.toDate();
          const anio = fecha.getFullYear();
          const mes = fecha.getMonth() + 1; // Se suma 1 ya que los meses van de 0 a 11
          const dia = fecha.getDate();
          const hora = fecha.getHours();
          const minutos = fecha.getMinutes();
          const segundos = fecha.getSeconds();
          html2 += `
                    <li class="list-group-item list-group-item-action mt-2">
                      <h5>${tarea.titulo}</h5>
                      <p><i>${"Creado el día "+dia+"/"+mes+"/"+anio+" a las "+hora+":"+minutos+":"+segundos}</i></p>
                      <h6>${tarea.email}</h6>
                      <p>${tarea.descripcion}</p>
                      <div>
                        <button class="btn btn-primary btn-eliminar" data-id="">
                          Like
                        </button>
                        <button class="btn btn-secondary btn-editar" data-id="">
                          Comentar
                        </button>
                      </div>
                    </li>
                  `;
        }
      });

      contenedorTareas.html(html);
      contenedorTareasTodas.html(html2);

      //ACCION ELIMINAR

      const $btnsEliminar = $('.btn-eliminar');

      $btnsEliminar.each(function () {
        $(this).on('click', function (event) {
          eliminarTarea($(this).data('id'));
        });
      });

      //ACCION EDITAR

      const btnsEditar = $(".btn-editar"); // En la constante btnsEditar se guarda 
      btnsEditar.each(function () { //con cada uno de los botones editar quiero que hagas lo siguiente
        $(this).on('click', async function (event) {
          const doc = await obtenerTarea($(this).data("id"));
          const tarea = doc.data(); //me va a obtener toda la info de la tarea (titulo, descripcion) y lo va a guardar en la constante "tarea"
          const taskForm2 = $("#form-tareas"); //Dentro de taskForm2 se guardará el forms de las tareas 
          taskForm2.find('#titulo-tarea').val(tarea.titulo); //Se coloca el titulo de la tarea en el input del forms
          taskForm2.find('#descripcion-tarea').val(tarea.descripcion); ////Se coloca la descrip de la tarea en el input del forms
          estadoEditar = true; //se esta editando
          id = doc.id;
          taskForm2.find('#btn-task-form').text('Modificar');
        });
      });

    });

    const contenedorTareas = $("#contenedor-tareas-mias");
    const contenedorTareasTodas = $("#contenedor-tareas-todas");
  } else {
    console.log("sin sesion")

    const contenedorTareas = $("#contenedor-tareas-mias");
    const contenedorTareasTodas = $("#contenedor-tareas-todas");
    contenedorTareas.html('<h3 class="text-white">Inicia sesión para ver tus publicaciones</h3>');
    contenedorTareasTodas.html('');
    //mostrarContenidoVacio();
    verificarSesion(user);
  }
});

formTareas.submit(function (e) {
  e.preventDefault();

  var tituloF = formTareas.find("#titulo-tarea").val();
  var descripcionF = formTareas.find("#descripcion-tarea").val();
  var fechaCreacionF = new Date(); // crear fecha actual
  console.log(fechaCreacionF)

  if (userGlobal) {

    if (estadoEditar) { //se evalua si estamos en modo editar
      actualizarTarea(id, {
        titulo: tituloF,
        descripcion: descripcionF,
        email: userGlobal.email,

      });
      estadoEditar = false;
      id = "";
      formTareas.find('#btn-task-form').text('Guardar'); //que el boton diga guardar denuevo

    } else {
      guardarTarea(tituloF, descripcionF, userGlobal.email, fechaCreacionF);
      mostrarMensaje("¡Nueva publicación creada!");
    }

    formTareas.trigger('reset');
  }
});

