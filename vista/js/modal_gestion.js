/* ==========================================================================
   VARIABLES GLOBALES Y SELECCIÓN DE ELEMENTOS
   ========================================================================== */
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
var cashout = document.getElementById("cashout");
var interes_actual = document.getElementById("interes_actual");
var occupancy = document.getElementById("occupancy");
var max_ltv_switch = document.getElementById("max_ltv_switch");
var add_new_deuda = document.getElementById("add_new_deuda");
var save_comment_btn = document.getElementById("btn_save_comment");
var close_btn = document.getElementById("close_modal_btn");
var property_register_btn = document.getElementById("property_register");
var condiciones_adicionales = document.getElementById("aditional_conditions");


var tabs_options = Array.from(document.querySelector(".tabs-options").querySelectorAll("div"));
var unsaved_comments = [];

// Configuración inicial de UI
if (ltv_value) ltv_value.value = 75;
if (gastos_cierre) gastos_cierre.value = 8;
if (loan_amount) loan_amount.disabled = true;
if (cashout) cashout.disabled = true;

/* ==========================================================================
   FUNCIONES DE UTILIDAD, FORMATO Y TIEMPO
   ========================================================================== */

function parseMoneyGestion(value) {
    if (!value) return 0;
    if (typeof value === 'number') return value;
    let cleanValue = value.toString().replace(/\./g, '').replace(',', '.');
    let parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? 0 : parsed;
}

// function parseMoneyGestion(value) {
//     console.log(value);
//     if (!value) return 0;
//     if (typeof value === 'number') return value;
//     let cleanValue = value.toString().replace(/\./g, '').replace(',');
//    // cleanValue = value.toString().replace(/\./g, ',').replace('.');
//     console.log(cleanValue);
//     let parsed = parseFloat(cleanValue);
//     console.log(parsed);
//     return isNaN(parsed) ? 0 : parsed;
// }

