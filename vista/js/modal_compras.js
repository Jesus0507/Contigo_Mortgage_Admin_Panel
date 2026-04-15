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
var loan_amount = document.getElementById("loan_amount_compra");
var users_list = document.getElementById("hidden_users_list");
var asesor_asignado = document.getElementById("asesor_name_compras");
var asesor_asignado_label = document.getElementById("asesor_asignado_label");
var current_user_asigned = false;

var realtor_name = document.getElementById("realtor_name");
var realtor_tlf = document.getElementById("realtor_tlf");
var realtor_email = document.getElementById("realtor_email");

loan_amount.disabled = true;



var tabs_options = Array.from(document.querySelector(".tabs-options").querySelectorAll("div"));
var unsaved_comments = [];
var save_comment_btn = document.getElementById("btn_save_comment");
let diccionarioIngresos = []; // Variable global

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

function applyInputMask(inputElement) {
    let value = inputElement.value.replace(/\D/g, "");
    if (value === "") return;
    let num = parseFloat(value) / 100;
    inputElement.value = money_format(num);
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

    realtor_tlf.maxLength = 14; // (000) 000-0000 tiene 14 caracteres
    realtor_tlf.addEventListener('input', function (e) {
        // 1. Eliminar todo lo que no sea número
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);

        // 2. Construir el formato dinámicamente
        // x[1] es el área, x[2] el prefijo, x[3] el número
        e.target.value = !x[2]
            ? x[1]
            : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });
    // Bloquear teclas que no sean números (opcional, por seguridad extra)
    realtor_tlf.addEventListener('keypress', function (event) {
        if (!/[0-9]/.test(event.key)) {
            event.preventDefault();
        }
    });

    // disponible_comprar.addEventListener('keypress', function (event) {
    //     const regex = /^[0-9.]+$/;
    //     let key = String.fromCharCode(!event.charCode ? event.which : event.charCode);

    //     if (!regex.test(key)) {
    //         event.preventDefault();
    //         return false;
    //     }
    //     if (key === '.' && this.value.includes('.')) {
    //         event.preventDefault();
    //         return false;
    //     }

    //     get_tiempo_requerido();
    // });

    // monto_max.addEventListener('keypress', function (event) {
    //     const regex = /^[0-9.]+$/;
    //     let key = String.fromCharCode(!event.charCode ? event.which : event.charCode);

    //     if (!regex.test(key)) {
    //         event.preventDefault();
    //         return false;
    //     }
    //     if (key === '.' && this.value.includes('.')) {
    //         event.preventDefault();
    //         return false;
    //     }

    //     // El truco del almendruco:
    //     setTimeout(() => {
    //         get_tiempo_requerido();
    //     }, 0);
    // });

    /* 1. Declarar el timer fuera de los eventos (solo una vez) */
    let typingTimer;
    const doneTypingInterval = 500; // Medio segundo de espera

    /* ==========================================================================
       VALIDACIÓN Y CÁLCULO PARA DOWN PAYMENT
       ========================================================================== */
    down_payment.addEventListener('input', function () {
        let value = this.value;

        // A. Validación: Solo números y un punto decimal
        // Si el usuario pega algo inválido, esto lo limpia
        value = value.replace(/[^0-9.]/g, '');

        // Evitar múltiples puntos decimales
        const parts = value.split('.');
        if (parts.length > 2) value = parts[0] + '.' + parts.slice(1).join('');

        // B. Validación: Límite de 100
        if (parseFloat(value) > 100) {
            value = "100";
        }

        // Actualizamos el campo con el valor limpio
        this.value = value;

        // C. Temporizador para el cálculo
        clearTimeout(typingTimer);
        typingTimer = setTimeout(function () {
            calc_monto_max();
        }, doneTypingInterval);
    });

    /* ==========================================================================
       VALIDACIÓN Y CÁLCULO PARA GASTOS DE CIERRE
       ========================================================================== */
    gastos_cierre.addEventListener('input', function () {
        let value = this.value;

        // A. Limpieza de caracteres no permitidos
        value = value.replace(/[^0-9.]/g, '');

        // B. Evitar múltiples puntos
        const parts = value.split('.');
        if (parts.length > 2) value = parts[0] + '.' + parts.slice(1).join('');

        // C. Límite de 100
        if (parseFloat(value) > 100) {
            value = "100";
        }

        this.value = value;

        // D. Temporizador (usamos el mismo para no solapar cálculos)
        clearTimeout(typingTimer);
        typingTimer = setTimeout(function () {
            calc_monto_max();
        }, doneTypingInterval);
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


    tipo_proceso.onchange = function () {
        checkFlowVisibility();
        calc_monto_max()
        monto_max.value = "";
        total_requerido.value = "";
    };
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

    var fields = [disponible_comprar, monto_max, total_requerido];
    fields.forEach(el => {
        if (!el) return;
        el.addEventListener('input', function () {
            applyInputMask(this);
            if (el == disponible_comprar || el == monto_max) {
                calc_monto_max()
            }

            //       run_calculations();
        });
    });
}

function calc_monto_max() {
    if (tipo_proceso.value == "income_check") {
        calc_loan_amount();
        document.getElementById("calculated_required_money").parentElement.classList.remove("d-none");
        return;
    }
    document.getElementById("calculated_required_money").parentElement.classList.add("d-none");
    // 1. Obtener valores base
    var disp_value = parseMoneyCompras(disponible_comprar.value);
    var dp_perc = down_payment.value !== "" ? parseFloat(down_payment.value) : 0;
    var gastos_perc = gastos_cierre.value !== "" ? parseFloat(gastos_cierre.value) : 0;

    // 2. Cálculo Proactivo del Monto Máximo
    // Sumamos los porcentajes (ej: 20 + 8 = 28%)
    var suma_porcentajes = dp_perc + gastos_perc;
    var nuevo_monto_max = 0;

    if (suma_porcentajes > 0) {
        // Despeje: Si el 'disp_value' es el 28%, el 100% es (disp * 100 / 28)
        nuevo_monto_max = (disp_value * 100) / suma_porcentajes;
    }

    // 3. Aplicar el Monto Máximo calculado
    monto_max.value = money_format(nuevo_monto_max);
    document.getElementById("down_payment_label_percent").innerHTML = money_format((nuevo_monto_max * dp_perc) / 100);
    document.getElementById("gastos_cierre_percent_label").innerHTML = money_format((gastos_perc * nuevo_monto_max) / 100);
    document.getElementById("calculated_required_money").innerHTML = money_format(((nuevo_monto_max * dp_perc) / 100) + ((gastos_perc * nuevo_monto_max) / 100));
    // 4. Calcular el Total Requerido para verificar
    // (Debería dar igual a disp_value, pero restamos 0.01 para seguridad visual)
    var check_total = (nuevo_monto_max * dp_perc / 100) + (nuevo_monto_max * gastos_perc / 100);

    // Mostramos el total requerido (que ahora siempre encajará con la disponibilidad)
    total_requerido.value = money_format(check_total);

    // 5. Validación visual de seguridad
    const btn = document.getElementById("property_register");
    if (check_total > disp_value + 1) { // Margen de error por decimales
        total_requerido.style.color = "red";
        if (btn) btn.disabled = true;
    } else {
        total_requerido.style.color = "black";
        if (btn) btn.disabled = false;
    }
}

function parseMoneyCompras(value) {
    if (!value) return 0;
    if (typeof value === 'number') return value;
    let cleanValue = value.toString().replace(/\./g, '').replace(',', '.');
    let parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? 0 : parsed;
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

    if (proceso == "income_check") {
        monto_max_label.innerHTML = "Purchase price:";
        monto_max.placeholder = "Purchase price";
        total_requerido.parentElement.classList.add("d-none");
        document.querySelector(".programa_container").classList.remove("d-none");
        document.getElementById("tabla_income_info").classList.remove("d-none")
        if (document.querySelectorAll(".cliente-card").length === 0) {
            agregarTarjetaCliente();
        }
    }
    else {
        total_requerido.parentElement.classList.remove("d-none");
        monto_max_label.innerHTML = "Monto max:";
        monto_max.placeholder = "Monto max aplicado";
        document.querySelector(".programa_container").classList.add("d-none");
        document.getElementById("tabla_income_info").classList.add("d-none")
        resetIncomeSection(); // <--- Limpieza aquí

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
    // Validamos primero que la información básica sea correcta
    if (!info_validation()) return;

    // Extraemos los totales del resumen global para guardarlos en la tabla principal de compras si es necesario
    const totalIncomeGlobal = parseMoneyCompras(document.getElementById('resumen_global_ingresos').querySelector('.text-success').innerText);
    const totalDeudaGlobal = parseMoneyCompras(document.getElementById('resumen_global_ingresos').querySelector('.text-danger').innerText);

    $.ajax({
        type: "POST",
        url: "index.php?c=boards&a=add_compra",
        data: {
            "client_name": client_name.value,
            "client_last_name": client_last_name.value,
            "client_phone": client_phone.value,
            "call_detail": detalle_llamada.value,
            "tipo_proceso": tipo_proceso.value,
            "estatus_legal": estatus_legal.value,
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
            "programa_aplica": document.getElementById("programa_aplica").value,
            "comments": unsaved_comments,
            "board": document.getElementById("board_id").innerHTML,
            "realtor_name": realtor_name.value,
            "realtor_tlf": realtor_tlf.value,
            "realtor_email": realtor_email.value,
            "user_asigned": current_user_asigned,

            // --- NUEVOS CAMPOS DE INCOME ---
            // Enviamos el array completo de objetos convertido a JSON string
            "detalle_ingresos": JSON.stringify(diccionarioIngresos)
        }
    }).done(function (result) {
        console.log("Respuesta del servidor:", result);
        // Redirección tras éxito
        location.href = "index.php?c=boards&a=detail&info=" + document.getElementById("board_id").innerHTML;
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error al guardar:", textStatus, errorThrown);
        alert("Hubo un error al guardar la información. Por favor, intente de nuevo.");
    });
}

close_btn.onclick = function () {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Se perderán los cambios que no hayas guardado.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cerrar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true // Pone el botón de cancelar a la izquierda
    }).then((result) => {
        if (result.isConfirmed) {
            // --- TODA TU LÓGICA DE LIMPIEZA AQUÍ ---
            document.getElementById("property_register").classList.remove("d-none");
            if (document.getElementById("property_update")) {
                document.getElementById("property_update").classList.add("d-none");
            }

            $(".modal-gestion").fadeOut();

            var all_inputs = document.querySelector(".modal-gestion").querySelectorAll("input");
            Array.from(all_inputs).forEach((input_content) => {
                input_content.value = "";
            });

            // Limpieza de campos específicos
            document.getElementById("call_detail").value = "";
            document.querySelector(".comments-area").innerHTML = "";
            document.querySelector(".historial-container").innerHTML = "";
            document.getElementById("down_payment_label_percent").innerHTML = "0,00";
            document.getElementById("gastos_cierre_percent_label").innerHTML = "0,00";
            document.getElementById("calculated_required_money").innerHTML = "0,00";
            document.getElementById("calculated_required_money").parentElement.classList.add("d-none");
            document.getElementById("modal_gestion_title").innerHTML = "Nueva compra";
            document.getElementById("programa_aplica").value = "";
            document.querySelector(".programa_container").classList.add("d-none");
            document.getElementById("total_requerido_label").parentElement.classList.remove("d-none");
            document.getElementById("conditions").value = "";

            // Reset de selectores y variables de UI
            tipo_proceso.value = "";
            estatus_legal.value = "";
            forma_pago.value = "";
            tiempo_pago_formato.value = "dias";
            primer_comprador_field.classList.add("d-none");
            forma_pago_container.classList.add("d-none");
            gastos_cierre.value = 8;

            setTimeout(() => {
                document.getElementById("layoutSidenav").classList.remove("opacity-body");
                // Extraer nombre del asesor de forma limpia
                const footerContent = document.querySelector(".sb-sidenav-footer").innerText;
                //    document.getElementById("asesor_name").innerHTML = "Asesor: " + footerContent;

                // Reset de la sección de ingresos (importante para el diccionario)
                resetIncomeSection();
                document.getElementById("tabla_income_info").classList.add("d-none");
            }, 600);
        }
    });
}


