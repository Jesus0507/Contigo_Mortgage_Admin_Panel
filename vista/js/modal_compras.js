var client_name = document.getElementById("client_name");
var client_last_name = document.getElementById("client_last_name");
var client_phone = document.getElementById("client_phone");
var detalle_llamada = document.getElementById("call_detail");
var tipo_proceso = document.getElementById("process_type");
var estatus_legal = document.getElementById("estatus_legal");
var primer_comprador = document.getElementById("primer_comprador");
var forma_pago = document.getElementById("forma_pago");
var tiempo_pago = document.getElementById("tiempo_pago");
var tiempo_pago_formato = document.getElementById("tiempo_pago_formato");
var disponible_comprar = document.getElementById("disponible_comprar");
var credito_cliente = document.getElementById("credito_cliente");
var interes_ofrecido = document.getElementById("interes_ofrecido");
var gastos_cierre = document.getElementById("gastos_cierre");
var down_payment = document.getElementById("down_payment");
var monto_max = document.getElementById("monto_max");
var conditions = document.getElementById("conditions");


var client_name_label = document.getElementById("client_name_label");
var client_last_name_label = document.getElementById("client_last_name_label");
var client_phone_label = document.getElementById("client_phone_label");
var detalle_llamada_label = document.getElementById("call_detail_label");
var tipo_proceso_label = document.getElementById("process_type_label");
var estatus_legal_label = document.getElementById("estatus_legal_label");
var primer_comprador_label = document.getElementById("primer_comprador_label");
var forma_pago_label = document.getElementById("forma_pago_label");
var tiempo_pago_electronico_label = document.getElementById("tiempo_pago_electronico_label");
var disponible_comprar_label = document.getElementById("disponible_comprar_label");
var credito_cliente_label = document.getElementById("credito_cliente_label");
var interes_ofrecido_label = document.getElementById("interes_ofrecido_label");
var gastos_cierre_label = document.getElementById("gastos_cierre_label");
var down_payment_label = document.getElementById("down_payment_label");
var monto_max_label = document.getElementById("monto_max_label");
var conditions_label = document.getElementById("conditions_label");

var property_register_btn = document.getElementById("property_register");



var tabs_options = Array.from(document.querySelector(".tabs-options").querySelectorAll("div"));
var unsaved_comments = [];
var save_comment_btn = document.getElementById("btn_save_comment");

fields_validation();


document.getElementById("gestion_tab").onclick = function () {
    document.getElementById("gestion_tab").classList.add("active");
    document.getElementById("seguimiento_tab").classList.remove("active");
    document.getElementById("gestion_container").classList.remove("d-none");
    document.getElementById("seguimiento_container").classList.add("d-none");

}

document.getElementById("seguimiento_tab").onclick = function () {
    document.getElementById("seguimiento_tab").classList.add("active");
    document.getElementById("gestion_tab").classList.remove("active");
    document.getElementById("seguimiento_container").classList.remove("d-none");
    document.getElementById("gestion_container").classList.add("d-none");

}



save_comment_btn.onclick = function () {
    if (document.getElementById("editor").innerHTML != "" && document.getElementById("editor").innerHTML != null) {
        if (property_register_btn.classList.contains("d-none")) {
            console.log(document.getElementById("modal_id_gestion").innerHTML);
            $.ajax({
                type: "POST",
                url: "index.php?c=compra&a=add_new_comment",
                data: {
                    "id_gestion": document.getElementById("modal_id_gestion").innerHTML,
                    "contenido": document.getElementById("editor").innerHTML
                }
            }).done(function (result) {
                console.log(result);
            });
        }
        else {
            unsaved_comments.push(document.getElementById("editor").innerHTML);
        }
        var iniciales = document.getElementById("hidden_user_name").innerHTML.split(" ");
        iniciales = iniciales[0][0].toUpperCase() + iniciales[1][0].toUpperCase();
        var new_comment_div = document.createElement("div");
        new_comment_div.className = "d-flex flex-row w-100 px-3 my-4";
        new_comment_div.innerHTML = "<div class='comment-picture'>" + iniciales + "</div>";
        new_comment_div.innerHTML += "<div class='mx-3'><div class='comments-name'>" + document.getElementById("hidden_user_name").innerHTML + "</div><div class='comments-date'>" + tiempoRelativo(new Date()) + "</div><div class='comments-comment'>" + document.getElementById("editor").innerHTML + "</div></div></div>";
        document.querySelector(".comments-area").append(new_comment_div);
        document.getElementById("btn_cancel_comment").click();
    }
}

