 columns = document.querySelectorAll(".task-column");
const tasks = document.querySelectorAll(".task");
var all_options_btn = document.querySelectorAll(".ticket-options");
var add_column = document.getElementById("add_column");
var columns_options = Array.from(document.querySelectorAll(".opt-item"));

// Función para actualizar los contadores de cada columna
function updateTaskCounts() {
    columns.forEach((column) => {
        const tasksInColumn = column.querySelectorAll(".task");
        const taskCount = tasksInColumn.length;

        // Buscamos el span de cantidad específicamente dentro del título
        let countDisplay = column.querySelector(".task_cant");
        if (countDisplay) {
            countDisplay.textContent = taskCount;
        }
    });
}


// Configuración de eventos para las tareas (Drag)
tasks.forEach((task) => {
    task.addEventListener("dragstart", (event) => {
        task.id = "dragged-task";
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("task", "");
    });

    task.addEventListener("dragend", (event) => {
        task.removeAttribute("id");
    });
});

// Configuración de las columnas para recibir tareas (Drop)
columns.forEach((column) => {
    column.addEventListener("dragover", (event) => {
        if (event.dataTransfer.types.includes("task")) {
            event.preventDefault();
        }
    });

    column.addEventListener("drop", (event) => {
        event.preventDefault();

        const draggedTask = document.getElementById("dragged-task");
        // CORRECCIÓN: Buscamos el elemento <ul> con clase .tasks para hacer el append
        const tasksContainer = column.querySelector(".tasks");

        if (draggedTask && tasksContainer) {
            tasksContainer.appendChild(draggedTask);

            // Obtenemos los datos para la base de datos de forma segura
            const newEtapa = column.querySelector(".task-title-text").innerText;
            const idGestion = draggedTask.querySelector(".gestion-id").innerHTML;

            console.log("Moviendo a:", newEtapa);
            console.log("ID Gestión:", idGestion);
            $.ajax({
                type: "POST",
                url: "index.php?c=boards&a=update_gestion",
                data: {
                    "new_etapa": newEtapa,
                    "id_gestion": idGestion,
                    "tipo_gestion": document.getElementById("hidden_board_type").innerHTML
                }
            }).done(function (result) {
                console.log("Resultado servidor:", result);
            });

            updateTaskCounts();
        }
    });
});

// Manejo de botones de opciones
all_options_btn.forEach((opt) => {
    opt.addEventListener("click", (event) => {
        // Usamos closest para encontrar el contenedor padre de la columna y luego sus elementos internos
        var columnParent = event.target.closest(".task-column");
        var opt_container = columnParent.querySelector(".ticket-options-container");
        var tasks_container = columnParent.querySelector(".tasks");

        if (opt_container && opt_container.classList.contains("d-none")) {
            opt_container.classList.remove("d-none");
            tasks_container.style.marginTop = "-100px";
        } else if (opt_container) {
            opt_container.classList.add("d-none");
            tasks_container.style.marginTop = "0px";
        }
    });
});

document.body.onclick = function (ev) {
    if (!ev.target.classList.contains('opt-clickeable')) {
        var allContainers = document.querySelectorAll(".ticket-options-container");
        var allColumns = document.querySelectorAll(".tasks");
        allContainers.forEach((container) => {
            if (!container.classList.contains("d-none")) {
                allColumns.forEach((column) => {
                    if (!container.classList.contains("d-none")) { column.style.marginTop = "0px"; }
                })
                container.classList.add("d-none");

            }
        })
    }
}


add_column.onclick = function () {
    add_column.disabled = true;
    var container_tasks = document.querySelector(".container-tasks");
    var all_tasks = container_tasks.querySelectorAll(".task-column");
    var new_column_div = document.createElement('div');
    var div_input = document.createElement("input");
    div_input.className = "form-control w-100";
    div_input.placeholder = "Nombre de la columna";
    new_column_div.appendChild(div_input);
    new_column_div.className = "add-column-div";
    var new_col_div_opt = document.createElement("div");
    new_col_div_opt.className = "w-50 mx-auto d-flex flex-row justify-content-between mt-4";
    var accept_btn = document.createElement("button");
    var deny_btn = document.createElement("button");
    accept_btn.className = deny_btn.className = 'btn btn-light';
    accept_btn.innerHTML = "<i class='fas fa-check'></i>"
    deny_btn.innerHTML = "<i class='fas fa-close'></i>";
    new_col_div_opt.appendChild(accept_btn);
    new_col_div_opt.appendChild(deny_btn);
    new_column_div.appendChild(new_col_div_opt);
    container_tasks.innerHTML = "";
    all_tasks.forEach((task) => {
        if (task == all_tasks[all_tasks.length - 1]) {
            container_tasks.append(new_column_div);
            div_input.focus();
        }
        container_tasks.appendChild(task);
    });

    accept_btn.onclick = function () {
        add_new_column_val(div_input);
    }

    deny_btn.onclick = function () {
        add_column.disabled = false;
        div_input.style.border = "none";
        div_input.value = "";
        container_tasks.innerHTML = "";
        all_tasks.forEach((task) => {
            container_tasks.appendChild(task);
        });
    }
}