if (document.getElementById("property_update")) {
    document.getElementById("property_update").onclick = function () {
        if (!info_validation()) return;

        updateInfo(true);
    }
}

function updateInfo(reload) {
    console.log("modificando info");

    // Aseguramos que el diccionario tenga la última data capturada de los inputs
    if (typeof actualizarDiccionario === "function") {
        actualizarDiccionario();
    }

    console.log(JSON.stringify(diccionarioIngresos));

    $.ajax({
        type: "POST",
        url: "index.php?c=boards&a=update_compra_info",
        data: {
            "client_name": client_name.value,
            "client_last_name": client_last_name.value,
            "client_phone": client_phone.value,
            "call_detail": detalle_llamada.value,
            "tipo_proceso": tipo_proceso.value,
            "estatus_legal": estatus_legal.value,
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
            "realtor_name": realtor_name.value,
            "realtor_tlf": realtor_tlf.value,
            "realtor_email": realtor_email.value,
            "user_asigned": current_user_asigned,

            // --- CAMPO RECIÉN AGREGADO ---
            "programa_aplica": document.getElementById("programa_aplica").value,

            "board": document.getElementById("board_id").innerHTML,
            "gestion_id": document.getElementById("modal_id_gestion").innerHTML,

            // --- BLOQUE DE INGRESOS ---
            "detalle_ingresos": JSON.stringify(diccionarioIngresos)
        }
    }).done(function (result) {
        console.log("Respuesta actualización:", result);
        if (!reload) return;
        location.href = "index.php?c=boards&a=detail&info=" + document.getElementById("board_id").innerHTML;
    }).fail(function (error) {
        console.error("Error al actualizar:", error);
    });
}