function money_format(num) {
    if (isNaN(num)) num = 0;
    return num.toLocaleString('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function applyInputMask(inputElement) {
    let value = inputElement.value.replace(/\D/g, "");
    if (value === "") return;
    let num = parseFloat(value) / 100;
    inputElement.value = money_format(num);
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

/* ==========================================================================
   LÓGICA DE CÁLCULO (SINCRONIZADA)
   ========================================================================== */

function calc_all_deudas() {
    let mortgage_total = parseMoneyGestion(mortgage.value);
    let penalty_perc = parseMoneyGestion(prepayment_penalty.value) / 100;
    let penalty_total = mortgage_total * penalty_perc;
    document.getElementById("prepayment_penalty_percent_value").innerHTML = money_format(penalty_total);

    let deudas_adicionales_total = 0;
    document.querySelectorAll(".deudas-info-data").forEach((item) => {
        let span = item.querySelectorAll("span")[1];
        if (span) {
            deudas_adicionales_total += parseMoneyGestion(span.innerHTML);
        }
    });

    return mortgage_total + penalty_total + deudas_adicionales_total;
}

function run_calculations() {
    let deudas_base = calc_all_deudas();
    let prop_val = parseMoneyGestion(property_value.value);
    let tax_perc = parseMoneyGestion(gastos_cierre.value) / 100;
    document.getElementById("gastos_cierre_percent_value").innerHTML = money_format(tax_perc * prop_val);

    // Seleccionamos los botones
    const botonesAccion = [
        document.getElementById("property_register"),
        document.getElementById("property_update")
    ];

    if (max_ltv_switch.checked) {
        let ltv_perc = parseFloat(ltv_value.value) / 100;
        let total_loan = prop_val * ltv_perc;
        let gastos_total = total_loan * tax_perc;
        let total_cashout = total_loan - deudas_base - gastos_total;
        console.log(total_loan, prop_val, ltv_perc, property_value.value );
        loan_amount.value = money_format(total_loan);
        document.getElementById("ltv_percent_value").innerHTML = money_format(total_loan);
        cashout.value = total_cashout < 0 ? "0,00" : money_format(total_cashout);

        // HABILITACIÓN TOTAL
        botonesAccion.forEach(btn => {
            if (btn) {
                btn.disabled = false;
                btn.style.opacity = "1";
                btn.style.pointerEvents = "auto"; // Permite clics
                btn.style.cursor = "pointer";
            }
        });
        ltv_value.style.color = "black";
        ltv_value.style.fontWeight = "normal";

    } else {
        let desired_cashout = parseMoneyGestion(cashout.value);
        let needed_loan = (deudas_base + desired_cashout) / (1 - tax_perc);
        loan_amount.value = money_format(needed_loan);
        document.getElementById("ltv_percent_value").innerHTML = money_format(needed_loan);

        if (prop_val > 0) {
            let ltv_calculado = (needed_loan / prop_val) * 100;
            ltv_value.value = ltv_calculado.toFixed(2);

            if (ltv_calculado > 75) {
                // BLOQUEO TOTAL
                ltv_value.style.color = "red";
                ltv_value.style.fontWeight = "bold";

                botonesAccion.forEach(btn => {
                    if (btn) {
                        btn.disabled = true;
                        btn.style.opacity = "0.5";
                        btn.style.pointerEvents = "none"; // MATAR EL EVENTO CLICK
                        btn.style.cursor = "not-allowed";
                    }
                });
            } else {
                // RESTAURACIÓN
                ltv_value.style.color = "black";
                ltv_value.style.fontWeight = "normal";

                botonesAccion.forEach(btn => {
                    if (btn) {
                        btn.disabled = false;
                        btn.style.opacity = "1";
                        btn.style.pointerEvents = "auto";
                        btn.style.cursor = "pointer";
                    }
                });
            }
        }
    }
}
/* ==========================================================================
   INTERACCIÓN DE UI (TABS, SWITCH Y MODAL)
   ========================================================================== */

document.getElementById("gestion_tab").onclick = function () {
    this.classList.add("active");
    document.getElementById("seguimiento_tab").classList.remove("active");
    document.getElementById("gestion_container").classList.remove("d-none");
    document.getElementById("seguimiento_container").classList.add("d-none");
};

document.getElementById("seguimiento_tab").onclick = function () {
    console.log("cambiando a seguimiento");
    this.classList.add("active");
    document.getElementById("gestion_tab").classList.remove("active");
    document.getElementById("seguimiento_container").classList.remove("d-none");
    document.getElementById("gestion_container").classList.add("d-none");
};



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

max_ltv_switch.onchange = function () {
    cashout.disabled = this.checked;
    ltv_value.disabled = !this.checked;
    if (this.checked) ltv_value.value = "75";
    run_calculations();
};

if (document.getElementById("property_update")) {
    document.getElementById("property_update").onclick = function () {
        let fields = [client_name, client_last_name, client_phone, detalle_llamada, property_address, property_value, occupancy];
        let isValid = true;
        fields.forEach(f => {
            if (!f.value) { isValid = false; f.style.border = "1px solid red"; }
            else { f.style.border = "1px solid #ced4da"; }
        });

        if (!isValid) return;

        updateInfo(true);
    }
}

close_btn.onclick = function () {
    const isEditing = !document.getElementById("property_update").classList.contains("d-none");
    const isVisible = (el) => el && !el.closest('.d-none');

    // 1. OBTENER TODOS LOS CAMPOS VISIBLES ACTUALMENTE
    const camposVisibles = Array.from(document.querySelectorAll(".modal-gestion input, .modal-gestion select, .modal-gestion textarea"))
        .filter(el => isVisible(el));

    let tieneCambios = false;

    if (isEditing) {
        // --- LÓGICA DE EDICIÓN (Comparar contra old_info) ---
        const old_info_raw = document.getElementById("old_info_gestion").innerHTML;
        if (old_info_raw.trim() !== "") {
            const old = JSON.parse(old_info_raw);
            const hasChanged = (current, original) => {
                let curr = (current || "").toString().trim().toLowerCase();
                let orig = (original || "").toString().trim().toLowerCase();
                return curr !== orig;
            };

            tieneCambios =
                hasChanged(client_name.value, old.name) ||
                hasChanged(client_last_name.value, old.last_name) ||
                hasChanged(client_phone.value, old.phone) ||
                hasChanged(detalle_llamada.value, old.detalle_llamada) ||
                hasChanged(property_address.value, old.property_address) ||
                hasChanged(property_value.value, old.property_value) ||
                hasChanged(mortgage.value, old.mortgage) ||
                hasChanged(ltv_value.value, old.ltv) ||
                hasChanged(occupancy.value, old.occupancy) ||
                hasChanged(tipo_prestamo.value, old.tipo_prestamo) ||
                hasChanged(condiciones_adicionales.value, old.condiciones_adicionales);
        }
    } else {
        // --- LÓGICA DE REGISTRO NUEVO ---
        // Verificamos si alguno de los campos visibles tiene información
        // Excluimos LTV y Gastos de cierre porque suelen tener valores por defecto (75 y 8)
        tieneCambios = camposVisibles.some(el => {
            if (el === ltv_value || el === gastos_cierre) return false;
            return el.value.trim() !== "" && el.value !== "Seleccionar";
        });

        // También verificamos si hay deudas agregadas en el listado visual
        if (document.querySelectorAll(".deudas-info-data").length > 0) tieneCambios = true;
    }

    // 2. SI HAY CAMBIOS O DATOS, PEDIR CONFIRMACIÓN
    if (tieneCambios) {
        Swal.fire({
            title: '¿Cerrar sin guardar?',
            text: "Si realizó cambios y cierra sin guardar estos no serán almacenados en la base de datos.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, salir y borrar',
            cancelButtonText: 'Continuar aquí'
        }).then((result) => {
            if (result.isConfirmed) {
                finalizeClose();
            }
        });
    } else {
        // Si todo está vacío, cerramos directamente
        finalizeClose();
    }
};

/**
 * Función auxiliar para limpiar la UI y cerrar el modal
 */
function finalizeClose() {
    property_register_btn.classList.remove("d-none");
    document.getElementById("property_update").classList.add("d-none");

    $(".modal-gestion").fadeOut();
    document.getElementById("layoutSidenav").classList.remove("opacity-body");

    // Reset total de campos
    document.querySelectorAll(".modal-gestion input, .modal-gestion select, .modal-gestion textarea").forEach(el => {
        el.value = "";
        el.readOnly = false;
        el.classList.remove("readOnlied");
        el.style.border = "1px solid #ced4da";
    });

    // Reset de deudas y estimaciones
    document.getElementById("deudas_data").innerHTML = "";
    document.getElementById("editor").innerHTML = "";
    document.getElementById("gastos_cierre_percent_value").innerHTML = "0,00";
    document.getElementById("ltv_percent_value").innerHTML = "0,00";
    document.getElementById("prepayment_penalty_percent_value").innerHTML = "0,00";

    // Valores por defecto
    ltv_value.value = 75;
    gastos_cierre.value = 8;
}
/* ==========================================================================
   GESTIÓN DE DEUDAS ADICIONALES
   ========================================================================== */

add_new_deuda.onclick = function () {
    var container = document.getElementById("deudas_fields");
    var div = document.createElement("div");
    div.className = "w-100 py-1 px-2 d-flex flex-row justify-content-between border-bottom";

    var input_description = document.createElement("input");
    input_description.placeholder = "Descripcion de la deuda";
    input_description.className = "form-control w-40";

    var input_amount = document.createElement("input");
    input_amount.placeholder = "Monto de la deuda";
    input_amount.className = "form-control w-40 monto-input";
    input_amount.addEventListener('input', function () { applyInputMask(this); });

    var btn_deny = document.createElement("button");
    btn_deny.className = "btn btn-light";
    btn_deny.innerHTML = "X";
    btn_deny.onclick = function () { container.removeChild(div); };

    var btn_aply = document.createElement("button");
    btn_aply.className = "btn btn-light";
    btn_aply.innerHTML = "<i class='fas fa-check'></i>";

    btn_aply.onclick = function () {
        if (input_description.value == "" || input_description.value == null) {
            input_description.style.border = "3px red solid";
            input_description.focus();
            return;
        }
        input_description.style.border = "none";

        if (input_amount.value == "" || input_amount.value == null) {
            input_amount.style.border = "3px red solid";
            input_amount.focus();
            return;
        }
        input_amount.style.border = "none";

        var main_container = document.createElement("div");
        main_container.className = "d-flex flex-row justify-content-between w-100 px-4 mx-auto border-bottom py-2";

        var container_75 = document.createElement("div");
        container_75.className = "w-75 fw-bold deudas-info-data";
        container_75.innerHTML = `<div><span>${input_description.value}</span></div><div><i class='fas fa-money-bill'></i> <span>${input_amount.value}</span></div>`;

        var container_25 = document.createElement("div");
        container_25.className = "w-25 text-end";
        var close_button_25 = document.createElement("button");
        close_button_25.className = "btn btn-light";
        close_button_25.innerHTML = "X";

        close_button_25.onclick = function () {
            if (property_register_btn.classList.contains("d-none")) {
                $.ajax({
                    type: "POST",
                    url: "index.php?c=gestion&a=delete_deuda",
                    data: {
                        "id_deuda": close_button_25.id,
                        "id_gestion": document.getElementById("modal_id_gestion").innerHTML
                    }
                });
            }
            main_container.remove();
            run_calculations();
        };

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

        container_25.append(close_button_25);
        main_container.append(container_75, container_25);
        document.getElementById("deudas_data").append(main_container);
        container.removeChild(div);
        run_calculations();
    };

    div.append(input_description, input_amount, btn_deny, btn_aply);
    container.append(div);
};

/* ==========================================================================
   GESTIÓN DE COMENTARIOS Y EDITOR
   ========================================================================== */

document.querySelector(".fake-comments-div").onclick = function () {
    this.classList.add("d-none");
    document.querySelector(".comment-container").classList.remove("d-none");
    document.getElementById("editor").focus();
};

document.getElementById("btn_cancel_comment").onclick = function () {
    document.querySelector(".fake-comments-div").classList.remove("d-none");
    document.querySelector(".comment-container").classList.add("d-none");
    document.getElementById("editor").innerHTML = "";
};

save_comment_btn.onclick = function () {
    let editor = document.getElementById("editor");
    if (editor.innerHTML.trim() != "") {
        if (property_register_btn.classList.contains("d-none")) {
            $.ajax({
                type: "POST",
                url: "index.php?c=gestion&a=add_new_comment",
                data: {
                    "id_gestion": document.getElementById("modal_id_gestion").innerHTML,
                    "contenido": editor.innerHTML
                }
            });
        } else {
            unsaved_comments.push(editor.innerHTML);
        }

        // Renderizado visual inmediato del comentario
        var name = document.getElementById("hidden_user_name").innerHTML;
        var iniciales = name.split(" ");
        var tag = iniciales[0][0].toUpperCase() + (iniciales[1] ? iniciales[1][0].toUpperCase() : "");

        var new_comment_div = document.createElement("div");
        new_comment_div.className = "d-flex flex-row w-100 px-3 my-4";
        new_comment_div.innerHTML = `
            <div class='comment-picture'>${tag}</div>
            <div class='mx-3'>
                <div class='comments-name'>${name}</div>
                <div class='comments-date'>Hace unos segundos</div>
                <div class='comments-comment'>${editor.innerHTML}</div>
            </div>`;
        document.querySelector(".comments-area").append(new_comment_div);
        document.getElementById("btn_cancel_comment").click();
    }
};

/* ==========================================================================
   VALIDACIONES Y LISTENERS DE CAMPOS
   ========================================================================== */

function fields_validation() {
    [client_name, client_last_name].forEach(el => {
        if (!el) return;
        el.maxLength = 15;
        el.addEventListener('keypress', (e) => {
            if (!/^[a-zA-Z\s]+$/.test(String.fromCharCode(e.charCode))) e.preventDefault();
        });
    });

    if (client_phone) {
        client_phone.addEventListener('input', function (e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });
    }

    [property_value, mortgage, cashout, ltv_value, gastos_cierre, prepayment_penalty].forEach(el => {
        if (!el) return;
        el.addEventListener('input', function () {
            if (el === property_value || el === mortgage || el === cashout) {
                applyInputMask(this);
            } else {
                this.value = this.value.replace(/[^0-9.]/g, '');
                if (el === ltv_value && parseFloat(this.value) > 75) this.value = "75";
            }
            run_calculations();
        });
    });
}

/* ==========================================================================
   REGISTRO FINAL (BOTÓN PROPIEDAD)
   ========================================================================== */

property_register_btn.onclick = function () {
    // Validación rápida de campos requeridos
    let fields = [client_name, client_last_name, client_phone, detalle_llamada, property_address, property_value, occupancy];
    let isValid = true;
    fields.forEach(f => {
        if (!f.value) { isValid = false; f.style.border = "1px solid red"; }
        else { f.style.border = "1px solid #ced4da"; }
    });

    if (!isValid) return;

    let deudas_lista = [];
    document.querySelectorAll(".deudas-info-data").forEach(item => {
        let spans = item.querySelectorAll("span");
        deudas_lista.push({ descripcion: spans[0].innerText, monto: spans[1].innerText });
    });

    console.log(deudas_lista);


    $.ajax({
        type: "POST",
        url: "index.php?c=boards&a=add_gestion",
        data: {
            "client_name": client_name.value,
            "client_last_name": client_last_name.value,
            "client_phone": client_phone.value,
            "property_address": property_address.value,
            "occupancy": occupancy.value,
            "interes_actual": interes_actual.value,
            "gastos_cierre": gastos_cierre.value,
            "interes_estimado": interes_estimado.value,
            "tipo_prestamo": tipo_prestamo.value,
            "condiciones_adicionales": condiciones_adicionales.value,
            "call_detail": detalle_llamada.value,
            "property_value": parseMoneyGestion(property_value.value),
            "mortgage": parseMoneyGestion(mortgage.value),
            "loan_amount": parseMoneyGestion(loan_amount.value),
            "cashout": parseMoneyGestion(cashout.value),
            "prepayment_penalty": prepayment_penalty.value,
            "ltv": ltv_value.value,
            "deudas_adicionales": deudas_lista,
            "comments": unsaved_comments,
            "board": document.getElementById("board_id").innerHTML
        }
    }).done(function () {
            location.reload();
    });
};



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
            "property_value": parseMoneyGestion(property_value.value),
            "interes_actual": interes_actual.value,
            "mortgage": parseMoneyGestion(mortgage.value),
            "occupancy": occupancy.value,
            "board": document.getElementById("board_id").innerHTML,
            "ltv": ltv_value.value,
            "interes_estimado": interes_estimado.value,
            "prepayment_penalty": prepayment_penalty.value,
            "gastos_cierre": gastos_cierre.value,
            "tipo_prestamo": tipo_prestamo.value,
            "condiciones_adicionales": condiciones_adicionales.value,
            "loan_amount":  parseMoneyGestion(loan_amount.value),
            "cashout": parseMoneyGestion(cashout.value),
            "gestion_id": document.getElementById("modal_id_gestion").innerHTML
        }
    }).done(function (result) {

        console.log(result);
        if (!reload) return;
        location.href = "index.php?c=boards&a=detail&info=" + document.getElementById("board_id").innerHTML;
    })
}


/* ==========================================================================
   INICIALIZACIÓN FINAL
   ========================================================================== */

fields_validation();
setTimeout(run_calculations, 500);