function add_new_column_val(input) {
    if (input.value == "" || input.value == null) {
        input.style.border = "4px solid red";
        input.focus();
    }
    else {
        input.style.border = "none";
        var new_etapa = input.value;
        var all_etapas = document.querySelector(".container-tasks").children;
        var new_etapas_order = '';
        Array.from(all_etapas).forEach((etapa) => {
            if (etapa.classList.contains("task-column")) {
                new_etapas_order += etapa.querySelector(".task-title-text").innerHTML;
            }
            else {
                new_etapas_order += new_etapa;
            }
            if (etapa != Array.from(all_etapas)[all_etapas.length - 1]) {
                new_etapas_order += "/";
            }
        });
        $.ajax({
            type: "POST",
            url: "index.php?c=boards&a=update_board",
            data: {
                "order_etapas": new_etapas_order,
                "id_board": document.getElementById("board_id").innerHTML
            }
        }).done(function (result) {
            if (result) {
                location.reload();
            }
            else {
                console.log("Resultado servidor:", result);
            }
        });

    }
}


Array.from(tasks).forEach((task) => {
    task.ondblclick = function (ev) {
        document.getElementById("property_register").classList.add("d-none");
        if (document.getElementById("property_update")) document.getElementById("property_update").classList.remove("d-none");
        var board_type = document.getElementById("hidden_board_type").innerHTML;
        if (board_type == "gestion_clientes") load_gestion_modal_info(ev);
        if (board_type == "compras") load_compras_modal_info(ev);
    }
});

