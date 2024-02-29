import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"
import { auth, actualizarObtenerTareas, eliminarTarea, actualizarTarea, obtenerTarea, obtenerPerfil, guardarComentario, obtenerComentarios} from "./app/firebase.js";

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
                        <button class="btn btn-secondary btn-verComentarios" data-id="${doc.id}">
                            Comentar
                          </button>
                          <label>${tarea.cantComentarios} comentario(s)</label>
                      </div>

                    </li>

                    <li id="${doc.id}" class="list-group-item list-group-item-action mt-2 li-comentario" data-id="" style="display: none">
                      <h4>COMENTARIOS</h4>
                      <div id="contenedor${doc.id}">
                        
                        
                      </div>
                      
                      <form id="${doc.id}" class="formComentario">
                      <div class="mb-3">
                        <label for="comentario" class="form-label">Haz un comentario: </label>
                        <textArea type="text" class="form-control" id="texto-comentario" aria-describedby="emailHelp"></textArea>
                        
                      </div>
                      
                      <button type="submit" class="btn btn-primary btn-comentar">Comentar</button>
                    </form>
                    
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
                          <button class="btn btn-primary btn-like" data-id="">
                            Like
                          </button>
                          <button class="btn btn-secondary btn-verComentarios" data-id="${doc.id}">
                            Comentar
                          </button>
                          <label>${tarea.cantComentarios} comentario(s)</label>
                          
                        </div>
                      </li>

                      <li id="${doc.id}" class="list-group-item list-group-item-action mt-2 li-comentario" data-id="" style="display: none">
                      <h4>COMENTARIOS</h4>
                      <div id="contenedor${doc.id}">
                        
                        
                      </div>
                      
                      <form id="${doc.id}" class="formComentario">
                      <div class="mb-3">
                        <label for="comentario" class="form-label">Haz un comentario: </label>
                        <textArea type="text" class="form-control" id="texto-comentario" aria-describedby="emailHelp"></textArea>
                        
                      </div>
                      
                      <button type="submit" class="btn btn-primary btn-comentar">Comentar</button>
                    </form>
                    
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


      //ACCION VER COMENTARIOS



      const btnsVerComentarios = $(".btn-verComentarios");

      btnsVerComentarios.each(function () {
       

        $(this).click(async function () {
          
          
          let idTarea = $(this).data('id');
          $("#contenedor" + idTarea).html('');
          const cuadro = $("#" + idTarea);

          if (cuadro.css("display") == "block") {
            cuadro.css("display", "none");
          }
          else {
            cuadro.css("display", "block");
          }

          
          console.log(idTarea)
          const comentarios = await obtenerComentarios(idTarea);
          if (comentarios) {
            //console.log(comentarios);

            
            comentarios.forEach(function (comentario) {

              const fecha = comentario.fechaCreacion.toDate();
              const anio = fecha.getFullYear();
              const mes = fecha.getMonth() + 1; // Se suma 1 ya que los meses van de 0 a 11
              const dia = fecha.getDate();
              const hora = fecha.getHours();
              const minutos = fecha.getMinutes();
              const segundos = fecha.getSeconds();

              //console.log(comentario.texto)
              $("#contenedor" + idTarea).append(`
              <p><b>${comentario.email}</b></p>
              <h5>${comentario.texto}</h5>
              <p>${"Publicado el día " + dia + "/" + mes + "/" + anio + " a las " + hora + ":" + minutos + ":" + segundos}</p>
              <div class="border mt-2"></div>`);
            });



          }

          
        });

      });

      //ACCION COMENTAR

      const formsComentario = $(".formComentario");

      formsComentario.each(function () {
        $(this).submit(async function (e) {
          e.preventDefault();
          var textoComentario = $(this).find("#texto-comentario").val();
          var fechaCreacionF = new Date(); // crear fecha actual
          var idTarea = $(this).attr("id");

          if (userGlobal) {
            guardarComentario(textoComentario, fechaCreacionF, idTarea, userGlobal.email);
            
           
           
            const comentarios = await obtenerComentarios(idTarea);
          if (comentarios) {
            //console.log(comentarios);

            $("#contenedor" + idTarea).html('');
            comentarios.forEach(function (comentario) {

              const fecha = comentario.fechaCreacion.toDate();
              const anio = fecha.getFullYear();
              const mes = fecha.getMonth() + 1; // Se suma 1 ya que los meses van de 0 a 11
              const dia = fecha.getDate();
              const hora = fecha.getHours();
              const minutos = fecha.getMinutes();
              const segundos = fecha.getSeconds();

              //console.log(comentario.texto)
              $("#contenedor" + idTarea).append(`
              <p><b>${comentario.email}</b></p>
              <h5>${comentario.texto}</h5>
              <p>${"Publicado el día " + dia + "/" + mes + "/" + anio + " a las " + hora + ":" + minutos + ":" + segundos}</p>
              <div class="border mt-2"></div>`);
            });



          }
            $(this).trigger('reset');
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
  var cantComentarios=0;
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
      guardarTarea(tituloF, descripcionF, userGlobal.email, fechaCreacionF,cantComentarios);
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

/*const formComentario = $("#formComentario");
formComentario.submit(function (e){
  e.preventDefault();
  var textoComentario = formComentario.find("#texto-comentario").val();
  var fechaCreacionF = new Date(); // crear fecha actual

  if (userGlobal) {
    guardarComentario(textoComentario,fechaCreacionF,$());
    formComentario.trigger('reset');
  }

});*/