function info_validation() {
    // Función auxiliar para saber si un elemento está oculto
    var users_list_parse = JSON.parse(users_list.innerHTML);
    var is_user_assigned = false;
    current_user_asigned = false;

    users_list_parse.forEach((u) => {
        var surname = u.name.toLowerCase() + " " + u.last_name.toLowerCase();
        console.log(surname + " - " + asesor_asignado.value);
        if (asesor_asignado.value.toLowerCase() == surname) {
            is_user_assigned = u.user_id;
            current_user_asigned = u.user_id;
        }
    })

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

    if (is_user_assigned == false) {
        asesor_asignado_label.style.color = "red";
        var msg_asesor = "";
        asesor_asignado.value == "" ? msg_asesor = "Indique el asesor asignado" : msg_asesor = "Asesor no existente";
        asesor_asignado_label.innerHTML = msg_asesor;
        setTimeout(() => {
            asesor_asignado_label.style.color = "black";
            asesor_asignado_label.innerHTML = "Asesor:";
        }, 3000)
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

function calc_percent(type) {
    if (type == "dp") {

    }
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
    //  get_tiempo_requerido()
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



function money_format(num) {
    if (isNaN(num)) num = 0;
    return num.toLocaleString('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function calc_loan_amount() {
    var purchase_price_val = parseMoneyCompras(monto_max.value);
    var dp_perc = down_payment.value !== "" ? parseFloat(down_payment.value) : 0;
    var loan_val = purchase_price_val - ((purchase_price_val * dp_perc) / 100);
    var gastos_perc = gastos_cierre.value !== "" ? parseFloat(gastos_cierre.value) : 0;
    loan_amount.value = money_format(loan_val);
    document.getElementById("down_payment_label_percent").innerHTML = money_format((purchase_price_val * dp_perc) / 100);
    document.getElementById("gastos_cierre_percent_label").innerHTML = money_format((gastos_perc * purchase_price_val) / 100);
    document.getElementById("calculated_required_money").innerHTML = money_format(((purchase_price_val * dp_perc) / 100) + ((gastos_perc * purchase_price_val) / 100));
}



// --- NIVEL 1: CLIENTE (CO-SIGNER) ---
function agregarTarjetaCliente(el) {
    var cant_cards = document.querySelectorAll(".cliente-card").length;
    if (cant_cards == 3) el.disabled = true;
    const idCliente = Date.now();

    let nombreInicial = "";
    let apellidoInicial = "";
    let estatusInicial = ""; // <-- Definirla aquí

    if (cant_cards < 1) {
        nombreInicial = typeof client_name !== 'undefined' ? client_name.value : "";
        apellidoInicial = typeof client_last_name !== 'undefined' ? client_last_name.value : "";
        // Obtenemos el valor del select principal de estatus legal
        estatusInicial = typeof estatus_legal !== 'undefined' ? estatus_legal.value : "";
    }

    const cardHtml = `
        <div class="card mb-2 shadow-sm cliente-card" id="cliente_${idCliente}">
            <div class="card-header p-1 bg-light">
                <div class="d-flex justify-content-between align-start">
                    <div class="d-flex flex-column w-100 ps-2" onclick="toggleCollapse('body_${idCliente}')" style="cursor:pointer">
                        <div class="d-flex align-items-center gap-2">
                            <i class="fas fa-chevron-down mt-1" style="font-size: 10px;" id="icon_${idCliente}"></i>
                            <span class="fw-bold" style="font-size: 13px; line-height: 1.2;" id="header_name_${idCliente}">
                                ${nombreInicial || apellidoInicial ? `${nombreInicial} ${apellidoInicial}` : 'Nuevo Cliente'}
                            </span>
                        </div>
                        <div id="resumen_cliente_${idCliente}" style="font-size: 10px; margin-left: 18px; margin-top: 1px;">
                            <span class="info-income-client text-success me-2" title="Total Anual"><i class="fas fa-calendar-alt"></i> $0,00/año</span>
                            <span class="info-deuda-client text-danger" title="Deuda Total"><i class="fas fa-credit-card"></i> $0,00</span>
                        </div>
                    </div>
                    <button type="button" class="btn btn-xs text-danger border-0 pe-2" onclick="document.getElementById('cliente_${idCliente}').remove(); actualizarDiccionario();">×</button>
                </div>
            </div>
            <div class="card-body p-2" id="body_${idCliente}">
                <div class="row g-2 mb-2">
                    <div class="col-6">
                        <input class="form-control form-control-sm input-nombre" placeholder="Nombre" value="${nombreInicial}" oninput="updateHeader(${idCliente})">
                    </div>
                    <div class="col-6">
                        <input class="form-control form-control-sm input-apellido" placeholder="Apellido" value="${apellidoInicial}" oninput="updateHeader(${idCliente})">
                    </div>
                    <div class="col-4">
                        <input class="form-control form-control-sm input-fico" placeholder="FICO" oninput="actualizarDiccionario()">
                    </div>
                    <div class="col-4">
                        <input class="form-control form-control-sm input-deuda" placeholder="Deuda" onfocus="focusMoney(this)" onblur="blurMoney(this)" oninput="actualizarDiccionario()">
                    </div>
                    <div class="col-4">
                        <select class="form-select form-select-sm select-estatus" onchange="actualizarDiccionario()">
                            <option value="" ${estatusInicial === "" ? 'selected' : ''}>Estatus</option>
                            <option value="ciudadano" ${estatusInicial === "ciudadano" ? 'selected' : ''}>Ciudadano</option>
                            <option value="residente" ${estatusInicial === "residente" ? 'selected' : ''}>Residente</option>
                            <option value="permiso_trabajo" ${estatusInicial === "permiso_trabajo" ? 'selected' : ''}>Permiso</option>
                            <option value="tax_id" ${estatusInicial === "tax_id" ? 'selected' : ''}>Tax ID</option>
                        </select>
                    </div>
                </div>
                
                <div id="trabajos_container_${idCliente}"></div>
                
                <div class="mt-2 d-flex gap-2 border-top pt-2">
                    <button class="btn btn-xs btn-outline-info text-dark py-0" onclick="agregarTrabajo(${idCliente}, 'W2')">+ W2</button>
                    <button class="btn btn-xs btn-outline-secondary text-dark py-0" onclick="agregarTrabajo(${idCliente}, '1099')">+ 1099</button>
                </div>
            </div>
        </div>`;

    document.getElementById('income_cards_container').insertAdjacentHTML('beforeend', cardHtml);

    // Si traía datos, actualizamos el estado interno
    if (cant_cards < 1 && (nombreInicial !== "" || apellidoInicial !== "" || estatusInicial !== "")) {
        actualizarDiccionario();
    }
}
// --- NIVEL 2: TRABAJO (W2 o 1099) ---
function agregarTrabajo(idCliente, tipo) {
    const idTrabajo = Date.now();
    const contenedor = document.getElementById(`trabajos_container_${idCliente}`);

    let html = `
        <div class="border rounded mb-2 bg-white shadow-xs job-item" id="job_${idTrabajo}">
            <div class="d-flex justify-content-between align-items-center p-2 bg-light-subtle border-bottom">
                <div class="d-flex align-items-center gap-2 w-100" onclick="toggleCollapse('job_body_${idTrabajo}')" style="cursor:pointer">
                    <i class="fas fa-chevron-down small-icon" id="icon_job_${idTrabajo}"></i>
                    <span class="badge ${tipo === 'W2' ? 'bg-info' : 'bg-secondary'}">${tipo}</span>
                    <span class="small text-muted" id="job_label_${idTrabajo}">${tipo === 'W2' ? 'Nueva Empresa' : 'Ingreso 1099'}</span>
                </div>
                <div class="d-flex align-items-center">
                    ${tipo === 'W2' ? `
                    <div class="form-check form-switch me-4" style="font-size: 11px; min-width: 90px;">
                        <input class="form-check-input check-paystub" type="checkbox" onchange="toggleW2Mode(this, ${idTrabajo})"> 
                        <span class="ms-1">Paystubs</span>
                    </div>` : ''}
                    <button type="button" class="btn btn-xs text-danger border-0" onclick="eliminarTrabajo(${idTrabajo})">×</button>
                </div>
            </div>
            <div class="p-2" id="job_body_${idTrabajo}">
                ${tipo === 'W2' ? `
                    <input class="form-control form-control-sm mb-2 input-empresa" placeholder="Nombre Empresa" oninput="document.getElementById('job_label_${idTrabajo}').innerText = this.value || 'Nueva Empresa'; actualizarDiccionario();">
                    <div id="area_dinamica_${idTrabajo}">${renderFormW2(idTrabajo)}</div>
                ` : `
                    <div id="area_dinamica_${idTrabajo}">${renderForm1099(idTrabajo)}</div>
                `}
            </div>
        </div>`;

    contenedor.insertAdjacentHTML('beforeend', html);
    actualizarDiccionario();
}

function eliminarTrabajo(id) {
    document.getElementById(`job_${id}`).remove();
    actualizarDiccionario();
}

// --- NIVEL 3: TAXES E INCOME ---
function agregarAnioImpuesto(idTrabajo, el) {
    var cant_taxes = el.parentElement.querySelectorAll(".tax-fields").length;
    if (cant_taxes == 1) el.disabled = true;
    const contenedor = document.getElementById(`tax_list_${idTrabajo}`);
    const idTax = Date.now();
    const html = `
        <div class="d-flex gap-1 mb-1 align-items-center tax-fields" id="tax_row_${idTax}">
            <input type="number" class="form-control form-control-sm w-50" placeholder="Año">  
            <input type="text" class="form-control form-control-sm w-50 tax-value-${idTrabajo}" placeholder="Monto $" onfocus="focusMoney(this)" onblur="blurMoney(this); calcularAverage(${idTrabajo})">
            <button class="btn btn-xs text-danger p-0" onclick="eliminarAnio(${idTax}, ${idTrabajo}, this)">×</button>
        </div>`;
    contenedor.insertAdjacentHTML('beforeend', html);
}

function eliminarAnio(idTax, idTrabajo, el) {
    var btn_tax = el.closest('.p-2').querySelector(".btn-add-impuesto");
    document.getElementById(`tax_row_${idTax}`).remove();
    if (btn_tax) btn_tax.disabled = false;
    calcularAverage(idTrabajo);
}

// --- RENDER HELPERS ---
function renderFormW2(id) {
    return `
        <div id="taxes_w2_${id}">
            <div id="tax_list_${id}"></div>
            <button type="button" class="btn btn-xs btn-outline-primary w-100 mb-1 btn-add-impuesto" style="font-size:10px" onclick="agregarAnioImpuesto(${id},this)">+ Añadir Año Tax</button>
            <div class="small bg-light p-1 text-center border rounded">Promedio Anual: <b>$ <span class="avg-info" id="avg_display_${id}">0.00</span></b></div>
        </div>
        <div id="paystubs_w2_${id}" class="d-none mt-2">
            <div class="row g-1 text-center">
                <div class="col-4">
                    <label style="font-size:9px">$/Hora</label>
                    <input type="text" class="form-control form-control-sm text-center cl-valor-hora" onfocus="focusMoney(this)" onblur="blurMoney(this)" oninput="calcPS(${id})">
                </div>
                <div class="col-4">
                    <label style="font-size:9px">Horas</label>
                    <input type="number" class="form-control form-control-sm text-center cl-horas" placeholder="0" oninput="calcPS(${id})">
                </div>
                <div class="col-4">
                    <label style="font-size:9px">Freq (Sems)</label>
                    <input type="number" class="form-control form-control-sm text-center cl-freq" placeholder="52" oninput="calcPS(${id})">
                </div>
                <div class="col-12 mt-1 small bg-success-subtle p-1 border rounded">
                    Mensual: <b>$<span id="ps_res_${id}">0.00</span></b> | Anual: <b>$<span class="avg-info" id="ps_anual_res_${id}">0.00</span></b>
                </div>
            </div>
        </div>`;
}

function renderForm1099(id) {
    return `
        <div id="tax_list_${id}"></div>
        <button type="button" class="btn btn-xs btn-outline-primary w-100 mb-1 btn-add-impuesto" style="font-size:10px" onclick="agregarAnioImpuesto(${id},this)">+ Añadir Año Tax</button>
        <div class="small bg-light p-1 text-center border rounded mt-2">Promedio Anual: <b>$<span class="avg-info" id="avg_display_${id}">0.00</span></b></div>`;
}

// --- CÁLCULOS Y DICCIONARIO ---
function calcularAverage(idTrabajo) {
    const inputs = document.querySelectorAll(`.tax-value-${idTrabajo}`);
    let total = 0, count = 0;
    inputs.forEach(input => {
        const val = parseMoneyCompras(input.value);
        if (val > 0) { total += val; count++; }
    });
    const avg = count > 0 ? (total / count) : 0;
    document.getElementById(`avg_display_${idTrabajo}`).innerText = money_format(avg);
    actualizarDiccionario();
}

function calcPS(id) {
    const area = document.getElementById(`paystubs_w2_${id}`);
    const inputs = area.querySelectorAll('input');
    const valorHora = parseMoneyCompras(inputs[0].value);
    const horas = parseFloat(inputs[1].value) || 0;
    const frecuencia = parseFloat(inputs[2].value) || 0;

    const anual = (valorHora * horas * frecuencia);
    const mensual = anual / 12;

    document.getElementById(`ps_res_${id}`).innerText = money_format(mensual);
    document.getElementById(`ps_anual_res_${id}`).innerText = money_format(anual);
    actualizarDiccionario();
}


var total_income = 0;
var total_deuda = 0;

function actualizarDiccionario() {
    let data = [];
    let granTotalIncomeAnual = 0;

    // Recorremos cada tarjeta de cliente
    document.querySelectorAll('.cliente-card').forEach(clienteEl => {
        const idCliente = clienteEl.id.replace('cliente_', '');

        let cliente = {
            nombre: clienteEl.querySelector('.input-nombre')?.value || "",
            apellido: clienteEl.querySelector('.input-apellido')?.value || "",
            fico: clienteEl.querySelector('.input-fico')?.value || "",
            deuda: parseMoneyCompras(clienteEl.querySelector('.input-deuda')?.value || "0"),
            estatusLegal: clienteEl.querySelector('.select-estatus')?.value || "",
            trabajos: []
        };

        let totalIncomeAnualCliente = 0;

        // Recorremos los trabajos de este cliente
        clienteEl.querySelectorAll('.job-item').forEach(jobEl => {
            const idJob = jobEl.id.replace('job_', '');
            const badge = jobEl.querySelector('.badge');
            const tipo = badge ? badge.innerText.trim() : 'W2';

            let incomeAnualJob = 0;

            let trabajo = {
                tipo: tipo,
                empresa: jobEl.querySelector('.input-empresa')?.value || (tipo === 'W2' ? "Nueva Empresa" : "Ingreso 1099"),
                detallesTaxes: []
            };

            if (tipo === 'W2') {
                // Verificamos el switch de Paystubs usando la clase que corregimos
                const checkPS = jobEl.querySelector('.check-paystub');
                const isPaystub = checkPS ? checkPS.checked : false;

                trabajo.modo = isPaystub ? 'paystubs' : 'taxes';

                if (isPaystub) {
                    // Captura de datos crudos para la BD
                    trabajo.valor_hora = parseMoneyCompras(jobEl.querySelector('.cl-valor-hora')?.value || "0");
                    trabajo.horas_semanales = parseFloat(jobEl.querySelector('.cl-horas')?.value || "0");
                    trabajo.frecuencia_anual = parseFloat(jobEl.querySelector('.cl-freq')?.value || "52");

                    // El valor mensual calculado para referencia rápida
                    trabajo.income_calculado_mensual = parseMoneyCompras(document.getElementById(`ps_res_${idJob}`)?.innerText || "0");

                    // Usamos el resultado anual del span para el total general
                    incomeAnualJob = parseMoneyCompras(document.getElementById(`ps_anual_res_${idJob}`)?.innerText || "0");
                } else {
                    // Modo Taxes: Recolectamos los años añadidos
                    jobEl.querySelectorAll(`[id^="tax_row_"]`).forEach(row => {
                        const inputs = row.querySelectorAll('input');
                        if (inputs.length >= 2) {
                            trabajo.detallesTaxes.push({
                                anio: inputs[0].value,
                                monto: parseMoneyCompras(inputs[1].value)
                            });
                        }
                    });
                    // El promedio anual calculado en el span de Taxes
                    incomeAnualJob = parseMoneyCompras(document.getElementById(`avg_display_${idJob}`)?.innerText || "0");
                }
            } else {
                // Es tipo 1099 (usualmente usa la lógica de promedio de taxes)
                jobEl.querySelectorAll(`[id^="tax_row_"]`).forEach(row => {
                    const inputs = row.querySelectorAll('input');
                    if (inputs.length >= 2) {
                        trabajo.detallesTaxes.push({
                            anio: inputs[0].value,
                            monto: parseMoneyCompras(inputs[1].value)
                        });
                    }
                });
                incomeAnualJob = parseMoneyCompras(document.getElementById(`avg_display_${idJob}`)?.innerText || "0");
            }

            trabajo.incomeAnual = incomeAnualJob;
            totalIncomeAnualCliente += incomeAnualJob;
            cliente.trabajos.push(trabajo);
        });

        // Actualizar el resumen visual en la cabecera de la tarjeta del cliente
        const resumenIncome = clienteEl.querySelector(`#resumen_cliente_${idCliente} .text-success`);
        const resumenDeuda = clienteEl.querySelector(`#resumen_cliente_${idCliente} .text-danger`);

        if (resumenIncome) resumenIncome.innerHTML = `<i class="fas fa-calendar-alt"></i> ${money_format(totalIncomeAnualCliente)}/año`;
        if (resumenDeuda) resumenDeuda.innerHTML = `<i class="fas fa-credit-card"></i> ${money_format(cliente.deuda)}`;

        granTotalIncomeAnual += totalIncomeAnualCliente;
        data.push(cliente);
    });

    // Actualizar el Gran Total en el modal (si tienes ese elemento)
    const granTotalEl = document.getElementById('gran_total_income_anual');
    if (granTotalEl) {
        granTotalEl.innerText = money_format(granTotalIncomeAnual);
    }

    const resumenGlobal = document.getElementById('resumen_global_ingresos');
    if (resumenGlobal) {
        var all_deudas = document.querySelectorAll(".info-deuda-client");
        var all_income = document.querySelectorAll(".info-income-client");
        var deudas_total = 0;
        var income_total = 0;
        Array.from(all_deudas).forEach((d) => { deudas_total += parseFloat(parseMoneyCompras(d.innerText)) });
        Array.from(all_income).forEach((inc) => { income_total += parseFloat(parseMoneyCompras(inc.innerText.split("/")[0])) });



        resumenGlobal.innerHTML = `
            <span class="text-success me-3" style="font-size: 14px;" title="Ingreso Anual">
                <i class="fas fa-hand-holding-usd"></i> <b>${money_format(income_total)}</b> <small>(anual)</small>
            </span>
            <span class="text-danger" style="font-size: 14px;" title="Deuda Total">
                <i class="fas fa-credit-card"></i> <b>${money_format(deudas_total)}</b>
            </span>
        `;
    }

    // Opcional: imprimir en consola para debug
    //  console.log("Diccionario Actualizado:", data);

    // Si necesitas guardar esto en un input oculto para el form submit
    const inputOculto = document.getElementById('json_clientes_income');
    if (inputOculto) {
        inputOculto.value = JSON.stringify(data);
    }

    diccionarioIngresos = data;
    // console.log(diccionarioIngresos)
}
// --- UTILS ---
function toggleCollapse(id) {
    const el = document.getElementById(id);
    const iconId = id.startsWith('job_body') ? 'icon_job_' + id.split('_')[2] : 'icon_' + id.split('_')[1];
    const icon = document.getElementById(iconId);
    if (el.style.display === "none") {
        el.style.display = "block";
        icon?.classList.replace('fa-chevron-right', 'fa-chevron-down');
    } else {
        el.style.display = "none";
        icon?.classList.replace('fa-chevron-down', 'fa-chevron-right');
    }
}

function updateHeader(id) {
    const card = document.getElementById(`cliente_${id}`);
    const name = card.querySelector('.input-nombre').value || "";
    const lastName = card.querySelector('.input-apellido').value || "";
    document.getElementById(`header_name_${id}`).innerText = (name || lastName) ? `${name} ${lastName}` : "Nuevo Cliente";
}

function toggleW2Mode(cb, id) {
    document.getElementById(`taxes_w2_${id}`).classList.toggle('d-none', cb.checked);
    document.getElementById(`paystubs_w2_${id}`).classList.toggle('d-none', !cb.checked);
    actualizarDiccionario();
}

function focusMoney(input) {
    let valor = parseMoneyCompras(input.value);
    input.type = "number";
    input.value = valor > 0 ? valor : "";
}

function blurMoney(input) {
    let valor = parseFloat(input.value) || 0;
    input.type = "text";
    input.value = money_format(valor);
    actualizarDiccionario();
}

/**
 * Limpia por completo la sección de ingresos y resetea el diccionario.
 * Soluciona el ReferenceError en checkFlowVisibility.
 */
function resetIncomeSection() {
    // 1. Limpiar el contenedor visual de las tarjetas
    console.log("reseteando");
    const container = document.getElementById('income_cards_container');
    if (container) {
        container.innerHTML = "";
    }

    // 2. Resetear el diccionario global de datos
    // Asegúrate de que esta variable esté declarada al inicio de tu script
    diccionarioIngresos = [];

    // 3. Reiniciar los indicadores visuales del resumen global
    const resumenGlobal = document.getElementById('resumen_global_ingresos');
    if (resumenGlobal) {
        resumenGlobal.innerHTML = `
            <span class="text-success me-3" style="font-size: 14px;" title="Ingreso Anual">
                <i class="fas fa-hand-holding-usd"></i> <b>$0,00</b> <small>(anual)</small>
            </span>
            <span class="text-danger" style="font-size: 14px;" title="Deuda Total">
                <i class="fas fa-credit-card"></i> <b>$0,00</b>
            </span>
        `;
    }

    // 4. Habilitar de nuevo el botón de agregar si estaba bloqueado
    const btnAdd = document.getElementById("add_cosigner");
    if (btnAdd) {
        btnAdd.disabled = false;
    }
}