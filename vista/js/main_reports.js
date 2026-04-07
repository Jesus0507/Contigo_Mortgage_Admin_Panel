document.addEventListener("DOMContentLoaded", function () {

    // 1. Manejo de apertura/cierre de menús (Acordeón) - SE MANTIENE TU LÓGICA ORIGINAL
    const filtrosHeaders = document.querySelectorAll(".filtros-header");
    filtrosHeaders.forEach((header) => {
        header.addEventListener("click", function (e) {
            const container = this.closest(".statistics-filter");
            const body = container.querySelector(".filtros-body-reportes");
            const icon = this.querySelector(".filtro-icon-reportes");

            document.querySelectorAll(".filtros-body-reportes").forEach(otherBody => {
                if (otherBody !== body) {
                    otherBody.classList.add("d-none");
                    const otherIcon = otherBody.parentElement.querySelector(".filtro-icon-reportes");
                    if (otherIcon) otherIcon.innerHTML = "keyboard_arrow_down";
                }
            });

            const isHidden = body.classList.contains("d-none");
            if (isHidden) {
                body.classList.remove("d-none");
                icon.innerHTML = "keyboard_arrow_up";
            } else {
                body.classList.add("d-none");
                icon.innerHTML = "keyboard_arrow_down";
            }
        });
    });

    // 2. Lógica de Selección (Checkbox) + Función "Todos" y Correlación
    document.querySelectorAll(".options-list").forEach(list => {
        list.addEventListener("click", function (e) {
            const item = e.target.closest(".report-option-item");
            if (!item) return;

            if (e.target.tagName !== 'INPUT') {
                const checkbox = item.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        });

        // Evento para manejar el check de "Todos" y disparar correlación
        list.addEventListener("change", function (e) {
            const target = e.target;

            // Lógica de "Seleccionar Todos"
            if (target.classList.contains('check-all')) {
                const isChecked = target.checked;
                const siblingCheckboxes = this.querySelectorAll('input[type="checkbox"]:not(.check-all)');
                siblingCheckboxes.forEach(cb => {
                    const parentItem = cb.closest('.report-option-item');
                    if (!parentItem.classList.contains('d-none')) { // Solo afectar visibles
                        cb.checked = isChecked;
                    }
                });
            }

            // Disparar Correlación si cambian los tipos o tablas
            const containerId = this.closest(".statistics-filter").id;
            if (containerId === "container_tipo_tabla" || containerId === "container_tablas") {
                aplicarCorrelacion();
            }
        });
    });

    // 3. Función de Correlación (Filtros en Cascada)
    function aplicarCorrelacion() {
        // const tiposMarcados = Array.from(document.querySelectorAll("#container_tipo_tabla input[type='checkbox']:checked:not(.check-all)")).map(cb => cb.value);

        // // Filtrar Tablas según Tipo
        // const itemsTablas = document.querySelectorAll("#container_tablas .report-option-item:not(.bg-light)");
        // itemsTablas.forEach(item => {
        //     const relacion = item.getAttribute("data-relacion");
        //     const checkbox = item.querySelector("input");

        //     if (tiposMarcados.length === 0 || tiposMarcados.includes(relacion)) {
        //         item.classList.remove("d-none");
        //         item.style.display = "flex";
        //     } else {
        //         item.classList.add("d-none");
        //         item.style.display = "none";
        //         checkbox.checked = false; // Desmarcar si se oculta
        //     }
        // });
    }

    // 4. Buscador en tiempo real - SE MANTIENE TU LÓGICA ORIGINAL
    document.querySelectorAll(".busqueda-filtro").forEach((input) => {
        input.addEventListener("keyup", function () {
            const term = this.value.toLowerCase().trim();
            const container = this.closest(".filtros-body-reportes");
            const items = container.querySelectorAll(".report-option-item:not(.bg-light)");

            items.forEach((item) => {
                const text = item.querySelector(".option-label").textContent.toLowerCase();
                if (text.includes(term)) {
                    item.classList.remove("d-none");
                    item.style.display = "flex";
                } else {
                    item.classList.add("d-none");
                    item.style.display = "none";
                }
            });
        });
        input.addEventListener("click", (e) => e.stopPropagation());
    });

    // 5. Generación de Reporte
    const btnGenerar = document.getElementById("btn_generar_reporte");
    if (btnGenerar) {
        btnGenerar.addEventListener("click", function () {
            const getSelected = (id) => Array.from(document.querySelectorAll(`${id} input[type="checkbox"]:checked:not(.check-all)`)).map(cb => cb.value);

            const dataPost = {
                tipos: getSelected("#container_tipo_tabla"),
                tablas: getSelected("#container_tablas"),
                agentes: getSelected("#container_agentes"),
                estados: getSelected("#container_estado"),
                clientes: getSelected("#container_clientes"),
                fecha_inicio: document.getElementById("rep_fecha_inicio")?.value || null,
                fecha_fin: document.getElementById("rep_fecha_fin")?.value || null
            };
            if (!dataPost.fecha_inicio || !dataPost.fecha_fin) {
                Swal.fire({
                    title: 'Atención',
                    text: 'Seleccione un rango de fechas por favor',
                    icon: 'warning',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#3085d6' // Un azul acorde al botón de tu captura
                });
                return;
            }

            const previewDiv = document.getElementById("report_preview");
            previewDiv.innerHTML = `<div class="text-center my-4"><div class="spinner-border text-primary"></div></div>`;
            console.log(dataPost);
            $.ajax({
                url: 'index.php?c=main&a=get_report_preview_data',
                method: 'POST',
                data: dataPost,
                dataType: 'json',
                success: (res) => construirTablaPreview(res),
                error: (xhr) => console.error(xhr.responseText)
            });
        });
    }
    function construirTablaPreview(datos) {
        const previewDiv = document.getElementById("report_preview");
        document.getElementById("report_preview_buttons").classList.remove("d-none");

        // Validar si hubo un error de SQL capturado por el catch del modelo
        if (datos.error) {
            previewDiv.innerHTML = `<div class="alert alert-danger">Error: ${datos.error}</div>`;
            return;
        }

        if (datos.length === 0) {
            previewDiv.innerHTML = '<div class="alert alert-info">Sin resultados para los filtros seleccionados</div>';
            return;
        }

        let html = `
        <div class="table-responsive mt-4">
            <table class="table table-hover table-sm border align-middle" style="font-size: 0.85rem;">
                <thead class="table-light">
                    <tr>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Tabla / Tipo</th>
                        <th>Estado</th>
                        <th>Loan Amount</th>
                        <th>Valor Propiedad</th>
                        <th>Agente</th>
                    </tr>
                </thead>
                <tbody>`;

        datos.forEach(row => {
            // Formatear montos a moneda local
            const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
            const loan = row.loan_amount ? formatter.format(row.loan_amount) : '$0.00';

            // El tipo de tabla lo limpiamos un poco para la vista
            const tipoLimpio = row.tipo_tabla === 'gestion_clientes' ? 'Gestión' : 'Compras';

            html += `
            <tr>
                <td>${row.date_created.split(' ')[0]}</td>
                <td><strong>${row.cliente_nombre} ${row.cliente_apellido}</strong></td>
                <td>
                    <div class="small text-muted">${row.board_nombre}</div>
                    <span class="badge bg-secondary" style="font-size: 0.7rem;">${tipoLimpio}</span>
                </td>
                <td><span class="badge bg-info text-dark text-uppercase">${row.etapa_actual}</span></td>
                <td class="fw-bold text-success">${loan}</td>
                <td>${row.propiedad_valor || 'N/A'}</td>
                <td>${row.agente_nombre} ${row.agente_apellido}</td>
            </tr>`;
        });

        html += '</tbody></table></div>';
        previewDiv.innerHTML = html;
    }

    // Inyectar Estilos
    const css = `
        .filtros-body-reportes { max-height: 250px; overflow-y: auto; box-shadow: 0 5px 15px rgba(0,0,0,0.1); border: 1px solid #ddd; position: absolute; z-index: 1050; background: white; min-width: 100%; border-radius: 4px; }
        .report-option-item { padding: 7px 12px; cursor: pointer; border-bottom: 1px solid #eee; transition: background 0.2s ease; display: flex; align-items: center; }
        .report-option-item:hover { background-color: #f1f4f9; }
        .statistics-filter { position: relative; }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
});

function changeBoardType(el) {
    var tipo_tabla = el.value;
    var is_checked = el.checked;

    change_filters_visibility(is_checked, "container_tablas", tipo_tabla == "all", tipo_tabla, "relation", false);
    change_filters_visibility(is_checked, "container_estado", tipo_tabla == "all", tipo_tabla, "typeboard", false);
    change_user_filter_visibility(tipo_tabla);

}

function change_filters_visibility(visibility, container, is_all, tipo_tabla, dataset_info, is_array_info) {
    var filter_content = document.getElementById(container);
    var all_checkbox = filter_content.querySelectorAll('input[type="checkbox"]');



    Array.from(all_checkbox).forEach((el_checkbox) => {
        console.log(el_checkbox.dataset[dataset_info]);
        var compare_dataset = el_checkbox.dataset[dataset_info];

        // if (is_array_info) {
        //     var array_datasets = el_checkbox.dataset[dataset_info].split(",");
        //     array_datasets.forEach((arr_data) => {
        //         console.log(arr_data.split("-")[0], " - ", tipo_tabla);
        //         if (arr_data.split("-")[0] == tipo_tabla) {
        //             compare_dataset = tipo_tabla;
        //         }
        //     })

        // }
        if (is_all || tipo_tabla == compare_dataset) {
            el_checkbox.checked = visibility;
            visibility ? el_checkbox.parentElement.classList.remove("d-none") : el_checkbox.parentElement.classList.add("d-none");
        }
    });

}

function change_user_filter_visibility() {
    var filter_content = document.getElementById("container_agentes");
    var all_checkbox = filter_content.querySelectorAll('input[type="checkbox"]');
    var filter_content_boards = document.getElementById("container_tablas");
    var all_checkbox_boards = filter_content_boards.querySelectorAll('input[type="checkbox"]');
    var all_active_boards = [];


    Array.from(all_checkbox_boards).forEach((b_check) => {
        if (b_check.checked == true) all_active_boards.push(b_check);
    })


    Array.from(all_checkbox).forEach((el_checkbox) => {
        if (el_checkbox != all_checkbox[0]) {
            el_checkbox.checked = false;
            el_checkbox.parentElement.classList.add("d-none");
        }
    })

    Array.from(all_checkbox).forEach((el_checkbox) => {
        if (el_checkbox != all_checkbox[0]) {

            var array_datasets = el_checkbox.dataset["relation"].split(",");
            array_datasets.forEach((arr_data) => {
                all_active_boards.forEach((act) => {
                    if (arr_data.split("-")[1] == act.value && arr_data.split("-")[0] == act.dataset['relation']) {
                        el_checkbox.checked = true;
                        el_checkbox.parentElement.classList.remove("d-none");
                    }
                })
            })


        }
    })



}
// --- EXPORTAR A EXCEL ---
const btnExcel = document.getElementById("btn_export_excel"); // Asegúrate de que este sea el ID de tu botón
if (btnExcel) {
    btnExcel.addEventListener("click", function () {
        const tabla = document.querySelector("#report_preview table");

        if (!tabla) {
            Swal.fire('Error', 'No hay datos para exportar. Genera el reporte primero.', 'error');
            return;
        }

        // Crear libro de trabajo y hoja
        const wb = XLSX.utils.table_to_book(tabla, { sheet: "Reporte Contigo" });

        // Descargar el archivo
        XLSX.writeFile(wb, `Reporte_Contigo_${new Date()}.xlsx`);
    });
}

// --- EXPORTAR A PDF ---
const btnPdf = document.getElementById("btn_export_pdf"); // Asegúrate de que este sea el ID de tu botón
if (btnPdf) {
    btnPdf.addEventListener("click", function () {
        const tabla = document.querySelector("#report_preview table");

        if (!tabla) {
            Swal.fire('Error', 'No hay datos para exportar. Genera el reporte primero.', 'error');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('l', 'pt', 'a4'); // 'l' para horizontal (landscape) para que quepan todas las columnas

        // Título del PDF
        doc.setFontSize(18);
        doc.text("Reporte de Gestión y Compras", 40, 40);
        doc.setFontSize(11);
        doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, 40, 60);

        // Generar la tabla automáticamente desde el HTML
        doc.autoTable({
            html: tabla,
            startY: 80,
            theme: 'striped',
            headStyles: { fillColor: [48, 133, 214] }, // Azul similar al de tus botones
            styles: { fontSize: 9 },
            margin: { top: 80 }
        });

        // Guardar
        doc.save(`Reporte_Contigo_${new Date()}.pdf`);
    });
}