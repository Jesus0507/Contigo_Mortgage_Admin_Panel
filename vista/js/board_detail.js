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
        if(task.dataset.status == "FINALIZADO" && task.dataset.userType != "admin") return;
        task.id = "dragged-task";
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("task", "");
    });

    task.addEventListener("dragend", (event) => {
        task.removeAttribute("id");
        console.log(task.parentElement.parentElement.querySelector(".task-title-text").innerHTML);
        if(task.parentElement.parentElement.querySelector(".task-title-text").innerHTML.toLowerCase() == "finalizado" && task.dataset.userType != "admin"){
            task.draggable = false;
            task.dataset.status ="FINALIZADO";
        }
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
    task.onclick = function (ev) {
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
        // console.log(result);
        var resParsed = JSON.parse(result);
        var resultado = resParsed["gestion_info"][0];
        var notas = resParsed['notas'];
        var historial = resParsed['historial'];

        document.getElementById("modal_id_gestion").innerHTML = resultado['id_compra'];
        document.getElementById("asesor_name").innerHTML = "Asesor: " + resultado['user_name'] + " " + resultado['user_last_name'];

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
        document.getElementById("programa_aplica").value = resultado['programa_aplica'];
        document.getElementById("process_type").value = resultado['tipo_proceso'] ?? "income_check";
        document.getElementById("primer_comprador").value = resultado['primer_comprador'] ?? "si";
        document.getElementById("estatus_legal").value = (resultado['estatus_legal'] == "" || resultado['estatus_legal'] == null) ? "ciudadano" : resultado['estatus_legal'];
        document.getElementById("forma_pago").value = resultado['forma_pago'] ?? "medio_electronico";
        var purchase_val = document.getElementById("monto_max").value != "" ? parseMoneyAux(document.getElementById("monto_max").value) : 0;
        var perc_dp = document.getElementById("down_payment").value != "" ? parseFloat(document.getElementById("down_payment").value) : 0;
        var perc_gastos = document.getElementById("gastos_cierre").value != ""? parseFloat(document.getElementById("gastos_cierre").value) : 0;

        document.getElementById("down_payment_label_percent").innerHTML = money_format((purchase_val * perc_dp) / 100);
        document.getElementById("gastos_cierre_percent_label").innerHTML = money_format((purchase_val * perc_gastos) / 100);
        // // Lógica de visibilidad (Ajustada para los nuevos IDs)
        // if (document.getElementById("process_type").value == "non_qm") {
        //     document.getElementById("estatus_legal").parentElement.classList.remove("d-none");
        // } else {
        //     document.getElementById("estatus_legal").parentElement.classList.add("d-none");
        // }

        document.querySelector(".primer-comprador-field").classList.remove("d-none");

        if (document.getElementById("primer_comprador").value == "si" && document.getElementById("process_type").value == "non_qm") {
            document.getElementById("forma_pago").parentElement.parentElement.classList.remove("d-none");
        } else {
            document.getElementById("forma_pago").parentElement.parentElement.classList.add("d-none");
        }

        if (document.getElementById("process_type").value == "income_check") {
            load_income_section(resultado, resParsed['detalle_ingresos']);
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


function load_income_section(info, ingresos) {
    var purchase_val = document.getElementById("monto_max").value != "" ? parseMoneyAux(document.getElementById("monto_max").value) : 0;
    var perc_dp = document.getElementById("down_payment").value != "" ? parseFloat(document.getElementById("down_payment").value) : 0;

    document.getElementById("total_requerido_label").parentElement.classList.add("d-none");
    document.querySelector(".programa_container").classList.remove("d-none");
    document.getElementById("monto_max_label").innerHTML = "Purchase price:";
    document.getElementById("tabla_income_info").classList.remove("d-none");

    document.getElementById("loan_amount_compra").value = money_format(purchase_val - ((purchase_val * perc_dp) / 100));

    // Limpiar el contenedor antes de cargar para evitar duplicados
    const container = document.getElementById('income_cards_container');
    if (container) container.innerHTML = "";

    ingresos.forEach(ing => {
        agregarTarjetaClienteDetail(ing);
    });
}

function agregarTarjetaClienteDetail(cliente) {
    // console.log(cliente);
    const idCliente = cliente['id_cliente_income'];
    const container = document.getElementById('income_cards_container');

    if (!container) return;

    const cardHtml = `
        <div class="card mb-2 shadow-sm cliente-card" id="cliente_${idCliente}">
            <div class="card-header p-1 bg-light">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="d-flex flex-column w-100 ps-2" onclick="toggleCollapse('body_${idCliente}')" style="cursor:pointer">
                        <div class="d-flex align-items-center gap-2">
                            <i class="fas fa-chevron-down mt-1" style="font-size: 10px;" id="icon_${idCliente}"></i>
                            <span class="fw-bold" style="font-size: 13px; line-height: 1.2;" id="header_name_${idCliente}">
                                ${cliente['client_name'].toUpperCase()} ${cliente['client_last_name'].toUpperCase()}
                            </span>
                        </div>
                        <div id="resumen_cliente_${idCliente}" style="font-size: 10px; margin-left: 18px; margin-top: 1px;">
                            <span class="text-success me-2" title="Total Income"><i class="fas fa-hand-holding-usd"></i> $0,00</span>
                            <span class="text-danger" title="Total Deudas"><i class="fas fa-credit-card"></i> $0,00</span>
                        </div>
                    </div>
                    <button type="button" class="btn btn-xs text-danger border-0 pe-2" onclick="document.getElementById('cliente_${idCliente}').remove();">×</button>
                </div>
            </div>
            <div class="card-body p-2" id="body_${idCliente}">
                <div class="d-flex justify-content-between mb-2 gap-2">
                    <input class="form-control form-control-sm cl-nombre" placeholder="Nombre" value="${cliente['client_name']}" oninput="updateHeader(${idCliente})">
                    <input class="form-control form-control-sm cl-apellido" placeholder="Apellido" value="${cliente['client_last_name']}" oninput="updateHeader(${idCliente})">
                </div>
                
                <div id="trabajos_container_${idCliente}"></div>
                
                <div class="mt-2 d-flex gap-2 border-top pt-2">
                    <button class="btn btn-xs btn-outline-info text-dark py-0" onclick="agregarTrabajo(${idCliente}, 'W2')">+ W2</button>
                    <button class="btn btn-xs btn-outline-secondary text-dark py-0" onclick="agregarTrabajo(${idCliente}, '1099')">+ 1099</button>
                </div>
            </div>
        </div>`;

    container.insertAdjacentHTML('beforeend', cardHtml);

    // --- CORRECCIÓN CRUCIAL: Cargar los trabajos existentes ---
    if (cliente['trabajos'] && cliente['trabajos'].length > 0) {
        cliente['trabajos'].forEach(trabajo => {
            // Llamamos a tu función agregarTrabajo pasando el monto que viene de la DB
            agregarTrabajoDetail(idCliente, trabajo.tipo, trabajo.income_calculado_mensual, trabajo);
        });
    }
}

function renderizarTarjetaClienteFull(container, datos) {
    // Generamos un ID único para la tarjeta y así poder referenciarla al añadir trabajos
    console.log("cargando clientes");
    const cardId = 'cliente_' + Math.floor(Math.random() * 100000);
    const card = document.createElement("div");
    card.className = "cliente-card mb-3 p-3 border rounded bg-light position-relative";
    card.id = cardId;

    // Estructura de la tarjeta
    card.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="m-0 text-primary"><i class="fas fa-user-tie"></i> Datos del Cliente</h6>
            <button type="button" class="btn btn-sm btn-outline-danger border-0" 
                    onclick="this.closest('.cliente-card').remove()" title="Eliminar cliente">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="row g-2 mb-2">
            <div class="col-6">
                <input type="text" class="form-control form-control-sm cl-nombre" 
                       placeholder="Nombre" value="${datos.nombre || ''}">
            </div>
            <div class="col-6">
                <input type="text" class="form-control form-control-sm cl-apellido" 
                       placeholder="Apellido" value="${datos.apellido || ''}">
            </div>
        </div>
        
        <div class="trabajos-container"></div>
        
        <div class="mt-2 d-flex gap-2">
            <button type="button" class="btn btn-xs btn-outline-primary" 
                    onclick="agregarFilaTrabajo('${cardId}', 'w2')">
                <i class="fas fa-plus"></i> W2
            </button>
            <button type="button" class="btn btn-xs btn-outline-success" 
                    onclick="agregarFilaTrabajo('${cardId}', '1099')">
                <i class="fas fa-plus"></i> 1099
            </button>
        </div>
    `;

    container.appendChild(card);

    // Si el cliente ya trae trabajos (al cargar desde la DB), los renderizamos de una vez
    const trabajosContainer = card.querySelector(".trabajos-container");
    if (datos.trabajos && datos.trabajos.length > 0) {
        datos.trabajos.forEach(trabajo => {
            // Pasamos el monto que viene del modelo (income_calculado_mensual)
            agregarFilaTrabajo(cardId, trabajo.tipo, trabajo.monto);
        });
    }
}

function agregarTrabajoDetail(idCliente, tipo, dataExistente = null, trabajo) {
    const idTrabajo = trabajo['id_trabajo'];
    const contenedor = document.getElementById(`trabajos_container_${idCliente}`);

    const nombreEmpresa = trabajo['empresa'] || '';
    const labelInicial = tipo === 'W2' ? (nombreEmpresa || 'Nueva Empresa') : 'Ingreso 1099';
    const esModoPaystub = trabajo['modo'] === 'paystubs';

    let html = `
        <div class="border rounded mb-2 bg-white shadow-xs job-item" id="job_${idTrabajo}">
            <div class="d-flex justify-content-between align-items-center p-2 bg-light-subtle border-bottom">
                <div class="d-flex align-items-center gap-2 w-100" onclick="toggleCollapse('job_body_${idTrabajo}')" style="cursor:pointer">
                    <i class="fas fa-chevron-down small-icon" id="icon_job_${idTrabajo}"></i>
                    <span class="badge ${tipo === 'W2' ? 'bg-info text-dark' : 'bg-secondary text-white'}">${tipo}</span>
                    <span class="small text-muted" id="job_label_${idTrabajo}">${labelInicial}</span>
                </div>
                
                <div class="d-flex align-items-center">
                    ${tipo === 'W2' ? `
                    <div class="form-check form-switch me-4" style="font-size: 11px; min-width: 90px;">
                        <input class="form-check-input" type="checkbox" ${esModoPaystub ? 'checked' : ''} onchange="toggleW2Mode(this, ${idTrabajo})"> 
                        <span class="ms-1">Paystubs</span>
                    </div>` : ''}
                    <button type="button" class="btn btn-xs text-danger border-0" onclick="eliminarTrabajo(${idTrabajo})">×</button>
                </div>
            </div>

            <div class="p-2 ${esModoPaystub ? '' : ''}" id="job_body_${idTrabajo}">
                ${tipo === 'W2' ? `
                    <input class="form-control form-control-sm mb-2" 
                           placeholder="Nombre Empresa" 
                           value="${nombreEmpresa}"
                           oninput="document.getElementById('job_label_${idTrabajo}').innerText = this.value || 'Nueva Empresa'">
                    <div id="area_dinamica_${idTrabajo}">
                        ${renderFormW2Detail(idTrabajo, trabajo)}
                    </div>
                ` : `
                    <div id="area_dinamica_${idTrabajo}">
                        ${renderForm1099Detail(idTrabajo, trabajo)}
                    </div>
                `}
            </div>
        </div>`;

    contenedor.insertAdjacentHTML('beforeend', html);

    // --- CARGA DE TAXES ---
    // Si el trabajo tiene el array de taxes, los agregamos uno por uno
    if (trabajo.taxes && trabajo.taxes.length > 0) {
        trabajo.taxes.forEach(t => {
            // Asegúrate de que agregarAnioImpuesto acepte (idTrabajo, anio, monto)
            agregarAnioImpuestoDetail(idTrabajo, t.anio, t.monto);
        });
    }

    if (esModoPaystub) {
        toggleW2Mode({ checked: true }, idTrabajo); // Para asegurar que se vea la sección paystub
    }

    if (typeof actualizarDiccionario === "function") {
        actualizarDiccionario();
    }
}

function renderFormW2Detail(id, trabajo) {
    const deuda = trabajo['deuda'] || "";
    const valorHora = trabajo['valor_hora'] || "";
    const horas = trabajo['horas_semanales'] || "";
    const freq = trabajo['frecuencia_anual'] || "52";
    const incomeMensual = trabajo['income_calculado_mensual'] || "0.00";
    const esModoPaystub = trabajo['modo'] === 'paystubs';

    return `
        <div id="taxes_w2_${id}" class="${esModoPaystub ? 'd-none' : ''}">
            <div id="tax_list_${id}"></div>
            <button type="button" class="btn btn-xs btn-outline-primary w-100 mb-1" style="font-size:10px" onclick="agregarAnioImpuestoDetail(${id})">+ Añadir Año Tax</button>
            <div class="row g-1 mb-2">
                <div class="col-6 small bg-light p-1 text-center border rounded">Average: <b>$ <span id="avg_display_${id}">0.00</span></b></div>
                <div class="col-6">
                    <input type="text" class="form-control form-control-sm cl-deuda" placeholder="Deuda" 
                           value="${money_format(deuda)}" onfocus="focusMoney(this)" onblur="blurMoney(this)">
                </div>
            </div>
        </div>
        <div id="paystubs_w2_${id}" class="${esModoPaystub ? '' : 'd-none'} mt-2">
            <div class="row g-1 text-center">
                <div class="col-4">
                    <label style="font-size:9px">$/Hora</label>
                    <input type="text" class="form-control form-control-sm text-center cl-valor-hora" 
                           placeholder="0" value="${money_format(valorHora)}" onfocus="focusMoney(this)" onblur="blurMoney(this)" oninput="calcPS(${id})">
                </div>
                <div class="col-4">
                    <label style="font-size:9px">Horas</label>
                    <input type="number" class="form-control form-control-sm text-center cl-horas" 
                           placeholder="0" value="${horas}" oninput="calcPS(${id})">
                </div>
                <div class="col-4">
                    <label style="font-size:9px">Freq (Sems)</label>
                    <input type="number" class="form-control form-control-sm text-center cl-freq" 
                           placeholder="52" value="${freq}" oninput="calcPS(${id})">
                </div>
                <div class="col-12 mt-1">
                    <input type="text" class="form-control form-control-sm cl-deuda-ps" placeholder="Deuda" 
                           value="${money_format(deuda)}" onfocus="focusMoney(this)" onblur="blurMoney(this)">
                </div>
                <div class="col-12 mt-1 small bg-success-subtle p-1 border rounded">
                    Income Mensual: <b>$ <span id="ps_res_${id}">${money_format(incomeMensual)}</span></b>
                </div>
            </div>
        </div>`;
}

function renderForm1099Detail(id, trabajo) {
    const fico = trabajo['fico'] || "";
    const deuda = trabajo['deuda'] || "";
    const estatus = trabajo['estatus_legal'] || "";

    return `
        <div id="tax_list_${id}"></div>
        <button type="button" class="btn btn-xs btn-outline-primary w-100 mb-1" style="font-size:10px" onclick="agregarAnioImpuestoDetail(${id})">+ Añadir Año Tax</button>
        <div class="row g-1 mb-1 mt-2">
            <div class="col-6 small bg-light p-1 text-center border rounded">AVG: <b>$<span id="avg_display_${id}">0.00</span></b></div>
            <div class="col-6">
                <input class="form-control form-control-sm cl-fico" placeholder="FICO" value="${fico}" oninput="actualizarDiccionario()">
            </div>
            <div class="col-12 mb-1">
                <input type="text" class="form-control form-control-sm cl-deuda" placeholder="Deuda" 
                       value="${money_format(deuda)}" onfocus="focusMoney(this)" onblur="blurMoney(this)">
            </div>
            <div class="col-12">
                <select class="form-select form-select-sm cl-estatus" onchange="actualizarDiccionario()">
                    <option value="">Estatus legal</option>
                    <option value="ciudadano" ${estatus === 'ciudadano' ? 'selected' : ''}>Ciudadano</option>
                    <option value="residente" ${estatus === 'residente' ? 'selected' : ''}>Residente</option>
                    <option value="permiso_trabajo" ${estatus === 'permiso_trabajo' ? 'selected' : ''}>Permiso de trabajo</option>
                    <option value="tax_id" ${estatus === 'tax_id' ? 'selected' : ''}>Tax id</option>
                </select>
            </div>
        </div>`;
}

function agregarAnioImpuestoDetail(idTrabajo, anio = "", monto = "") {
    const contenedor = document.getElementById(`tax_list_${idTrabajo}`);
    const idTax = Date.now() + Math.floor(Math.random() * 1000); // ID único para la fila

    const html = `
        <div class="d-flex gap-1 mb-1 align-items-center" id="tax_row_${idTax}">
            <input type="number" 
                   class="form-control form-control-sm w-50" 
                   placeholder="Año" 
                   value="${anio}">  
            
            <input type="text" 
                   class="form-control form-control-sm w-50 tax-value-${idTrabajo}" 
                   placeholder="Monto $" 
                   value="${monto ? money_format(monto) : ''}"
                   onfocus="focusMoney(this)" 
                   onblur="blurMoney(this); calcularAverage(${idTrabajo})">
            
            <button type="button" class="btn btn-xs text-danger p-0 border-0" 
                    onclick="document.getElementById('tax_row_${idTax}').remove(); calcularAverage(${idTrabajo})">×</button>
        </div>`;

    contenedor.insertAdjacentHTML('beforeend', html);

    // Si estamos cargando datos, recalculamos el promedio de inmediato
    if (monto !== "") {
        calcularAverage(idTrabajo);
    }
}





function load_gestion_modal_info(ev) {

    $.ajax({
        type: "POST",
        url: "index.php?c=gestion&a=get_gestion_info",
        data: {
            "id_gestion": ev.target.querySelector("span").innerHTML
        }
    }).done(function (result) {
        var resultado = JSON.parse(result)["gestion_info"][0];
        var notas = JSON.parse(result)['notas'];
        var deudas = JSON.parse(result)['deudas']
        var historial = JSON.parse(result)['historial'];
        document.getElementById("old_info_gestion").innerHTML = JSON.stringify(JSON.parse(result)["gestion_info"][0]);

        document.getElementById("modal_id_gestion").innerHTML = resultado['id_gestion'];

        document.getElementById("asesor_name").innerHTML = "Asesor: " + resultado['user_name'] + " " + resultado['user_last_name'];

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
            input.value = i == 0 ? resultado['name'].replace(/\b\w/g, l => l.toUpperCase()) : i == 1 ? resultado['last_name'].replace(/\b\w/g, l => l.toUpperCase()) : i == 2 ? resultado['phone'] : i == 3 ? resultado['property_address'] : i == 4 ? money_format(resultado['property_value']) : i == 5 ? resultado['interes_actual'] : i == 6 ? money_format(resultado['mortgage']) : i == 8 ? resultado['ltv'] : i == 9 ? resultado['interes_estimado'] : i == 10 ? resultado['prepayment_penalty'] : i == 11 ? resultado['gastos_cierre'] : i == 12 ? money_format(resultado['loan_amount']) : money_format(resultado['cash_out']);
            i++;
        })

        document.getElementById("ltv_percent_value").innerHTML = money_format(resultado['loan_amount']);
        document.getElementById("gastos_cierre_percent_value").innerHTML = money_format(parseFloat(resultado['property_value']) * parseFloat(resultado["gastos_cierre"]) / 100);
        document.getElementById("prepayment_penalty_percent_value").innerHTML = money_format((parseFloat(resultado['mortgage']) * parseFloat(resultado['prepayment_penalty'])) / 100);
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

        if (opt_selected == 'cambiar nombre de columna') {
            change_column_name(ev.target.parentElement.parentElement.querySelector(".task-title-text"), opt_selected, column);
        }
    }
})


function change_column_name(column, opt, oldname) {

    column.parentElement.parentElement.querySelector(".points_clickeable").click();
    column.parentElement.parentElement.querySelector(".points_clickeable").style.visibility = "hidden";
    column.innerHTML = "";
    column.parentElement.querySelector(".task_cant").classList.add("d-none");
    var input = document.createElement("input");
    var btn = document.createElement("button");
    btn.className = "btn btn-primary";
    btn.innerHTML = "<i class='fas fa-check'></i>";
    var btn_deny = document.createElement("button");
    btn_deny.className = "btn btn-danger";
    btn_deny.innerHTML = "<i class='fas fa-times'></i>";
    input.className = "form-control";
    input.style.width = "150px";
    input.placeholder = "Nuevo nombre";
    column.classList.add("d-flex");
    column.classList.add("flex-row");
    column.appendChild(input);
    column.appendChild(btn);
    column.appendChild(btn_deny);
    input.focus();

    btn_deny.onclick = function () {
        column.parentElement.parentElement.querySelector(".points_clickeable").style.visibility = "visible";
        column.removeChild(input);
        column.removeChild(btn);
        column.removeChild(btn_deny);
        column.innerHTML = oldname;
        column.parentElement.querySelector(".task_cant").classList.remove("d-none");
    }


    btn.onclick = function () {
        var input_name = input.value;
        if (input_name == "") {
            input.style.border = "red solid 2px";
        }
        else {
            column.parentElement.parentElement.querySelector(".points_clickeable").style.visibility = "visible";
            column.removeChild(input);
            column.removeChild(btn);
            column.removeChild(btn_deny);
            column.innerHTML = input_name;
            column.parentElement.querySelector(".task_cant").classList.remove("d-none");
            $.ajax({
                type: "POST",
                url: "index.php?c=boards&a=change_board_order",
                data: {
                    "id_board": document.getElementById("board_id").innerHTML,
                    "column": oldname,
                    "opt": opt,
                    "new_name": input_name
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
    }


}

function parseMoney(value) {
    if (!value) return 0;
    if (typeof value === 'number') return value;
    let cleanValue = value.toString().replace(/\./g, '').replace(',');
    cleanValue = value.toString().replace(/\./g, ',').replace('.');
    let parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? 0 : parsed;
}

function parseMoneyAux(value) {
    if (!value) return 0;
    if (typeof value === 'number') return value;
    let cleanValue = value.toString().replace(/\./g, '').replace(',', '.');
    let parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? 0 : parsed;
}

function money_format(num) {
    num = parseMoney(num);
    if (isNaN(num)) num = 0;
    return num.toLocaleString('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


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

// Función para el buscador interno de cada pestaña
function searchInTab(input) {
    const text = input.value.toLowerCase();
    const container = input.closest('.tab-pane').querySelector('.options-list');
    const items = container.querySelectorAll('.dropdown-item');

    items.forEach(item => {
        const label = item.querySelector('label').innerText.toLowerCase();
        item.style.display = label.includes(text) ? 'block' : 'none';
    });
}

// Función maestra para ocultar/mostrar tickets en el Kanban
function applyBoardFilters() {
    // 1. Obtener valores de los checkboxes
    const selectedAgents = Array.from(document.querySelectorAll('.filter-check-agent:checked')).map(cb => cb.value.toString());
    const selectedStatus = Array.from(document.querySelectorAll('.filter-check-status:checked')).map(cb => cb.value.toUpperCase());

    // 2. Obtener el valor de la barra de búsqueda (Texto)
    const searchInput = document.getElementById('searchInputTasks');
    const searchText = searchInput ? searchInput.value.toLowerCase() : "";

    document.querySelectorAll('.task-container').forEach(ticket => {
        // Datos del ticket para checkboxes
        const agentId = (ticket.getAttribute('data-user-id') || "").toString();
        const status = (ticket.getAttribute('data-status') || "").toUpperCase();
        
        // Datos del ticket para búsqueda por nombre (el texto visible)
        const taskName = (ticket.textContent || ticket.innerText).toLowerCase();

        // Lógica de coincidencia TRIPLE
        const matchesAgent = selectedAgents.length === 0 || selectedAgents.includes(agentId);
        const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(status);
        const matchesSearch = searchText === "" || taskName.includes(searchText);

        // Mostrar solo si CUMPLE LAS TRES CONDICIONES
        if (matchesAgent && matchesStatus && matchesSearch) {
            ticket.classList.remove('d-none');
            ticket.style.display = "block";
        } else {
            ticket.classList.add('d-none');
            ticket.style.display = "none";
        }
    });

    // Actualizar contadores de las columnas
    if (typeof updateTaskCounts === 'function') {
        updateTaskCounts();
    } else if (typeof updateColumnCounters === 'function') {
        updateColumnCounters();
    }
}
function filterTasksByName() {

    let input = document.getElementById('searchInputTasks');
    let filter = input.value.toLowerCase();
    
    let tasks = document.querySelectorAll('.task-container');

    tasks.forEach(task => {
        let taskText = task.textContent || task.innerText;

        if (taskText.toLowerCase().indexOf(filter) > -1) {
            task.style.display = ""; 
            task.classList.remove('d-none'); 
        } else {
            task.style.display = "none"; 
            task.classList.add('d-none');
        }
    });

    updateColumnCounters();
}

function updateColumnCounters() {
    let columns = document.querySelectorAll('.task-column');
    
    columns.forEach(col => {
        let visibleTasks = col.querySelectorAll('.task-container:not(.d-none)').length;
        let counterSpan = col.querySelector('.task_cant');
        if (counterSpan) {
            counterSpan.textContent = visibleTasks;
        }
    });
}