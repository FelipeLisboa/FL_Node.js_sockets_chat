var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre');
var sala = params.get('sala');

// referencias de jQuery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $("#divChatbox ");
var divNombreSala = $("#divNombreSala ");

//cambiar título de chat
function cambiarNombreSala() {
    var html = '';

    html += '<div class="p-20 b-b">';
    html += '   <h3 class="box-title">Sala de chat <small>' + params.get('sala') + '</small></h3>';
    html += '</div>';

    divNombreSala.html(html);
}


// Funciones para renderizar usuarios
function renderizarUsuarios(personas) { // [{},{},{}]

    console.log(personas);

    var html = '';

    html += '<li>';
    html += '   <a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + '</span></a>';
    html += '</li>';

    for (var i = 0; i < personas.length; i++) {

        html += '<li>';
        html += '    <a data-id="' + personas[i].id + '"  href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsuarios.html(html);

}

function renderizarMensajes(mensaje, yo) { //dar el mensaje y ver si lo envío yo u otra persona

    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ":" + fecha.getMinutes(); //hora y minutos

    var adminClass = 'info'; //info que va en el div class

    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    if (yo) { //si escribo yo
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '       <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    } else { //si escribe otra persona
        html += '<li class="animated fadeIn">';

        if (mensaje.nombre !== 'Administrador') { //si es el administador que aparezca su foto
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>'
        }
        html += '    <div class="chat-content">'
        html += '        <h5>' + mensaje.nombre + '</h5>'
        html += '        <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>'
        html += '    </div>'
        html += '    <div class="chat-time">' + hora + '</div>'
        html += '</li>'
    }

    divChatbox.append(html); //para cargar los mensajes en el html
}

function scrollBottom() { //mantiene el scroll abajo en lo último

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}


//Listeners
divUsuarios.on('click', 'a', function() { //que este pendiente de todas las "a" que existen dentro de este div
    var id = $(this).data('id'); //this es una sintaxis de jquery que hace referencia al elemento "a" que acabo de hacer click y de ahí tomo el id 

    if (id) {
        console.log(id);
    }

});

formEnviar.on('submit', function(e) { //e de event
    e.preventDefault(); //evita que la persona escriba y haga el posteo pero no recarge la info

    if (txtMensaje.val().trim().length === 0) {
        return;
    }


    // Enviar información
    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        txtMensaje.val('').focus();
        renderizarMensajes(mensaje, true);
        scrollBottom();
    });

    console.log(txtMensaje.val());
});