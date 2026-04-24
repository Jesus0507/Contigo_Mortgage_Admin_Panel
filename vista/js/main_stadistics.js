document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("graficos_opt").onclick = function () {
        document.getElementById("graficos_opt").classList.add("selected");
        document.getElementById("reportes_opt").classList.remove("selected");
        document.getElementById("graficos_container").classList.remove("d-none");
        document.getElementById("reportes_container").classList.add("d-none");
    }

    document.getElementById("reportes_opt").onclick = function () {
        document.getElementById("reportes_opt").classList.add("selected");
        document.getElementById("graficos_opt").classList.remove("selected");
        document.getElementById("graficos_container").classList.add("d-none");
        document.getElementById("reportes_container").classList.remove("d-none");
    }

    document.getElementById("filtros_header").onclick = function () {
        if (document.getElementById("filtros_body").classList.contains("d-none")) {
            document.getElementById("filtros_body").classList.remove("d-none");
            document.getElementById("graficos_section_container").style.bottom = "336px";
            document.getElementById("filter_icon").innerHTML = "keyboard_arrow_up";
        }
        else {
            document.getElementById("filtros_body").classList.add("d-none");
            document.getElementById("graficos_section_container").style.bottom = "0px";
            document.getElementById("filter_icon").innerHTML = "keyboard_arrow_down";
        }
    }


    filters_activation();
    get_cartera_total_data();
    get_distribucion_prestamos();
    get_comparativa_valores();
    get_meta_cierre_mensual();
    get_ranking_agentes();
    get_embudo_ventas();
    get_velocidad_cierre();
    get_carga_boards();
});

function filters_activation() {
    var checks_divs = document.getElementById("filtros_body").querySelectorAll("div");
    var all_container_graficos = document.querySelectorAll(".container-grafico-card");
    Array.from(checks_divs).forEach((checkDiv) => {
        checkDiv.onclick = function (ev) {
            var check_input = ev.target.querySelector("input") != null ? ev.target.querySelector("input") : ev.target.parentElement.querySelector("input");
            var check_label = ev.target.querySelector("label") != null ? ev.target.querySelector("label") : ev.target.parentElement.querySelector("label");
            check_input.checked = !check_input.checked;

            switch (check_label.innerText.toLowerCase()) {
                case "todos":
                    if (check_input.checked == true) {
                        Array.from(checks_divs).forEach((cd) => {
                            if (cd != checkDiv) cd.querySelector("input").checked = true;
                        });
                        Array.from(all_container_graficos).forEach((c) => { c.classList.remove("d-none") })
                    }
                    else {

                        Array.from(checks_divs).forEach((cd) => {
                            if (cd != checkDiv) cd.querySelector("input").checked = false;
                        });

                        Array.from(all_container_graficos).forEach((c) => { c.classList.add("d-none") })
                    }

                    break;
                case "cartera total":
                    check_input.checked == true ? all_container_graficos[0].classList.remove('d-none') : all_container_graficos[0].classList.add('d-none');
                    break;
                case "distribucion de programas de préstamo":
                    check_input.checked == true ? all_container_graficos[1].classList.remove('d-none') : all_container_graficos[1].classList.add('d-none');
                    break;
                case "valor de propiedad vs monto de préstamo":
                    check_input.checked == true ? all_container_graficos[2].classList.remove('d-none') : all_container_graficos[2].classList.add('d-none');
                    break;
                case "meta de cierre mensual":
                    check_input.checked == true ? all_container_graficos[3].classList.remove('d-none') : all_container_graficos[3].classList.add('d-none');
                    break;
                case "productividad por agente":
                    check_input.checked == true ? all_container_graficos[4].classList.remove('d-none') : all_container_graficos[4].classList.add('d-none');
                    break;
                case "embudo de ventas":
                    check_input.checked == true ? all_container_graficos[5].classList.remove('d-none') : all_container_graficos[5].classList.add('d-none');
                    break;
                case "tiempo promedio de cierre":
                    check_input.checked == true ? all_container_graficos[6].classList.remove('d-none') : all_container_graficos[6].classList.add('d-none');
                    break;
                case "volumen por pizarra":
                    check_input.checked == true ? all_container_graficos[7].classList.remove('d-none') : all_container_graficos[7].classList.add('d-none');
                    break;
                case "cierres de asesor por mes":
                    check_input.checked == true ? all_container_graficos[8].classList.remove('d-none') : all_container_graficos[8].classList.add('d-none');
                    break;
                case "procesos iniciados por mes":
                    check_input.checked == true ? all_container_graficos[9].classList.remove('d-none') : all_container_graficos[9].classList.add('d-none');
                    break;
                // case "procesos sin seguimiento":
                //     check_input.checked == true ? all_container_graficos[11].classList.remove('d-none') : all_container_graficos[11].classList.add('d-none');
                //     break;
                default:
                    check_input.checked == true ? all_container_graficos[10].classList.remove('d-none') : all_container_graficos[10].classList.add('d-none');
                    break;
            }



        }

    })


}





