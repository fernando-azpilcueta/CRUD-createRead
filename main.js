import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"
import { auth, actualizarObtenerTareas, eliminarTarea, actualizarTarea, obtenerTarea, obtenerPerfil, guardarComentario, obtenerComentarios } from "./app/firebase.js";

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
let cantComentGlobal = 0;

auth.onAuthStateChanged(async function (user) {
  if (user) {
    userGlobal = user;
    verificarSesion(user);
    const correo = user.email;




    actualizarObtenerTareas(querySnapshot => {



      let html = ''
      let html2 = ''
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

          let textoLike = "";
          //mi usuario le dio like o no?
          if (tarea.personasLiked.includes(correo)) {
            textoLike = "Ya no me gusta";
          } else {
            textoLike = "Me gusta";
          }
          
          html += `
                    <li class="list-group-item list-group-item-action mt-2">
                      <h5>${tarea.titulo}</h5>
                      
                      <p>${tarea.descripcion}</p>
                      <p class="text-end"><i>${"Creado el día " + dia + "/" + mes + "/" + anio + " a las " + hora + ":" + minutos + ":" + segundos}</i></p>
                      
                      <div>
                        <button class="btn btn-secondary btn-editar bi bi-pencil" data-id="${doc.id}">
                          Editar
                        </button>
                        <button class="btn btn-danger btn-eliminar bi bi-trash3" data-id="${doc.id}">
                          Eliminar
                        </button>
                        <button class="btn btn-primary btn-like" data-id="${doc.id}">
                            ${textoLike}
                          </button>
                        <button class="btn btn-secondary btn-verComentarios" data-id="${doc.id}" data-bs-toggle="modal" data-bs-target="#modalComentarios">
                            Comentar
                          </button>
                          <label>${tarea.cantLikes} me gusta(s), </label>
                          <label>${tarea.cantComentarios} comentario(s)</label>
                      </div>
                    </li>
                  `;

        }
      });

      querySnapshot.forEach(async function (doc) {
        const tarea = doc.data();

        if (tarea.email != correo) {

          const fecha = tarea.fechaCreacion.toDate();
          const anio = fecha.getFullYear();
          const mes = fecha.getMonth() + 1; // Se suma 1 ya que los meses van de 0 a 11
          const dia = fecha.getDate();
          const hora = fecha.getHours();
          const minutos = fecha.getMinutes();
          const segundos = fecha.getSeconds();

          let textoLike = "";
          //mi usuario le dio like o no?
          if (tarea.personasLiked.includes(correo)) {
            textoLike = "Ya no me gusta";
          } else {
            textoLike = "Me gusta";
          }

          //const perfil = await obtenerPerfil(tarea.email);


          //console.log(perfil);

          html2 += `
                      
                      <li class="list-group-item list-group-item-action mt-2 d-flex flex-column">
                      <div class="d-flex justify-content-between">
                      <label class="nombreUsuarios" data-id=""><b>${tarea.email}</b> publicó:</label>
                      
                      <button class="btn-otroPerfil btn btn-primary bi bi-person-square" data-id="${tarea.email}" data-bs-toggle="modal" data-bs-target="#modalPerfil"> 
                      Ver perfil
                      </button>
                      </div>
                      <div class="border mt-2"></div>
                        <h5>${tarea.titulo}</h5>
                        <p>${tarea.descripcion}</p>
                        
                        <p class="text-end"><i>${"Publicado el día " + dia + "/" + mes + "/" + anio + " a las " + hora + ":" + minutos + ":" + segundos}</b></i></p>
                        
                        <div>
                          <button class="btn btn-primary btn-like" data-id="${doc.id}">
                            ${textoLike}
                          </button>
                          <button class="btn btn-secondary btn-verComentarios" data-id="${doc.id}" data-bs-toggle="modal" data-bs-target="#modalComentarios">
                            Comentar
                          </button>
                          <label>${tarea.cantLikes} me gusta(s), </label>
                          <label>${tarea.cantComentarios} comentario(s)</label>
                          
                        </div>
                      </li>        
          `;




        }
      });
      contenedorTareasMias.html(html)
      contenedorTareasTodas.html(html2)


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


      //ACCION MOSTRAR PERFIL


      const btnsOtroPerfil = $('.btn-otroPerfil');

      btnsOtroPerfil.each(function () {
        $(this).click(async function () {
          llenarModalPerfil(await obtenerPerfil($(this).data('id')))
        });
      });


      //DAR LIKE

      const btnsLike = $(".btn-like");

      btnsLike.each(function () {


        $(this).click(async function () {

          const idTarea = $(this).data('id');
          const doc = await obtenerTarea(idTarea);
          const tarea = doc.data();

          if (tarea.personasLiked.includes(correo)) {
            let personas = tarea.personasLiked;
            personas.pop(correo);

            let likes = tarea.cantLikes;
            likes--;

            actualizarTarea(idTarea, {
              personasLiked: personas,
              cantLikes: likes

            });
            
          } else {
            let personas = tarea.personasLiked;
            personas.push(correo);

            let likes = tarea.cantLikes;
            likes++;

            actualizarTarea(idTarea, {
              personasLiked: personas,
              cantLikes: likes

            });
          }
        });

      });

      //VER COMENTARIOS

      const btnsVerComentarios = $(".btn-verComentarios");

      btnsVerComentarios.each(function () {


        $(this).click(async function () {

          const idTarea = $(this).data('id');
          formComentario.attr("id", idTarea);

          const listaComentarios = $("#lista-comentarios");
          console.log("borrooo")
          listaComentarios.html('');

          const comentarios = await obtenerComentarios(idTarea);
          cantComentGlobal = comentarios.length;
          if (comentarios) {
            comentarios.sort(function (a, b) { return a.fechaCreacion - b.fechaCreacion; })
            console.log(comentarios)
            comentarios.forEach(function (comentario) {

              const fecha = comentario.fechaCreacion.toDate();
              const anio = fecha.getFullYear();
              const mes = fecha.getMonth() + 1; // Se suma 1 ya que los meses van de 0 a 11
              const dia = fecha.getDate();
              const hora = fecha.getHours();
              const minutos = fecha.getMinutes();
              const segundos = fecha.getSeconds();

              //console.log(comentario.texto)
              listaComentarios.append(`
        <p><b>${comentario.email}</b></p>
        <h5>${comentario.texto}</h5>
        <p>${"Publicado el día " + dia + "/" + mes + "/" + anio + " a las " + hora + ":" + minutos + ":" + segundos}</p>
        <div class="border mt-2"></div>`);
            }
            )


          }

        });

      });




    });

    const contenedorTareasMias = $("#contenedor-tareas-mias");
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
  var cantComentarios = 0;
  var cantLikes = 0;
  var personasLiked = [];
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
      guardarTarea(tituloF, descripcionF, userGlobal.email, fechaCreacionF, cantComentarios, cantLikes, personasLiked);
      mostrarMensaje("¡Nueva publicación creada!");
    }

    formTareas.trigger('reset');
  }
});


