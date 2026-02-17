var client_name = document.getElementById("client_name");
var client_last_name = document.getElementById("client_last_name");
var client_phone = document.getElementById("client_phone");
var property_address = document.getElementById("address");
var property_value = document.getElementById("property_value");
var property_tasa = document.getElementById("property_tasa");
var ltv_value = document.getElementById("ltv_value");
var gastos_cierre = document.getElementById("gastos_cierre");
var property_deudas = document.getElementById("deudas");
var interes_estimado = document.getElementById("interes_estimado");
var property_register_btn = document.getElementById("property_register");
var detalle_llamada = document.getElementById("call_detail");
var prepayment_penalty = document.getElementById("prepayment_penalty");
var mortgage = document.getElementById("mortgage");
var loan_amount = document.getElementById("loan_amount");

var address_label = document.getElementById("address_label");
var property_value_label = document.getElementById("property_value_label");
var tasa_label = document.getElementById("tasa_label");
var client_name_label = document.getElementById("client_name_label");
var client_last_name_label = document.getElementById("client_last_name_label");
var client_phone_label = document.getElementById("client_phone_label");
var close_btn = document.getElementById("close_modal_btn");
var call_detail_label = document.getElementById("call_detail_label");
var ltv_label = document.getElementById("ltv_label");
var prepayment_penalty_label = document.getElementById("prepayment_penalty_label");
var interes_estimado_label = document.getElementById("interes_estimado_label");
var interes_actual_label = document.getElementById("interes_actual_label");
var interes_actual = document.getElementById("interes_actual");
var mortgage_label = document.getElementById("mortgage_label");
var gastos_cierre_label = document.getElementById("gastos_cierre_label");
var loan_amount_label = document.getElementById("loan_amount_label");
var cashout = document.getElementById("cashout");
var occupancy = document.getElementById("occupancy");
var max_ltv_switch = document.getElementById("max_ltv_switch");
var condiciones_adicionales = document.getElementById("aditional_conditions");

var tabs_options = Array.from(document.querySelector(".tabs-options").querySelectorAll("div"));
var add_new_deuda = document.getElementById("add_new_deuda");
var unsaved_comments = [];
var deudas_adicionales = [];
var save_comment_btn = document.getElementById("btn_save_comment");
var max_ltv_selected = true;
ltv_value.value = 75;
gastos_cierre.value = 8;
prepayment_penalty.value = 3;
loan_amount.disabled = true;
cashout.disabled = true;

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

max_ltv_switch.onchange = function () {
    var value = max_ltv_switch.checked;
    cashout.disabled = value;
    ltv_value.disabled = !value;
    ltv_value.value = value ? 75 : "";
}