let datosCarteraProyeccion = [];
let datosCarteraReal = [];

function get_cartera_total_data() {
    $.ajax({
        type: "POST",
        url: "index.php?c=main&a=get_cartera_total_data",
    }).done(function (result) {
        try {
            const data = JSON.parse(result);

            // Guardamos ambos estados
            datosCarteraProyeccion = data.proyeccion;
            datosCarteraReal = data.real;

            // Renderizamos inicialmente con Proyección
            renderCarteraChart(data.labels, datosCarteraProyeccion);

        } catch (e) {
            console.error("Error en Cartera Total:", e);
        }
    });
}

function renderCarteraChart(labels, totals) {
    const ctx = document.getElementById('graficoCartera').getContext('2d');

    // Si ya existe el gráfico, lo destruimos para evitar solapamiento
    if (window.chartCarteraTotal) {
        window.chartCarteraTotal.destroy();
    }

    window.chartCarteraTotal = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Monto Total ($)',
                data: totals,
                backgroundColor: ['rgba(54, 162, 235, 0.7)', 'rgba(75, 192, 192, 0.7)'],
                borderColor: ['rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { callback: (v) => '$' + v.toLocaleString() }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: { label: (ctx) => 'Total: $' + ctx.raw.toLocaleString() }
                }
            }
        }
    });
}

// Función que se activa al mover el Switch
function toggleCartera(mostrarSoloReal) {
    const labels = ['Refinanciamientos (Gestión)', 'Compras de Vivienda'];
    const dataAMostrar = mostrarSoloReal ? datosCarteraReal : datosCarteraProyeccion;
    renderCarteraChart(labels, dataAMostrar);
}
function get_distribucion_prestamos() {

    const ctxPie = document.getElementById('graficoProgramas').getContext('2d');

    $.ajax({
        type: "POST",
        url: "index.php?c=main&a=get_distribucion_prestamos",
        data: {},
    }).done(function (result) {
        //  console.log(result);
        const dataParsed = JSON.parse(result);

        new Chart(ctxPie, {
            type: 'pie',
            data: {
                labels: dataParsed.labels,
                datasets: [{
                    data: dataParsed.data,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#C9CBCF'
                    ],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                let label = context.label || '';
                                let value = context.raw || 0;
                                return ': ' + value + ' casos';
                            }
                        }
                    }
                }
            }
        });
    });
}

// 1. Declarar la variable fuera para que el botón de Excel pueda leerla
var chartSeguimiento = null;

// function updateSeguimientoChart() {
//     const busqueda = document.getElementById('busquedaGlobal').value;
//     const ctx = document.getElementById('graficoSeguimiento'); // Obtenemos el elemento directamente
//     const wrapper = document.getElementById('chart-area-wrapper');

//     $.ajax({
//         type: "POST",
//         url: "index.php?c=main&a=get_clientes_sin_seguimiento",
//         data: { agente_id: busqueda },
//     }).done(function (result) {
//         const dataParsed = JSON.parse(result);
//         const numDataPoints = dataParsed.labels.length;

//         // 2. CORRECCIÓN DEL SCROLL: 
//         // Si no hay datos, ocultamos el wrapper o bajamos la altura a 0
//         if (numDataPoints === 0) {
//             wrapper.style.height = '0px';
//             if (chartSeguimiento) chartSeguimiento.destroy();
//             return; // Salimos para que el botón de exportar sepa que no hay nada
//         }

//         // Calculamos altura dinámica para mantener el scroll funcional
//         const dynamicHeight = Math.max(500, numDataPoints * 55);
//         wrapper.style.height = dynamicHeight + 'px';

//         // 3. Limpiar instancia previa antes de crear la nueva
//         if (chartSeguimiento) {
//             chartSeguimiento.destroy();
//         }

