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
var primer_comprador_field = document.querySelector(".primer-comprador-field");
var forma_pago_container = document.querySelector(".forma-pago-container");



var tabs_options = Array.from(document.querySelector(".tabs-options").querySelectorAll("div"));
var unsaved_comments = [];
var save_comment_btn = document.getElementById("btn_save_comment");

fields_validation();


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
    client_phone.maxLength = 14; // (000) 000-0000 tiene 14 caracteres
    client_phone.addEventListener('input', function (e) {
        // 1. Eliminar todo lo que no sea número
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);

        // 2. Construir el formato dinámicamente
        // x[1] es el área, x[2] el prefijo, x[3] el número
        e.target.value = !x[2]
            ? x[1]
            : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });
    // Bloquear teclas que no sean números (opcional, por seguridad extra)
    client_phone.addEventListener('keypress', function (event) {
        if (!/[0-9]/.test(event.key)) {
            event.preventDefault();
        }
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


    tipo_proceso.onchange = checkFlowVisibility;
    primer_comprador.onchange = checkFlowVisibility;
    forma_pago.onchange = checkFlowVisibility;

    // Ejecución inicial por si vienen datos de BD
    checkFlowVisibility();

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
    }); -+

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

function checkFlowVisibility() {
    const proceso = tipo_proceso.value;
    const esPrimerComprador = primer_comprador.value === "si";
    const metodoPago = forma_pago.value;

    // 1. Lógica para Campo Primer Comprador
    // Según tu diagrama: siempre visible si hay un proceso seleccionado
    if (proceso !== "") {
        primer_comprador_field.classList.remove("d-none");
    } else {
        primer_comprador_field.classList.add("d-none");
        resetField(primer_comprador); // Limpia valor si se oculta
    }

    // 2. Lógica para Forma de Pago
    // Según diagrama: No visible si es "income check". 
    // Visible solo si NO es "income check" Y es "primer comprador"
    if (proceso !== "" && proceso !== "income_check" && esPrimerComprador) {
        forma_pago_container.classList.remove("d-none");
    } else {
        forma_pago_container.classList.add("d-none");
        resetField(forma_pago);
    }

    // 3. Lógica para Tiempo Pagando
    // Según diagrama: Visible solo si forma de pago es "medio electrónico"
    const tiempoPagoContainer = tiempo_pago.parentElement.parentElement.parentElement;

    if (!forma_pago_container.classList.contains("d-none") && metodoPago === "medio_electronico") {
        tiempoPagoContainer.classList.remove("d-none");
        forma_pago.parentElement.style.width = "45%";
    } else {
        tiempoPagoContainer.classList.add("d-none");
        forma_pago.parentElement.style.width = "100%";
        resetField(tiempo_pago);
    }

    // Ejecutar lógica de negocio adicional
    get_down_payment();
}

function resetField(element) {
    if (element) element.value = "";
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
    setTimeout(() => {
        document.getElementById("layoutSidenav").classList.remove("opacity-body");
        document.getElementById("asesor_name").innerHTML = "Asesor: " + document.querySelector(".sb-sidenav-footer").innerHTML;
    }, 600)
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
    // Función auxiliar para saber si un elemento está oculto
    const isVisible = (el) => {
        return el && !el.closest('.d-none');
    };

    // --- RESET DE ESTILOS ---
    // Limpiamos todos los labels a negro antes de empezar la nueva validación
    const labels = [
        client_name_label, client_last_name_label, client_phone_label,
        detalle_llamada_label, tipo_proceso_label, estatus_legal_label,
        primer_comprador_label, forma_pago_label, tiempo_pago_electronico_label,
        disponible_comprar_label, credito_cliente_label
    ];
    labels.forEach(label => { if (label) label.style.color = "black"; });

    // --- COLUMNA IZQUIERDA (CLIENTE) ---

    if (client_name.value.trim() === "") {
        client_name.focus();
        client_name_label.style.color = "red";
        return false;
    }

    if (client_last_name.value.trim() === "") {
        client_last_name.focus();
        client_last_name_label.style.color = "red";
        return false;
    }

    if (client_phone.value.length < 14) {
        client_phone.focus();
        client_phone_label.style.color = "red";
        return false;
    }

    if (detalle_llamada.value.trim() === "") {
        detalle_llamada.focus();
        detalle_llamada_label.style.color = "red";
        return false;
    }

    // --- COLUMNA DERECHA (DATOS ADICIONALES) ---

    // 1. Tipo de proceso (Siempre visible según imagen)
    if (tipo_proceso.value === "") {
        tipo_proceso.focus();
        tipo_proceso_label.style.color = "red";
        return false;
    }

    // 2. Estatus Legal (Condicional)
    if (isVisible(estatus_legal)) {
        if (estatus_legal.value === "") {
            estatus_legal.focus();
            estatus_legal_label.style.color = "red";
            return false;
        }
    }

    // 3. ¿Es primer comprador? (Visible si hay tipo de proceso)
    if (isVisible(primer_comprador)) {
        if (primer_comprador.value === "") {
            primer_comprador.focus();
            primer_comprador_label.style.color = "red";
            return false;
        }
    }

    // 4. Forma de pago (Condicional según diagrama)
    if (isVisible(forma_pago)) {
        if (forma_pago.value === "") {
            forma_pago.focus();
            forma_pago_label.style.color = "red";
            return false;
        }
    }

    // 5. Tiempo de Pago (Condicional: Medio Electrónico)
    if (isVisible(tiempo_pago)) {
        if (tiempo_pago.value === "") {
            tiempo_pago.focus();
            tiempo_pago_electronico_label.style.color = "red";
            return false;
        }
    }

    // 6. Disponibilidad para comprar
    if (disponible_comprar.value.trim() === "") {
        disponible_comprar.focus();
        disponible_comprar_label.style.color = "red";
        return false;
    }

    // 7. Crédito cliente (Último campo de la imagen)
    if (credito_cliente.value.trim() === "") {
        credito_cliente.focus();
        credito_cliente_label.style.color = "red";
        return false;
    }

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