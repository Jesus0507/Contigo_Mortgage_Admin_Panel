document.addEventListener('DOMContentLoaded', function () {
    get_cartera_total_data();
    get_distribucion_prestamos();
    get_comparativa_valores();
    get_meta_cierre_mensual();
    get_ranking_agentes();
    get_embudo_ventas();
    get_velocidad_cierre();
    get_carga_boards();
});


function get_cartera_total_data() {
    const ctx = document.getElementById('graficoCartera').getContext('2d');

    // Usando el formato jQuery AJAX que solicitaste
    $.ajax({
        type: "POST", // O "GET" dependiendo de cómo lo manejes en el controlador
        url: "index.php?c=main&a=get_cartera_total_data",
        data: {}, // No necesitamos enviar datos para esta consulta
    }).done(function (result) {
        // Parseamos el resultado en caso de que venga como string
        const data = JSON.parse(result);

        console.log("Datos recibidos para el gráfico:", data);

        // Renderizado del gráfico
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Monto Total en Dólares ($)',
                    data: data.totals,
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(75, 192, 192, 0.7)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
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
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return 'Total: $' + context.raw.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    });
}

function get_distribucion_prestamos() {

    const ctxPie = document.getElementById('graficoProgramas').getContext('2d');

    $.ajax({
        type: "POST",
        url: "index.php?c=main&a=get_distribucion_prestamos",
        data: {},
    }).done(function (result) {
        console.log(result);
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
                                return label + ': ' + value + ' casos';
                            }
                        }
                    }
                }
            }
        });
    });
}

function get_comparativa_valores() {

    const ctxArea = document.getElementById('graficoAreas').getContext('2d');

    $.ajax({
        type: "POST",
        url: "index.php?c=main&a=get_comparativa_valores",
        data: {},
    }).done(function (result) {
        console.log(result);
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
    const ctxGauge = document.getElementById('graficoGauge').getContext('2d');

    $.ajax({
        type: "POST",
        url: "index.php?c=main&a=get_meta_cierre_mensual",
        data: {},
    }).done(function (result) {
        console.log(result);
        try {
            const res = JSON.parse(result);
            const restante = res.meta - res.actual > 0 ? res.meta - res.actual : 0;

            // Actualizar el texto debajo del gráfico
            document.getElementById('gaugeText').innerText =
                `$${res.actual.toLocaleString()} / $${res.meta.toLocaleString()}`;

            new Chart(ctxGauge, {
                type: 'doughnut',
                data: {
                    labels: ['Alcanzado', 'Restante'],
                    datasets: [{
                        data: [res.actual, restante],
                        backgroundColor: ['#28a745', '#e9ecef'], // Verde y Gris claro
                        borderWidth: 0
                    }]
                },
                options: {
                    rotation: -90, // Empezar desde la izquierda
                    circumference: 180, // Solo medio círculo
                    cutout: '80%', // Grosor del arco
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: false
                        }
                    }
                }
            });
        } catch (e) {
            console.error("Error en Gauge:", result);
        }
    });
}

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
                    {
                        label: 'Refinanciamientos',
                        data: data.refis, // Usamos el nuevo campo de Refis
                        backgroundColor: 'rgba(54, 162, 235, 0.7)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Compras',
                        data: data.compras, // Usamos el nuevo campo de Compras
                        backgroundColor: 'rgba(75, 192, 192, 0.7)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                indexAxis: 'y', 
                responsive: true,
                scales: {
                    x: {
                        stacked: true, // Apila las barras en el eje X
                    },
                    y: {
                        stacked: true // Apila las barras en el eje Y
                    }
                },
                plugins: {
                    legend: { 
                        display: true, // Ahora sí conviene mostrar la leyenda para saber cuál es cuál
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
                datasets: [{
                    label: 'Cantidad de Clientes',
                    data: data.data,
                    backgroundColor: ['#f6c23e', '#fd7e14', '#e74a3b', '#1cc88a']
                }]
            },
            options: { responsive: true }
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
            type: 'line',
            data: {
                labels: d.labels,
                datasets: [{
                    label: 'Días promedio para cerrar',
                    data: d.data,
                    borderColor: '#1cc88a',
                    backgroundColor: 'rgba(28, 200, 138, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: { responsive: true }
        });
    });
}

function get_carga_boards() {
    $.ajax({
        type: "POST",
        url: "index.php?c=main&a=get_carga_boards",
    }).done(function (result) {
        console.log(result);
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