//LLENAR MODAL DE PERFIL
function llenarModalPerfil(perfil) {

  $("#tituloCard").html("Perfil");
  $("#nombresCard").html("Nombre: " + perfil.nombres);
  $("#apellidosCard").html("Apellidos: " + perfil.apellidos);
  $("#edadCard").html("Edad: " + perfil.edad);
  $("#sexoCard").html("Sexo: " + perfil.sexo);
}


//EVENTO PARA VER MI PERFIL
$("#botonPerfil").click(async function () {
  llenarModalPerfil(await obtenerPerfil(userGlobal.email));
});


//ACCION VER COMENTARIOS

const formComentario = $("#formComentario");


//ACCION COMENTAR



formComentario.submit(async function (e) {
  e.preventDefault();
  var textoComentario = $(this).find("#texto-comentario").val();
  var fechaCreacionF = new Date(); // crear fecha actual
  var idTarea = $(this).attr("id");

  if (userGlobal) {
    console.log("PASOOOOO")
    guardarComentario(textoComentario, fechaCreacionF, idTarea, userGlobal.email);


    const anio = fechaCreacionF.getFullYear();
    const mes = fechaCreacionF.getMonth() + 1; // Se suma 1 ya que los meses van de 0 a 11
    const dia = fechaCreacionF.getDate();
    const hora = fechaCreacionF.getHours();
    const minutos = fechaCreacionF.getMinutes();
    const segundos = fechaCreacionF.getSeconds();

    //console.log(comentario.texto)
    $("#lista-comentarios").append(`
     <p><b>${userGlobal.email}</b></p>
     <h5>${textoComentario}</h5>
     <p>${"Publicado el día " + dia + "/" + mes + "/" + anio + " a las " + hora + ":" + minutos + ":" + segundos}</p>
     <div class="border mt-2"></div>`);



  }
  cantComentGlobal = cantComentGlobal + 1;
  actualizarTarea(idTarea, {
    cantComentarios: cantComentGlobal
  });

  $(this).trigger('reset');
}
);