save_comment_btn.onclick = function () {
    if (document.getElementById("editor").innerHTML != "" && document.getElementById("editor").innerHTML != null) {
        if (property_register_btn.classList.contains("d-none")) {
            $.ajax({
                type: "POST",
                url: "index.php?c=gestion&a=add_new_comment",
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
    property_value.addEventListener('input', function (event) {
        // 1. Limpieza de caracteres no permitidos (solo números y un punto)
        let value = this.value.replace(/[^0-9.]/g, '');

        // 2. Evitar múltiples puntos decimales
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }

        // Aplicamos la limpieza al input
        this.value = value;

        // 3. Obtener los valores actuales de ambos campos
        // Eliminamos comas si las hubiera por formato
        var monto = parseFloat(this.value.replace(/,/g, ''));
        var porcentaje = parseFloat(ltv_value.value.replace(/,/g, ''));

        // 4. Calcular solo si ambos tienen valores válidos
        if (!isNaN(monto) && !isNaN(porcentaje)) {
            var result = (monto * porcentaje) / 100;
            loan_amount.value = result.toFixed(2);
            max_ltv_switch.checked ? calc_cahsout() : calc_loan_amount();
        } else {
            // Si borras el contenido, el resultado se limpia
            loan_amount.value = "";
        }
    });

    mortgage.addEventListener('keypress', function (event) {
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

        setTimeout(() => {
            max_ltv_switch.checked ? calc_cahsout() : calc_loan_amount();
        }, 0);

    });

    cashout.addEventListener('keypress', function (event) {
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

        setTimeout(() => {
            calc_loan_amount();
        }, 0);

    });

    interes_estimado.addEventListener('keypress', function (event) {
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

    interes_actual.addEventListener('keypress', function (event) {
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
            setTimeout(() => {
                max_ltv_switch.checked ? calc_cahsout() : calc_loan_amount();
            }, 0);
            return true;
        }

        // Bloquear cualquier otra tecla (letras, símbolos, etc.)
        event.preventDefault();
        return false;
    });

    prepayment_penalty.addEventListener('keypress', function (event) {
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
            setTimeout(() => {
                max_ltv_switch.checked ? calc_cahsout() : calc_loan_amount();
            }, 0);
            return true;
        }

        // Bloquear cualquier otra tecla (letras, símbolos, etc.)
        event.preventDefault();
        return false;
    });


    ltv_value.addEventListener('input', function (event) {
        let value = this.value;

        // 1. Limpieza inmediata: solo permitir números y un punto decimal
        // Esto reemplaza cualquier carácter no permitido mientras el usuario escribe
        value = value.replace(/[^0-9.]/g, '');

        // 2. Evitar múltiples puntos decimales
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }

        // 3. Validar el límite de 75
        if (parseFloat(value) > 75) {
            // Si se pasa de 75, recortamos al valor anterior o lo dejamos en 75
            value = '75';
        }

        // Aplicar la limpieza al campo
        this.value = value;

        // 4. Calcular el Loan Amount
        // Aquí ya no necesitas setTimeout porque 'input' lee el valor final
        var monto = parseFloat(property_value.value.replace(/,/g, ''));
        var porcentaje = parseFloat(this.value);

        if (!isNaN(monto) && !isNaN(porcentaje)) {
            var result = (monto * porcentaje) / 100;
            loan_amount.value = result.toFixed(2);
            calc_cahsout();
        } else {
            // Si el campo queda vacío al borrar todo, limpiamos el resultado
            loan_amount.value = "";
        }
    });
}


document.getElementById("hidden_calcs").onclick = function(){
    console.log("calculo oculto");
    if (max_ltv_switch.checked){
        calc_cahsout();
    }
    else{
        calc_loan_amount();
    }
    updateInfo(false);
}



function info_validation() {
    var can_register = false;
    if (client_name.value == "" || client_name.value == null) {
        client_name.focus();
        client_name_label.style.color = "red";
    }
    else {
        client_name_label.style.color = "black";
        if (client_last_name.value == "" || client_last_name.value == null) {
            client_last_name.focus();
            client_last_name_label.style.color = "red";
        }
        else {
            client_last_name_label.style.color = "black";
            if (client_phone.value == "" || client_phone.value == null) {
                client_phone.focus();
                client_phone_label.style.color = "red";
            }
            else {
                client_phone_label.style.color = "black";

                if (call_detail.value == "" || call_detail.value == null) {
                    call_detail.focus();
                    call_detail_label.style.color = "red";
                }
                else {
                    call_detail_label.style.color = "black";
                    if (property_address.value == "" || property_address.value == null) {
                        property_address.focus();
                        address_label.style.color = "red";
                    }
                    else {
                        address_label.style.color = "black";
                        if (property_value.value == "" || property_value.value == null) {
                            property_value.focus();
                            property_value_label.style.color = "red";
                        }
                        else {
                            property_value_label.style.color = "black";
                            if (interes_actual.value == "" || interes_actual.value == null) {
                                interes_actual.focus();
                                interes_acutal_label.style.color = "red";
                            }
                            else {
                                interes_actual_label.style.color = "black";
                                can_register = true;
                            }
                        }
                    }

                }

            }
        }
    }
    return can_register;
}


property_register_btn.onclick = function () {
    if (!info_validation()) return;
    var deudas_info = Array.from(document.querySelectorAll(".deudas-info-data"));
    deudas_info.forEach((item) => {
        var deuda_description = Array.from(item.querySelectorAll("span"))[0].innerHTML;
        var deuda_monto = Array.from(item.querySelectorAll("span"))[1].innerHTML;
        var info = {
            "descripcion": deuda_description,
            "monto": deuda_monto
        }
        deudas_adicionales.push(info);
    })

    registerInfo();
}



function registerInfo() {
    $.ajax({
        type: "POST",
        url: "index.php?c=boards&a=add_gestion",
        data: {
            "client_name": client_name.value,
            "client_last_name": client_last_name.value,
            "client_phone": client_phone.value,
            "call_detail": detalle_llamada.value,
            "property_address": property_address.value,
            "property_value": property_value.value,
            "interes_actual": interes_actual.value,
            "mortgage": mortgage.value,
            "occupancy": occupancy.value,
            "deudas_adicionales": deudas_adicionales,
            "comments": unsaved_comments,
            "board": document.getElementById("board_id").innerHTML,
            "ltv": ltv_value.value,
            "interes_estimado": interes_estimado.value,
            "prepayment_penalty": prepayment_penalty.value,
            "gastos_cierre": gastos_cierre.value,
            "tipo_prestamo": tipo_prestamo.value,
            "condiciones_adicionales": condiciones_adicionales.value,
            "loan_amount": loan_amount.value,
            "cashout": cashout.value
        }
    }).done(function (result) {

        console.log(result);
        location.href = "index.php?c=boards&a=detail&info=" + document.getElementById("board_id").innerHTML;
    })
}


function updateInfo(reload) {
    console.log("modificando info")
    $.ajax({
        type: "POST",
        url: "index.php?c=boards&a=update_gestion_info",
        data: {
            "client_name": client_name.value,
            "client_last_name": client_last_name.value,
            "client_phone": client_phone.value,
            "call_detail": detalle_llamada.value,
            "property_address": property_address.value,
            "property_value": property_value.value,
            "interes_actual": interes_actual.value,
            "mortgage": mortgage.value,
            "occupancy": occupancy.value,
            "board": document.getElementById("board_id").innerHTML,
            "ltv": ltv_value.value,
            "interes_estimado": interes_estimado.value,
            "prepayment_penalty": prepayment_penalty.value,
            "gastos_cierre": gastos_cierre.value,
            "tipo_prestamo": tipo_prestamo.value,
            "condiciones_adicionales": condiciones_adicionales.value,
            "loan_amount": loan_amount.value,
            "cashout": cashout.value,
            "gestion_id": document.getElementById("modal_id_gestion").innerHTML
        }
    }).done(function (result) {

        console.log(result);
        if(!reload) return;
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
        if (input_content.readOnly == true && input_content.id != "loan_amount") {
            input_content.readOnly = false;
            input_content.classList.remove("readOnlied");
        }
    })

    document.getElementById("call_detail").value = "";
    document.querySelector(".comments-area").innerHTML = "";
    document.querySelector(".historial-container").innerHTML="";
    document.getElementById("deudas_data").innerHTML = "";
    document.getElementById("modal_gestion_title").innerHTML = "Nueva gestión";
    setTimeout(() => { document.getElementById("layoutSidenav").classList.remove("opacity-body"); ltv_value.value = 75; gastos_cierre.value = 8; prepayment_penalty.value = 3; }, 600)
}


if (document.getElementById("property_update")) {
    document.getElementById("property_update").onclick = function () {
        if (!info_validation()) return;
        
        updateInfo(true);
    }
}


property_value.maxLength = 20;
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

add_new_deuda.onclick = function () {
    var container = document.getElementById("deudas_fields");
    var div = document.createElement("div");
    div.className = "w-100 py-1 px-2 d-flex flex-row justify-content-between";
    div.style.borderBottom = "1px solid black";
    var input_description = document.createElement("input");
    input_description.placeholder = "Descripcion de la deuda";
    var input_amount = document.createElement("input");
    input_amount.placeholder = "Monto de la deuda";
    input_description.className = input_amount.className = "form-control";
    input_amount.style.width = input_description.style.width = "40%";
    var btn_deny = document.createElement("button");
    var btn_aply = document.createElement("button");
    btn_deny.className = btn_aply.className = "btn btn-light";
    btn_deny.innerHTML = "X";
    btn_aply.innerHTML = "<i class='fas fa-check'></i>";
    div.append(input_description, input_amount, btn_deny, btn_aply);
    btn_deny.onclick = function () {
        container.removeChild(div);
    }
    btn_aply.onclick = function () {
        if (input_description.value == "" || input_description.value == null) {
            input_description.style.border = "3px red solid";
            input_description.focus();
        }
        else {
            input_description.style.border = "none";
            if (input_amount.value == "" || input_amount.value == null) {
                input_amount.style.border = "3px red solid";
                input_amount.focus();
            }
            else {
                input_amount.style.border = "none";
                var main_container = document.createElement("div");
                main_container.className = "d-flex flex-row justify-content-between w-100 px-4 mx-auto";
                main_container.style.borderBottom = "1px black solid";
                var container_75 = document.createElement("div");
                container_75.className = "w-75 fw-bold deudas-info-data";
                container_75.innerHTML = "<div><span>" + input_description.value + "</span></div><div><i class='fas fa-money-bill'></i> <span>" + input_amount.value + "</span></div>";
                var container_25 = document.createElement("div");
                container_25.className = "w-25 text-end";
                var close_button_25 = document.createElement("button");
                close_button_25.className = "btn btn-light";
                close_button_25.innerHTML = "X";
                container_25.append(close_button_25);
                main_container.append(container_75, container_25);
                document.getElementById("deudas_data").append(main_container);
                container.removeChild(div);
                max_ltv_switch.checked ? calc_cahsout() : calc_loan_amount();
                if (property_register_btn.classList.contains("d-none")) {
                    $.ajax({
                        type: "POST",
                        url: "index.php?c=gestion&a=add_new_deuda",
                        data: {
                            "id_gestion": document.getElementById("modal_id_gestion").innerHTML,
                            "descripcion": input_description.value,
                            "amount": input_amount.value
                        }
                    }).done(function (result) {
                        close_button_25.id = result;
                    });
                }


                close_button_25.onclick = function () {
                    if (property_register_btn.classList.contains("d-none")) {
                        $.ajax({
                            type: "POST",
                            url: "index.php?c=gestion&a=delete_deuda",
                            data: {
                                "id_deuda": close_button_25.id,
                                "id_gestion": document.getElementById("modal_id_gestion").innerHTML
                            }
                        }).done(function (result) {
                            console.log(result);
                        });
                    }
                    document.getElementById("deudas_data").removeChild(main_container);
                    max_ltv_switch.checked ? calc_cahsout() : calc_loan_amount();
                }
            }
        }
    }
    container.append(div);
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

function calc_all_deudas() {

    const safeParse = (input) => {
        if (!input || !input.value) return 0;
        const cleanValue = input.value.replace(/,/g, '').trim();
        const parsed = parseFloat(cleanValue);
        return isNaN(parsed) ? 0 : parsed;
    };

    var mortgage_total = safeParse(mortgage);
    var prepayment_penalty_total = safeParse(prepayment_penalty);

    var val_loan = max_ltv_switch.checked ? safeParse(loan_amount) : 0;
    var val_gastos = safeParse(gastos_cierre);
    var gastos_cierre_total = max_ltv_switch.checked ? (val_loan * val_gastos) / 100 : 0;
    prepayment_penalty_total = (mortgage_total * prepayment_penalty_total) / 100

    var deudas_adicionales_total = 0;
    var deudas_info = Array.from(document.querySelectorAll(".deudas-info-data"));

    deudas_info.forEach((item) => {
        var span = item.querySelectorAll("span")[1];
        if (span) {
            // Limpiamos el texto del span igual que los inputs
            var deuda_monto = parseFloat(span.innerHTML.replace(/,/g, '').trim());
            deudas_adicionales_total += isNaN(deuda_monto) ? 0 : deuda_monto;
        }
    });

    const total = mortgage_total + prepayment_penalty_total + gastos_cierre_total + deudas_adicionales_total;

    console.log({
        mortgage: mortgage_total,
        penalty: prepayment_penalty_total,
        gastos: gastos_cierre_total,
        adicionales: deudas_adicionales_total,
        final: total
    });

    return total;
}

function calc_cahsout() {
    if (max_ltv_switch.checked == false) return;
    var deudas = calc_all_deudas();
    var loan_amount_value = isNaN(loan_amount.value) ? 0 : parseFloat(loan_amount.value);
    cashout.value = isNaN(loan_amount_value - deudas) ? "" : loan_amount_value - deudas;
}


function calc_loan_amount() {
    if (max_ltv_switch.checked) return;
    var deudas = calc_all_deudas();
    var cashout_total = isNaN(cashout.value) ? 0 : parseFloat(cashout.value);
    var property_value_total = isNaN(property_value.value) ? 0 : parseFloat(property_value.value);
    var gastos_cierre_total = (deudas + parseFloat(cashout_total)) * (parseFloat(gastos_cierre.value) / 100);
    console.log(deudas, cashout_total, gastos_cierre_total);
    loan_amount.value = isNaN(parseFloat(deudas) + parseFloat(cashout_total) + parseFloat(gastos_cierre_total)) ? 0 : parseFloat(deudas) + parseFloat(cashout_total) + parseFloat(gastos_cierre_total);
    ltv_value.value = isNaN((parseFloat(loan_amount.value) / property_value_total) * 100) ? "" : (parseFloat(loan_amount.value) / property_value_total) * 100;

}