tabs_options.forEach((opt) => {
    opt.onclick = function () {
        if (opt == tabs_options[0]) {
            tabs_options[1].classList.remove("selected-div");
            tabs_options[0].classList.add("selected-div");
            document.querySelector(".notes-container").classList.remove("d-none");
            document.querySelector(".historial-container").classList.add("d-none");

        }
        else {
            tabs_options[0].classList.remove("selected-div");
            tabs_options[1].classList.add("selected-div");
            document.querySelector(".notes-container").classList.add("d-none");
            document.querySelector(".historial-container").classList.remove("d-none");
        }
    }
})


function fields_validation() {
    client_name.maxLength = 15;
    gastos_cierre.value = 8;
    document.getElementById("total_requerido").readOnly = true;
    document.getElementById("total_requerido").disabled = true;

    client_name.addEventListener('keypress', function (event) {
        const regex = /^[a-zA-Z]+$/;
        let key = String.fromCharCode(event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    });

    client_last_name.maxLength = 15;
    client_last_name.addEventListener('keypress', function (event) {
        const regex = /^[a-zA-Z]+$/;
        let key = String.fromCharCode(event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    });
    client_phone.maxLength = 16;
    client_phone.addEventListener('keypress', function (event) {
        const key = event.key;
        const currentLength = this.value.length;
        if (/[0-9]/.test(key)) {
            return true;
        }
        if (key === '+' && currentLength === 0) {
            return true;
        }
        event.preventDefault();
        return false;
    });

    disponible_comprar.addEventListener('keypress', function (event) {
        const regex = /^[0-9.]+$/;
        let key = String.fromCharCode(!event.charCode ? event.which : event.charCode);

        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
        if (key === '.' && this.value.includes('.')) {
            event.preventDefault();
            return false;
        }

        get_tiempo_requerido();
    });

    monto_max.addEventListener('keypress', function (event) {
        const regex = /^[0-9.]+$/;
        let key = String.fromCharCode(!event.charCode ? event.which : event.charCode);

        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
        if (key === '.' && this.value.includes('.')) {
            event.preventDefault();
            return false;
        }

        // El truco del almendruco:
        setTimeout(() => {
            get_tiempo_requerido();
        }, 0);
    });

    down_payment.addEventListener('keypress', function (event) {
        const key = event.key;
        const currentValue = this.value;

        // 1. Construir cómo quedaría el texto si permitimos la tecla
        // Obtenemos la posición del cursor para insertar la tecla correctamente
        const selectionStart = this.selectionStart;
        const selectionEnd = this.selectionEnd;
        const futureValue = currentValue.slice(0, selectionStart) + key + currentValue.slice(selectionEnd);

        // 2. Permitir números y un solo punto decimal
        if (/[0-9]/.test(key) || (key === '.' && !currentValue.includes('.'))) {

            // 3. Validar el límite de 100
            // Si el valor futuro es un número válido, comprobamos que no exceda 100
            if (!isNaN(futureValue) && parseFloat(futureValue) > 100) {
                event.preventDefault();
                return false;
            }
            get_tiempo_requerido()
            return true;
        }

        // Bloquear cualquier otra tecla (letras, símbolos, etc.)
        event.preventDefault();
        return false;
    });

    gastos_cierre.addEventListener('keypress', function (event) {
        const key = event.key;
        const currentValue = this.value;

        // 1. Construir cómo quedaría el texto si permitimos la tecla
        // Obtenemos la posición del cursor para insertar la tecla correctamente
        const selectionStart = this.selectionStart;
        const selectionEnd = this.selectionEnd;
        const futureValue = currentValue.slice(0, selectionStart) + key + currentValue.slice(selectionEnd);

        // 2. Permitir números y un solo punto decimal
        if (/[0-9]/.test(key) || (key === '.' && !currentValue.includes('.'))) {

            // 3. Validar el límite de 100
            // Si el valor futuro es un número válido, comprobamos que no exceda 100
            if (!isNaN(futureValue) && parseFloat(futureValue) > 100) {
                event.preventDefault();
                return false;
            }
            get_tiempo_requerido();
            return true;
        }

        // Bloquear cualquier otra tecla (letras, símbolos, etc.)
        event.preventDefault();
        return false;
    });
    credito_cliente.addEventListener('keypress', function (event) {
        const regex = /^[0-9.]+$/;
        let key = String.fromCharCode(!event.charCode ? event.which : event.charCode);

        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
        if (key === '.' && this.value.includes('.')) {
            event.preventDefault();
            return false;
        }

    });

    interes_ofrecido.addEventListener('keypress', function (event) {
        const key = event.key;
        const currentValue = this.value;

        // 1. Construir cómo quedaría el texto si permitimos la tecla
        // Obtenemos la posición del cursor para insertar la tecla correctamente
        const selectionStart = this.selectionStart;
        const selectionEnd = this.selectionEnd;
        const futureValue = currentValue.slice(0, selectionStart) + key + currentValue.slice(selectionEnd);

        // 2. Permitir números y un solo punto decimal
        if (/[0-9]/.test(key) || (key === '.' && !currentValue.includes('.'))) {

            // 3. Validar el límite de 100
            // Si el valor futuro es un número válido, comprobamos que no exceda 100
            if (!isNaN(futureValue) && parseFloat(futureValue) > 100) {
                event.preventDefault();
                return false;
            }

            return true;
        }

        // Bloquear cualquier otra tecla (letras, símbolos, etc.)
        event.preventDefault();
        return false;
    });

    tiempo_pago_formato.onchange = function () {
        get_down_payment();
    }


    tipo_proceso.onchange = function () {
        if (tipo_proceso.value == "non_qm") {
            estatus_legal.parentElement.classList.remove("d-none");
            tipo_proceso.parentElement.classList.remove("w-100");
            tipo_proceso.parentElement.style.width = "45%";
            estatus_legal.parentElement.style.width = "45%";
        }
        else {
            estatus_legal.parentElement.classList.add("d-none");
            tipo_proceso.parentElement.style.width = "100%";
        }
        get_down_payment();
    }



    forma_pago.onchange = function () {
        // Apuntamos al parentElement del parentElement para ocultar el div contenedor con el label
        if (forma_pago.value != "medio_electronico") {
            tiempo_pago.parentElement.parentElement.parentElement.classList.add("d-none");
            forma_pago.parentElement.style.width = "100%";
        }
        else {
            tiempo_pago.parentElement.parentElement.parentElement.classList.remove("d-none");
            forma_pago.parentElement.style.width = "45%";
        }
        get_down_payment();
    }

    primer_comprador.onchange = function () {
        if (primer_comprador.value == "no") {
            forma_pago.parentElement.parentElement.classList.add("d-none");
        }
        else {
            forma_pago.parentElement.parentElement.classList.remove("d-none");
        }
    }

    // Impedir que se escriban puntos, comas o signos en el campo de cantidad
    tiempo_pago.addEventListener('keypress', function (event) {
        const key = event.key;

        // Solo permitir números del 0 al 9
        if (!/[0-9]/.test(key)) {
            event.preventDefault();
            return false;
        }

        // Usamos setTimeout 0 para esperar a que el valor se actualice en el input
        setTimeout(() => {
            get_down_payment();
        }, 0);
    });-+
 
    // Evitar que peguen texto o decimales con el click derecho
    tiempo_pago.addEventListener('paste', function (event) {
        let paste = (event.clipboardData || window.clipboardData).getData('text');
        if (!/^\d+$/.test(paste)) {
            event.preventDefault();
        }
        get_down_payment();
    });

    estatus_legal.onchange = function () {
        get_down_payment();
    }
}


property_register_btn.onclick = function () {
    if (!info_validation()) return;
    registerInfo();
}



function registerInfo() {
    $.ajax({
        type: "POST",
        url: "index.php?c=boards&a=add_compra",
        data: {
            "client_name": client_name.value,
            "client_last_name": client_last_name.value,
            "client_phone": client_phone.value,
            "call_detail": detalle_llamada.value,
            "tipo_proceso": tipo_proceso.value,
            "estatus_legal": tipo_proceso.value == "non_qm" ? estatus_legal.value : null,
            "primer_comprador": primer_comprador.value,
            "forma_pago": forma_pago.value,
            "tiempo_pago_electronico": forma_pago.value == "medio_electronico" ? (tiempo_pago.value + " " + tiempo_pago_formato.value) : null,
            "disponibilidad_comprar": disponible_comprar.value,
            "credito_cliente": credito_cliente.value,
            "interes_ofrecido": interes_ofrecido.value,
            "gastos_cierre": gastos_cierre.value,
            "down_payment": down_payment.value,
            "monto_max": monto_max.value,
            "condiciones": conditions.value,
            "total_requerido": document.getElementById("total_requerido").value,
            "comments": unsaved_comments,
            "board": document.getElementById("board_id").innerHTML
        }
    }).done(function (result) {

        console.log(result);
        location.href = "index.php?c=boards&a=detail&info=" + document.getElementById("board_id").innerHTML;
    })
}


close_btn.onclick = function () {
    document.getElementById("property_register").classList.remove("d-none");
    if (document.getElementById("property_update")) document.getElementById("property_update").classList.add("d-none");
    $(".modal-gestion").fadeOut();
    var all_inputs = document.querySelector(".modal-gestion").querySelectorAll("input");
    Array.from(all_inputs).forEach((input_content) => {
        input_content.value = "";
    })

    document.getElementById("call_detail").value = "";
    document.querySelector(".comments-area").innerHTML = "";
    document.querySelector(".historial-container").innerHTML = "";
    document.getElementById("modal_gestion_title").innerHTML = "Nueva compra";
    gastos_cierre.value = 8;
    setTimeout(() => { document.getElementById("layoutSidenav").classList.remove("opacity-body"); }, 600)
}



if (document.getElementById("property_update")) {
    document.getElementById("property_update").onclick = function () {
        if (!info_validation()) return;

        updateInfo(true);
    }
}

function updateInfo(reload) {
    console.log("modificando info")
    $.ajax({
        type: "POST",
        url: "index.php?c=boards&a=update_compra_info",
        data: {
            "client_name": client_name.value,
            "client_last_name": client_last_name.value,
            "client_phone": client_phone.value,
            "call_detail": detalle_llamada.value,
            "tipo_proceso": tipo_proceso.value,
            "estatus_legal": tipo_proceso.value == "non_qm" ? estatus_legal.value : null,
            "primer_comprador": primer_comprador.value,
            "forma_pago": forma_pago.value,
            "tiempo_pago_electronico": forma_pago.value == "medio_electronico" ? (tiempo_pago.value + " " + tiempo_pago_formato.value) : null,
            "disponibilidad_comprar": disponible_comprar.value,
            "credito_cliente": credito_cliente.value,
            "interes_ofrecido": interes_ofrecido.value,
            "gastos_cierre": gastos_cierre.value,
            "down_payment": down_payment.value,
            "monto_max": monto_max.value,
            "condiciones": conditions.value,
            "total_requerido": document.getElementById("total_requerido").value,
            "board": document.getElementById("board_id").innerHTML,
            "gestion_id": document.getElementById("modal_id_gestion").innerHTML
        }
    }).done(function (result) {

        console.log(result);
        if (!reload) return;
        location.href = "index.php?c=boards&a=detail&info=" + document.getElementById("board_id").innerHTML;
    })
}


function info_validation() {
    // Función auxiliar para saber si un elemento está oculto por Bootstrap (d-none)
    // o por sus padres.
    const isVisible = (el) => {
        return !el.closest('.d-none'); 
    };

    // Validar Nombre
    if (client_name.value === "" || client_name.value == null) {
        client_name.focus();
        client_name_label.style.color = "red";
        return false;
    }
    client_name_label.style.color = "black";

    // Validar Apellido
    if (client_last_name.value === "" || client_last_name.value == null) {
        client_last_name.focus();
        client_last_name_label.style.color = "red";
        return false;
    }
    client_last_name_label.style.color = "black";

    // Validar Teléfono
    if (client_phone.value === "" || client_phone.value == null) {
        client_phone.focus();
        client_phone_label.style.color = "red";
        return false;
    }
    client_phone_label.style.color = "black";

    // Validar Detalle de llamada
    if (detalle_llamada.value === "" || detalle_llamada.value == null) {
        detalle_llamada.focus();
        detalle_llamada_label.style.color = "red";
        return false;
    }
    detalle_llamada_label.style.color = "black";

    // --- VALIDACIÓN CONDICIONAL: Estatus Legal ---
    // Solo valida si el contenedor de estatus_legal NO tiene la clase d-none
    if (isVisible(estatus_legal)) {
        if (estatus_legal.value === "" || estatus_legal.value == null) {
            estatus_legal.focus();
            estatus_legal_label.style.color = "red";
            return false;
        }
    }
    if (estatus_legal_label) estatus_legal_label.style.color = "black";

    // --- VALIDACIÓN CONDICIONAL: Tiempo de Pago ---
    if (isVisible(tiempo_pago)) {
        if (tiempo_pago.value === "" || tiempo_pago.value == null) {
            tiempo_pago.focus();
            tiempo_pago_electronico_label.style.color = "red";
            return false;
        }
    }
    tiempo_pago_electronico_label.style.color = "black";

    // Validar Disponibilidad
    if (disponible_comprar.value === "" || disponible_comprar.value == null) {
        disponible_comprar.focus();
        disponible_comprar_label.style.color = "red";
        return false;
    }
    disponible_comprar_label.style.color = "black";

    // Si llegó hasta aquí, todo lo visible es válido
    return true;
}

const editor = document.getElementById('editor');
const linkMenu = document.getElementById('link-menu');
let savedSelection = null;

// 1. APLICAR FORMATO BÁSICO
function applyFormat(command) {
    editor.focus();
    document.execCommand(command, false, null);
    setTimeout(updateToolbar, 10);
}

// 2. CONTROL DEL COLOR
function applyColor(color) {
    editor.focus();
    document.execCommand('foreColor', false, color);
}

// 3. LÓGICA DEL MENÚ DE ENLACES
function toggleLinkMenu() {
    const isVisible = linkMenu.style.display === 'block';

    if (!isVisible) {
        saveSelection(); // Guardamos donde estaba el usuario

        // Si había algo seleccionado, lo ponemos en el campo de texto
        const selectedText = savedSelection ? savedSelection.toString().trim() : "";
        document.getElementById('link-text').value = selectedText;

        linkMenu.style.display = 'block';
        document.getElementById('link-url').focus();
    } else {
        closeLinkMenu();
    }
}

function saveSelection() {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
        savedSelection = sel.getRangeAt(0).cloneRange();
    } else {
        savedSelection = null;
    }
}

function confirmLink() {
    const url = document.getElementById('link-url').value;
    const text = document.getElementById('link-text').value;

    if (url) {
        const sel = window.getSelection();
        sel.removeAllRanges();

        // VALIDACIÓN CRÍTICA: Si no hay selección guardada, creamos una nueva
        if (savedSelection) {
            sel.addRange(savedSelection);
        } else {
            const range = document.createRange();
            range.selectNodeContents(editor);
            range.collapse(false); // Pone el cursor al final
            sel.addRange(range);
            savedSelection = range;
        }

        if (savedSelection.toString().length > 0) {
            document.execCommand("createLink", false, url);
            const parent = window.getSelection().anchorNode.parentElement;
            if (parent.tagName === 'A') parent.target = "_blank";
        } else {
            const display = text ? text : url;
            const html = `<a href="${url}" target="_blank" style="color: #00aaff; text-decoration: underline;">${display}</a>`;
            document.execCommand("insertHTML", false, html);
        }
    }

    closeLinkMenu();
    editor.focus(); // Devolvemos el foco al editor
}

function closeLinkMenu() {
    linkMenu.style.display = 'none';
    document.getElementById('link-url').value = '';
    document.getElementById('link-text').value = '';
}

// 4. ACTUALIZACIÓN VISUAL DE LA BARRA
function updateToolbar() {
    const buttons = document.querySelectorAll('.toolbar-btn[onclick^="applyFormat"]');
    buttons.forEach(btn => {
        const commandMatch = btn.getAttribute('onclick').match(/'([^']+)'/);
        if (commandMatch) {
            const command = commandMatch[1];
            try {
                if (document.queryCommandState(command)) btn.classList.add('active');
                else btn.classList.remove('active');
            } catch (e) { }
        }
    });
}