function load_compras_modal_info(ev) {
    $.ajax({
        type: "POST",
        url: "index.php?c=compra&a=get_compras_info",
        data: {
            "id_compra": ev.target.querySelector("span").innerHTML
        }
    }).done(function (result) {
        var resParsed = JSON.parse(result);
        var resultado = resParsed["gestion_info"][0];
        var notas = resParsed['notas'];
        var historial = resParsed['historial'];

        document.getElementById("modal_id_gestion").innerHTML = resultado['id_compra'];

        // Procesar el tiempo de pago (Separar "12 meses" en ["12", "meses"])
        var tiempoArray = resultado['tiempo_pago_electronico'] ? resultado['tiempo_pago_electronico'].split(" ") : ["", "meses"];
        var valorTiempo = tiempoArray[0];
        var formatoTiempo = tiempoArray[1] ? tiempoArray[1] : "meses";

        var all_inputs = Array.from(document.querySelector(".custom-modal").querySelectorAll("input"));

        // Mapeo de inputs (Modificado el índice 3 que corresponde al tiempo)
        all_inputs.forEach((input, i) => {
            input.value =
                i == 0 ? resultado['name'].replace(/\b\w/g, l => l.toUpperCase()) :
                    i == 1 ? resultado['last_name'].replace(/\b\w/g, l => l.toUpperCase()) :
                        i == 2 ? resultado['phone'] :
                            i == 3 ? valorTiempo : // <-- Aquí ahora solo va el número
                                i == 4 ? resultado['disponible_comprar'] :
                                    i == 5 ? resultado['credito_cliente'] :
                                        i == 6 ? resultado['monto_max_aplicado'] :
                                            i == 7 ? resultado['interes_ofrecido'] :
                                                i == 8 ? resultado['down_payment'] :
                                                    i == 9 ? resultado['gastos_cierre'] :
                                                        i == 10 ? resultado['total_requerido'] : '';
        });

        // Asignar el valor al SELECT de formato
        if (document.getElementById("tiempo_pago_formato")) {
            document.getElementById("tiempo_pago_formato").value = formatoTiempo;
        }

        // Limpiar y cargar áreas de historial y notas
        document.querySelector(".comments-area").innerHTML = "";
        document.querySelector(".historial-container").innerHTML = "";

        historial.forEach((h) => { add_historial(h); });
        notas.forEach((nota) => { new_note_item(nota); });

        // Selects y visibilidad
        document.getElementById("call_detail").value = resultado['detalle_llamada'];
        document.getElementById("conditions").value = resultado['condiciones_notas'];
        document.getElementById("process_type").value = resultado['tipo_proceso'] ?? "income_check";
        document.getElementById("primer_comprador").value = resultado['primer_comprador'] ?? "si";
        document.getElementById("estatus_legal").value = (resultado['estatus_legal'] == "" || resultado['estatus_legal'] == null) ? "ciudadano" : resultado['estatus_legal'];
        document.getElementById("forma_pago").value = resultado['forma_pago'] ?? "medio_electronico";

        // Lógica de visibilidad (Ajustada para los nuevos IDs)
        if (document.getElementById("process_type").value == "non_qm") {
            document.getElementById("estatus_legal").parentElement.classList.remove("d-none");
        } else {
            document.getElementById("estatus_legal").parentElement.classList.add("d-none");
        }

        if (document.getElementById("primer_comprador").value == "si") {
            document.getElementById("forma_pago").parentElement.parentElement.classList.remove("d-none");
        } else {
            document.getElementById("forma_pago").parentElement.parentElement.classList.add("d-none");
        }

        if (document.getElementById("forma_pago").value == "medio_electronico") {
            // Mostramos el contenedor padre del grupo de tiempo
            document.getElementById("tiempo_pago").parentElement.parentElement.parentElement.classList.remove("d-none");
            document.getElementById("forma_pago").parentElement.style.width = "45%";
        } else {
            document.getElementById("tiempo_pago").parentElement.parentElement.parentElement.classList.add("d-none");
            document.getElementById("forma_pago").parentElement.style.width = "100%";
        }

        document.getElementById("modal_gestion_title").innerHTML = "Información de la compra";
        document.getElementById("modal_btn").click();
    });
}
function load_gestion_modal_info(ev) {

    $.ajax({
        type: "POST",
        url: "index.php?c=gestion&a=get_gestion_info",
        data: {
            "id_gestion": ev.target.querySelector("span").innerHTML
        }
    }).done(function (result) {
        console.log(JSON.parse(result));
        var resultado = JSON.parse(result)["gestion_info"][0];
        var notas = JSON.parse(result)['notas'];
        var deudas = JSON.parse(result)['deudas']
        var historial = JSON.parse(result)['historial'];
        document.getElementById("modal_id_gestion").innerHTML = resultado['id_gestion'];

        deudas.forEach((deuda) => {
            new_deuda_item(deuda);
        })

        notas.forEach((nota) => {
            new_note_item(nota);
        })

        historial.forEach((h) => {
            add_historial(h);
        })

        var all_inputs = Array.from(document.querySelector(".custom-modal").querySelectorAll("input"));
        var i = 0;
        all_inputs.forEach((input) => {
            input.value = i == 0 ? resultado['name'].replace(/\b\w/g, l => l.toUpperCase()) : i == 1 ? resultado['last_name'].replace(/\b\w/g, l => l.toUpperCase()) : i == 2 ? resultado['phone'] : i == 3 ? resultado['property_address'] : i == 4 ? resultado['property_value'] : i == 5 ? resultado['interes_actual'] : i == 6 ? resultado['mortgage'] : i == 8 ? resultado['ltv'] : i == 9 ? resultado['interes_estimado'] : i == 10 ? resultado['prepayment_penalty'] : i == 11 ? resultado['gastos_cierre'] : i == 12 ? resultado['loan_amount'] : resultado['cash_out'];
            i++;
        })
        document.getElementById("call_detail").value = resultado['detalle_llamada'];
        document.getElementById("occupancy").value = resultado['occupancy'] ?? "primary_residence";
        document.getElementById("tipo_prestamo").value = resultado['tipo_prestamo'] ?? "fha";
        document.getElementById("aditional_conditions").value = resultado['condiciones_adicionales'];
        document.getElementById("aditional_conditions").value = resultado['condiciones_adicionales'];
        document.getElementById("modal_gestion_title").innerHTML = "Información de la gestión";
        document.getElementById("modal_btn").click();

    });
}