//         // 4. Crear el nuevo gráfico y asignarlo a la variable global
//         chartSeguimiento = new Chart(ctx, {
//             type: 'bar',
//             data: {
//                 labels: dataParsed.labels,
//                 datasets: [{
//                     label: 'Días desde el último seguimiento',
//                     data: dataParsed.data,
//                     backgroundColor: 'rgba(255, 99, 132, 0.8)',
//                     borderColor: 'rgb(255, 99, 132)',
//                     borderWidth: 1,
//                     barThickness: 25
//                 }]
//             },
//             options: {
//                 indexAxis: 'y',
//                 responsive: true,
//                 maintainAspectRatio: false, // Vital para que respete el dynamicHeight
//                 plugins: {
//                     legend: { display: false },
//                     tooltip: { enabled: true }
//                 },
//                 scales: {
//                     y: {
//                         ticks: {
//                             autoSkip: false,
//                             padding: 15,
//                             font: { size: 11 }
//                         }
//                     },
//                     x: {
//                         beginAtZero: true,
//                         position: 'top',
//                         title: {
//                             display: true,
//                             text: 'Días de inactividad'
//                         }
//                     }
//                 },
//                 layout: {
//                     padding: { left: 10, right: 30, bottom: 20 }
//                 }
//             }
//         });
//     });
// }
function exportarExcelSeguimiento() {
    // Buscamos la instancia del gráfico directamente en el canvas
    const chartInstance = Chart.getChart("graficoSeguimiento");

    if (!chartInstance || chartInstance.data.labels.length === 0) {
        Swal.fire({
            title: 'Atención',
            text: 'No hay datos visibles en el gráfico para exportar',
            icon: 'warning',
            confirmButtonColor: '#6777ef'
        });
        return;
    }

    const labels = chartInstance.data.labels;
    const diasData = chartInstance.data.datasets[0].data;

    // Mapeo de datos (Considerando que label puede ser array por el multilínea)
    const excelData = labels.map((label, index) => {
        let nombreC, agenteC;

        if (Array.isArray(label)) {
            nombreC = label[0];
            agenteC = label[1] ? label[1].replace("Agente: ", "") : "N/A";
        } else {
            const partes = label.split(' (Agente: ');
            nombreC = partes[0];
            agenteC = partes[1] ? partes[1].replace(')', '') : 'N/A';
        }

        return {
            "Nombre del Cliente": nombreC.toUpperCase(),
            "Correo del Agente": agenteC,
            "Días sin Seguimiento": diasData[index]
        };
    });

    // Generación del archivo
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Seguimiento");

    // Ajuste de columnas
    worksheet['!cols'] = [{ wch: 40 }, { wch: 40 }, { wch: 20 }];

    XLSX.writeFile(workbook, `Reporte_Seguimiento_Contigo.xlsx`);
}
// Carga inicial
// $(document).ready(function () {
//     updateSeguimientoChart();
// });