// 5. EVENTOS
editor.addEventListener('keyup', updateToolbar);
editor.addEventListener('mouseup', updateToolbar);
editor.addEventListener('click', updateToolbar);

// Cerrar con Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLinkMenu();
});

// Cerrar al hacer clic fuera
document.addEventListener('mousedown', (e) => {
    const container = document.querySelector('.comment-container');
    if (container && !container.contains(e.target)) {
        closeLinkMenu();
    }
});

document.querySelector(".fake-comments-div").onclick = function () {
    document.querySelector(".fake-comments-div").classList.add("d-none");
    document.querySelector(".comment-container").classList.remove("d-none");
    document.getElementById("editor").focus();
}


document.getElementById("btn_cancel_comment").onclick = function () {
    document.querySelector(".fake-comments-div").classList.remove("d-none");
    document.querySelector(".comment-container").classList.add("d-none");
    document.getElementById("editor").innerHTML = "";
}


function calcularTiempoTranscurrido(fechaString) {
    const fechaDada = new Date(fechaString);
    const ahora = new Date();

    const diferenciaMs = ahora - fechaDada;


    const segundos = Math.floor(diferenciaMs / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    const semanas = Math.floor(dias / 7);


    const meses = Math.floor(dias / 30.44);
    const años = Math.floor(dias / 365.25);

    return { segundos, minutos, horas, dias, semanas, meses, años };
}

function tiempoRelativo(fechaString) {
    const r = calcularTiempoTranscurrido(fechaString);

    if (r.segundos < 60) return `Hace ${r.segundos} segundos`;
    if (r.minutos < 60) return `Hace ${r.minutos} minutos`;
    if (r.horas < 24) return `Hace ${r.horas} horas`;
    if (r.dias < 30) return `Hace ${r.dias} días`;
    return `Hace ${r.meses} meses`;
}



function get_down_payment() {
    var tiempo = (tiempo_pago.value + " " + tiempo_pago_formato.value);
    var is_estatus_visible = estatus_legal.parentElement.classList.contains("d-none") ? false : true;
    if ((tiempo == "12 meses" || tiempo == "1 anio") && is_estatus_visible == true && (estatus_legal.value == "ciudadano" || estatus_legal.value == "residente" || estatus_legal.value == "permiso_trabajo")) {
        down_payment.value = 20;
    }
    else {
        down_payment.value = "";
    }
    get_tiempo_requerido()
}

function get_tiempo_requerido() {
    var down_payment_val = down_payment.value == "" ? 0 : parseFloat(down_payment.value);
    var gastos_cierre_val = gastos_cierre.value == "" ? 0 : parseFloat(gastos_cierre.value);
    var monto_max_val = monto_max.value == "" ? 0 : parseFloat(monto_max.value);

    // console.log("down_payment:", down_payment_val);
    // console.log("gastos_cierre:", gastos_cierre_val);
    // console.log("monto max:", monto_max_val);


    var total_requerido_val = ((monto_max_val * down_payment_val) / 100) + ((monto_max_val * gastos_cierre_val) / 100);
    // console.log("total:", total_requerido_val);
    if (total_requerido_val <= 0) {
        document.getElementById("total_requerido").value = "";
        return
    };
    document.getElementById("total_requerido").value = total_requerido_val;
}