function new_note_item(note) {
    var iniciales = document.getElementById("hidden_user_name").innerHTML.split(" ");
    iniciales = iniciales[0][0].toUpperCase() + iniciales[1][0].toUpperCase();
    var new_comment_div = document.createElement("div");
    new_comment_div.className = "d-flex flex-row w-100 px-3 my-4";
    new_comment_div.innerHTML = "<div class='comment-picture'>" + iniciales + "</div>";
    new_comment_div.innerHTML += "<div class='mx-3'><div class='comments-name'>" + note['name'] + " " + note['last_name'] + "</div><div class='comments-date'>" + tiempoRelativo(note['fecha_creacion']) + "</div><div class='comments-comment'>" + note['contenido'] + "</div></div></div>";
    document.querySelector(".comments-area").append(new_comment_div);
}

function add_historial(h) {
    console.log(h);
    var iniciales = h['name'][0].toUpperCase() + h['last_name'][0].toUpperCase();
    var new_historial_div = document.createElement("div");
    new_historial_div.className = "d-flex flex-row w-100 px-3 my-4";
    new_historial_div.innerHTML = "<div class='comment-picture'>" + iniciales + "</div>";
    var icon = h['tipo_accion'] == "registro" ? "fas fa-file-upload" : h['tipo_accion'] == "cambio_estado" ? "fas fa-exchange-alt" : h['tipo_accion'] == "add_deuda" ? "fas fa-hand-holding-usd" : h['tipo_accion'] == "remove_deuda" ? "fas fa-hand-holding" : "fas fa-comment";
    new_historial_div.innerHTML += "<div class='mx-3'><div class='comments-name'><span style='font-size:32px' class='" + icon + "'></span></div><div class='comments-date mt-1'>" + tiempoRelativo(h['fecha_registro']) + "</div><div class='comments-comment'>" + h['accion'] + "</div></div></div>";
    document.querySelector(".historial-container").append(new_historial_div);
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




function new_deuda_item(deuda) {
    var main_container = document.createElement("div");
    main_container.className = "d-flex flex-row justify-content-between w-100 px-4 mx-auto";
    main_container.style.borderBottom = "1px black solid";
    var container_75 = document.createElement("div");
    container_75.className = "w-75 fw-bold deudas-info-data";
    container_75.innerHTML = "<div><span>" + deuda['description'] + "</span></div><div><i class='fas fa-money-bill'></i> <span>" + deuda['amount'] + "</span></div>";
    var container_25 = document.createElement("div");
    container_25.className = "w-25 text-end";
    var close_button_25 = document.createElement("button");
    close_button_25.className = "btn btn-light";
    close_button_25.innerHTML = "X";
    container_25.append(close_button_25);
    main_container.append(container_75, container_25);
    document.getElementById("deudas_data").append(main_container);
    close_button_25.onclick = function () {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Si continúas eliminaras del registro de esta deuda en la base de datos',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    url: "index.php?c=gestion&a=delete_deuda",
                    data: {
                        "id_deuda": deuda['id_deuda'],
                        "id_gestion": document.getElementById("modal_id_gestion").innerHTML
                    }
                }).done(function (result) {
                    console.log(result);
                    if (result) {
                        document.getElementById("deudas_data").removeChild(main_container);
                        document.getElementById("hidden_calcs").click();
                    }
                    else {
                        console.log(result);
                    }
                });
            }
        });
    }

}



columns_options.forEach((opt) => {
    opt.onclick = function (ev) {
        var column = ev.target.parentElement.parentElement.querySelector(".task-title-text").innerHTML;
        var opt_selected = ev.target.innerHTML.toLowerCase();
        if (opt_selected == "mover columna a la izquierda" || opt_selected == "mover columna a la derecha") {
            change_board_order(column, opt_selected);
        }

        if (opt_selected == 'eliminar columna') {
            delete_column(column, opt_selected);
        }
    }
})


function delete_column(column, opt) {
    Swal.fire({
        title: '¿Desea eliminar esta columna?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "POST",
                url: "index.php?c=boards&a=change_board_order",
                data: {
                    "id_board": document.getElementById("board_id").innerHTML,
                    "column": column,
                    "opt": opt
                }
            }).done(function (result) {
                console.log(result);
                if (result) {
                    Swal.fire('Eliminado', 'La columna ha sido borrada.', 'success');
                    setTimeout(() => {
                        location.reload();
                    }, 1000)
                }
                else {
                    console.log(result);
                }
            });
        }
    });
}


function change_board_order(column, opt) {
    $.ajax({
        type: "POST",
        url: "index.php?c=boards&a=change_board_order",
        data: {
            "id_board": document.getElementById("board_id").innerHTML,
            "column": column,
            "opt": opt
        }
    }).done(function (result) {
        if (result) {
            location.reload();
        }
        else {
            console.log(result);
        }
    });
}


updateTaskCounts();