function get_comparativa_valores() {

    const ctxArea = document.getElementById('graficoAreas').getContext('2d');

    $.ajax({
        type: "POST",
        url: "index.php?c=main&a=get_comparativa_valores",
        data: {},
    }).done(function (result) {
        //  console.log(result);
        try {
            const dataParsed = JSON.parse(result);

            new Chart(ctxArea, {
                type: 'line', // Usamos 'line' con fill para efecto de área
                data: {
                    labels: dataParsed.labels,
                    datasets: [{
                        label: 'Valor Propiedad',
                        data: dataParsed.valores,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Azul transparente
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2,
                        fill: true, // Esto lo convierte en gráfico de área
                        tension: 0.4 // Curva suave
                    },
                    {
                        label: 'Monto Préstamo',
                        data: dataParsed.prestamos,
                        backgroundColor: 'rgba(255, 99, 132, 0.4)', // Rojo más sólido
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function (value) {
                                    return '$' + value.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
        } catch (e) {
            console.error("Error procesando datos:", result);
        }
    });
}
function get_meta_cierre_mensual() {
    const canvasElement = document.getElementById('graficoGauge');
    if (!canvasElement) return;

    const ctxGauge = canvasElement.getContext('2d');

    $.ajax({
        type: "POST",
        url: "index.php?c=main&a=get_meta_cierre_mensual",
    }).done(function (result) {
        try {
            const res = JSON.parse(result);
            console.log(res.meta);

            // CORRECCIÓN: Limpieza de formato europeo/latino (950.000,00 -> 950000.00)
            // 1. Convertimos a string por seguridad
            // 2. Quitamos todos los puntos (separadores de miles)
            // 3. Cambiamos la coma por un punto (separador decimal para JS)
            let metaRaw = res.meta.toString().replace(/\./g, '').replace(',', '.');
            let actualRaw = res.actual.toString().replace(/\./g, '').replace(',', '.');

            const alcanzado = parseFloat(actualRaw) || 0;
            const meta = parseFloat(metaRaw) || 50000;
            const restante = (meta - alcanzado) > 0 ? (meta - alcanzado) : 0;

            // Formateamos para la etiqueta visual (usando formato US para coherencia con el símbolo $)
            document.getElementById('gaugeText').innerText =
                `$${alcanzado.toLocaleString('en-US')} / $${meta.toLocaleString('en-US')}`;

            if (window.myGaugeChart) {
                window.myGaugeChart.destroy();
            }

            window.myGaugeChart = new Chart(ctxGauge, {
                type: 'doughnut',
                data: {
                    labels: ['Alcanzado', 'Restante'],
                    datasets: [{
                        data: [alcanzado, restante],
                        backgroundColor: ['#28a745', '#e9ecef'],
                        borderWidth: 0
                    }]
                },
                options: {
                    rotation: -90,
                    circumference: 180,
                    cutout: '80%',
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 2,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            enabled: true,
                            callbacks: {
                                label: function (context) {
                                    return context.label + ': $' + context.raw.toLocaleString('en-US');
                                }
                            }
                        }
                    }
                }
            });
        } catch (e) {
            console.error("Error procesando JSON de Meta:", e);
        }
    });
}

function loadMonthlyAgentCharts() {
    $.ajax({
        type: "POST",
        url: "index.php?c=main&a=get_monthly_agent_stats",
    }).done(function (result) {
        try {
            const data = JSON.parse(result);
            const mesesLabels = data.meses_labels;
            const colores = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796', '#5a5c69'];

            const formatData = (rawData, key) => {
                const map = {};
                rawData.forEach(row => {
                    if (!map[row.agente]) map[row.agente] = new Array(12).fill(0);
                    map[row.agente][row.mes - 1] = parseInt(row[key]);
                });
                return Object.keys(map).map((agente, i) => ({
                    label: agente,
                    data: map[agente],
                    borderColor: colores[i % colores.length],
                    backgroundColor: 'transparent',
                    tension: 0.3,
                    pointRadius: 3
                }));
            };

            // --- 1. Gráfico de Cierres ---
            const ctxCierres = document.getElementById('chartCierresAgente');
            if (ctxCierres) {
                if (window.chartCierres) window.chartCierres.destroy(); // Destruir si ya existe
                window.chartCierres = new Chart(ctxCierres, {
                    type: 'line',
                    data: { labels: mesesLabels, datasets: formatData(data.cierres_por_agente, 'total_cierres') },
                    options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
                });
            }

            // --- 2. Gráfico de Inicios ---
            const ctxIniciados = document.getElementById('chartIniciadosAgente');
            if (ctxIniciados) {
                if (window.chartIniciados) window.chartIniciados.destroy(); // Destruir si ya existe
                window.chartIniciados = new Chart(ctxIniciados, {
                    type: 'line',
                    data: { labels: mesesLabels, datasets: formatData(data.iniciados_por_agente, 'total_iniciados') },
                    options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
                });
            }

            // --- 3. Gráfico de Financiamientos ($) ---
            const ctxFin = document.getElementById('chartFinanciamientoMensual');
            if (ctxFin) {
                const finData = new Array(12).fill(0);
                data.financiamiento_mensual.forEach(row => finData[row.mes - 1] = parseFloat(row.monto_total));

                if (window.chartFin) window.chartFin.destroy(); // Destruir si ya existe
                window.chartFin = new Chart(ctxFin, {
                    type: 'bar',
                    data: {
                        labels: mesesLabels,
                        datasets: [{
                            label: 'Total $',
                            data: finData,
                            backgroundColor: '#36b9cc'
                        }]
                    },
                    options: {
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                ticks: {
                                    callback: (v) => '$' + v.toLocaleString('en-US', { notation: 'compact' })
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: (ctx) => 'Total: $' + ctx.raw.toLocaleString('en-US')
                                }
                            }
                        }
                    }
                });
            }

        } catch (e) {
            console.error("Error cargando estadísticas:", e, result);
        }
    });
}
// Iniciar la carga al cargar la página
$(document).ready(function () {
    loadMonthlyAgentCharts();
});



function get_ranking_agentes() {
    $.ajax({
        type: "POST",
        url: "index.php?c=main&a=get_ranking_agentes",
    }).done(function (result) {
        const data = JSON.parse(result);

        new Chart(document.getElementById('graficoRanking'), {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    // --- GRUPO REFINANCIAMIENTOS ---
                    {
                        label: 'Refis (Iniciados)',
                        data: data.refi_iniciado,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)', // Azul Claro
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        stack: 'Refi' // Agrupa este dataset con los otros 'Refi'
                    },
                    {
                        label: 'Refis (Finalizados)',
                        data: data.refi_finalizado,
                        backgroundColor: 'rgba(54, 162, 235, 0.9)', // Azul Oscuro
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        stack: 'Refi'
                    },
                    // --- GRUPO COMPRAS ---
                    {
                        label: 'Compras (Iniciados)',
                        data: data.compra_iniciado,
                        backgroundColor: 'rgba(75, 192, 192, 0.5)', // Verde Claro
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        stack: 'Compra' // Agrupa este dataset con los otros 'Compra'
                    },
                    {
                        label: 'Compras (Finalizados)',
                        data: data.compra_finalizado,
                        backgroundColor: 'rgba(75, 192, 192, 0.9)', // Verde Oscuro
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        stack: 'Compra'
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                scales: {
                    x: {
                        stacked: true, // Habilita el apilamiento global en X
                    },
                    y: {
                        stacked: true // Habilita el apilamiento global en Y
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    });
}
function get_embudo_ventas() {
    $.ajax({
        type: "POST",
        url: "index.php?c=main&a=get_embudo_ventas",
    }).done(function (result) {
        const data = JSON.parse(result);

        new Chart(document.getElementById('graficoEmbudo'), {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Total Tickets',
                        data: data.totales,
                        backgroundColor: 'rgba(201, 203, 207, 0.5)', // Gris claro
                        borderColor: 'rgb(201, 203, 207)',
                        borderWidth: 1
                    },
                    {
                        label: 'Finalizados',
                        data: data.finalizados,
                        backgroundColor: 'rgba(28, 200, 138, 0.8)', // Verde
                        borderColor: 'rgb(28, 200, 138)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';
                                let value = context.parsed.y;
                                let dataIndex = context.dataIndex;

                                if (label === 'Finalizados') {
                                    let total = context.chart.data.datasets[0].data[dataIndex];
                                    let percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                    return `${label}: ${value} (${percentage}% del total)`;
                                }
                                return `${label}: ${value}`;
                            }
                        }
                    }
                }
            }
        });
    });
}

function get_velocidad_cierre() {
    $.ajax({
        type: "POST",
        url: "index.php?c=main&a=get_velocidad_cierre",
    }).done(function (result) {
        const d = JSON.parse(result);

        new Chart(document.getElementById('graficoVelocidad'), {
            type: 'bar', // Cambiado a barra para mejor comparación entre agentes
            data: {
                labels: d.labels,
                datasets: [{
                    label: 'Días promedio para cerrar',
                    data: d.data,
                    // Color dinámico: más oscuro si tarda más
                    backgroundColor: d.data.map(valor => valor > 5 ? 'rgba(231, 74, 59, 0.7)' : 'rgba(28, 200, 138, 0.7)'),
                    borderColor: d.data.map(valor => valor > 5 ? '#e74a3b' : '#1cc88a'),
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y', // Barra horizontal para leer mejor los nombres
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `Promedio: ${context.parsed.x} días`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: { display: true, text: 'Días transcurridos' }
                    }
                }
            }
        });
    });
}

function get_carga_boards() {
    $.ajax({
        type: "POST",
        url: "index.php?c=main&a=get_carga_boards",
    }).done(function (result) {
        //  console.log(result);
        const d = JSON.parse(result);
        new Chart(document.getElementById('graficoCargaBoards'), {
            type: 'doughnut',
            data: {
                labels: d.labels,
                datasets: [{
                    data: d.data,
                    backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b']
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    });
}

function checkdiv(el) {

    el.querySelector("input").checked = !el.querySelector("input").checked;
    if (el.querySelector(".item-div-text").innerHTML.toLowerCase() == 'todos') {
        var items = Array.from(el.parentElement.querySelectorAll(".check-div-item"));
        for (var i = 1; i < items.length; i++) {
            items[i].querySelector("input").checked = el.querySelector("input").checked;
        }
    }
}

function filterList(el) {
    var val = el.value;
    var items = Array.from(el.parentElement.querySelectorAll(".check-div-item"));
    for (var i = 1; i < items.length; i++) {
        var item_text = items[i].querySelector(".item-div-text").innerHTML;
        console.log(item_text);
        item_text.toLowerCase().includes(val.toLowerCase()) ? items[i].classList.remove("d-none") : items[i].classList.add("d-none");
    }
}

function resetFilters() {
    var all_input_text = Array.from(document.querySelectorAll(".item-div-input"));
    var items = Array.from(document.querySelectorAll(".check-div-item"));
    var date_start = document.getElementById("filter_date_start");
    var date_end = document.getElementById("filter_date_end");
    date_start.value = date_end.value = "";
    all_input_text.forEach((inp) => { inp.value = ""; })
    items.forEach((item) => { item.classList.remove("d-none"); item.querySelector("input").checked = true; })
}


function applyFilters() {
    var items = Array.from(document.querySelectorAll(".check-div-item"));
    var active_items = items.filter(it => !it.classList.contains("d-none")).filter(it => it.querySelector("input").checked);
    var active_clients = active_items.filter(it => it.classList.contains("clients-items-div")).map(it => it.querySelector(".item-div-text").innerText.trim());
    var active_users = active_items.filter(it => it.classList.contains("users-items-div")).map(it => it.querySelector(".item-div-text").innerText.trim());
    var active_etapas = active_items.filter(it => it.classList.contains("etapas-items-div")).map(it => it.querySelector(".item-div-text").innerText.trim());
    var clients_table = document.getElementById("client_items_table");
    var date_start = document.getElementById("filter_date_start");
    var date_end = document.getElementById("filter_date_end");
    var all_clients_table = Array.from(clients_table.querySelectorAll("tr"));

    for (var i = 1; i < all_clients_table.length; i++) {
        var client_exist = active_clients.includes(all_clients_table[i].querySelectorAll("td")[0].innerText.trim());
        var agent_exist = active_users.includes(all_clients_table[i].querySelectorAll("td")[1].innerText.trim());
        var etapa_exist = active_etapas.includes(all_clients_table[i].querySelectorAll("td")[4].innerText.trim());
        var item_date = new Date(all_clients_table[i].querySelectorAll("td")[5].innerText.trim().replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3/$2/$1")).getTime();
        var start_date_filter = date_start.value != "" ? new Date(date_start.value.replace("-","/")).getTime() : false;
        var end_date_filter = date_end.value != "" ? new Date(date_end.value.replace("-","/")).getTime() : false;
        var filtering_date =(start_date_filter != false && end_date_filter != false) && (start_date_filter < end_date_filter) ? (item_date > start_date_filter && item_date < end_date_filter) : true;
        //console.log(filtering_date);
        // console.log(client_exist, " - ", agent_exist, " - ", etapa_exist);
        // console.log(all_clients_table[i].querySelectorAll("td")[0].innerText);
        // console.log(active_clients);
        client_exist && agent_exist && etapa_exist && filtering_date? all_clients_table[i].classList.remove("d-none") : all_clients_table[i].classList.add("d-none");
    }
}


function exportToExcel() {
    // 1. Obtener la tabla original
    var table = document.getElementById("client_items_table");

    // 2. Crear una tabla temporal "invisible" para filtrar los datos
    // Esto es necesario porque XLSX.utils.table_to_book exporta TODO por defecto
    var tempTable = document.createElement('table');

    // Clonamos las filas visibles
    var rows = Array.from(table.querySelectorAll("tr"));
    rows.forEach(row => {
        // Solo agregamos la fila si es el encabezado (índice 0) o si NO tiene d-none
        if (!row.classList.contains("d-none")) {
            var clone = row.cloneNode(true);
            tempTable.appendChild(clone);
        }
    });

    // 3. Convertir la tabla filtrada a un libro de trabajo (Workbook)
    var wb = XLSX.utils.table_to_book(tempTable, { sheet: "Reporte de Gestión" });

    // 4. Generar el nombre del archivo con la fecha actual (opcional, pero profesional)
    var date = new Date().toISOString().slice(0, 10);
    var fileName = "Reporte_Gestion_" + date + ".xlsx";

    // 5. Descargar el archivo
    XLSX.writeFile(wb, fileName);
}