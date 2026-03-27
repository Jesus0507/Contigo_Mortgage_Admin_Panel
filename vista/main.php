<!DOCTYPE html>
<html lang="en">
<?php require_once 'header/header.php'; ?>

<body class="sb-nav-fixed">
    <?php require_once 'header/navbar.php'; ?>
    <div id="layoutSidenav">
        <?php require_once 'header/sidebar.php'; ?>
        <div id="layoutSidenav_content">
            <main>
                <div class="container-fluid px-4">
                    <h1 class="mt-4">Para ti</h1>
                    <div class="row">
                        <?php if ($_SESSION['user_role'] == "admin") { ?>
                            <div class="col-xl-3 col-md-6">
                                <div class="card contigo-blue text-white mb-4">
                                    <div class="card-body d-flex flex-row justify-content-between">
                                        <div><i class="fas fa-users-cog"></i> Agentes</div>
                                        <div><?php echo $cantUsers; ?></div>
                                    </div>
                                    <div class="card-footer d-flex align-items-center justify-content-between">
                                        <a class="small text-white stretched-link" href="index.php?c=users&a=index">Detalles</a>
                                        <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-3 col-md-6">
                                <div class="card contigo-blue text-white mb-4">
                                    <div class="card-body d-flex flex-row justify-content-between">
                                        <div><i class="fas fa-users"></i> Clientes</div>
                                        <div><?php echo $cantClients; ?></div>
                                    </div>
                                    <div class="card-footer d-flex align-items-center justify-content-between">
                                        <a class="small text-white stretched-link" href="index.php?c=clients&a=index">Detalles</a>
                                        <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-3 col-md-6">
                                <div class="card contigo-blue text-white mb-4">
                                    <div class="card-body d-flex flex-row justify-content-between">
                                        <div><i class="fas fa-folder-open"></i> Pizarras</div>
                                        <div><?php echo $cantBoards; ?></div>
                                    </div>
                                    <div class="card-footer d-flex align-items-center justify-content-between">
                                        <a class="small text-white stretched-link" href="index.php?c=boards&a=index">Detalles</a>
                                        <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                                    </div>
                                </div>
                            </div>
                        <?php } else { ?>
                            <div class="col-xl-3 col-md-6">
                                <div class="card contigo-blue text-white mb-4">
                                    <div class="card-body d-flex flex-row justify-content-between">
                                        <div><i class="fas fa-clipboard-list"></i> Pizarras</div>
                                        <div><?php echo $cantMyBoards; ?></div>
                                    </div>
                                    <div class="card-footer d-flex align-items-center justify-content-between">
                                        <a class="small text-white stretched-link" href="index.php?c=boards&a=index">Detalles</a>
                                        <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                                    </div>
                                </div>
                            <?php } ?>
                            </div>
                    </div>

                    <div class="mx-auto d-flex flex-row justify-content-center reportes-options mt-3 mb-5">
                        <div id="graficos_opt" class="selected">
                            Gráficos Estadísticos
                        </div>
                        <div id="reportes_opt">
                            Reportes
                        </div>
                    </div>

                    <div id="graficos_container" class="mt-3 w-100 px-4">
                        <div class="mb-3 d-flex flex-row w-75 mx-auto justify-content-end">
                            <div id="multi_select_filter" class="statistics-filter">
                                <div id="filtros_header" class="filtros-header d-flex flex-row justify-content-between w-100">
                                    <div>Filtros <i class="fas fa-filter"></i></div>
                                    <div><i id="filter_icon" class="material-icons">keyboard_arrow_down</i></div>
                                </div>
                                <div class="filtros-body w-10 d-none" id="filtros_body">
                                    <div>
                                        <input type="checkbox" name="todos_filtro" value="todos_filtro" checked>
                                        <label class="mx-2 label-filtros" for="todos_filtro">Todos</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" checked name="cartera_total" value="cartera_total">
                                        <label class="mx-2 label-filtros" for="cartera_total">Cartera Total</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" checked name="distribucion_prestamos" value="distribucion_prestamos">
                                        <label class="mx-2 label-filtros" for="distribucion_prestamos">Distribucion de programas de préstamo</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" checked name="valor_vs_monto" value="valor_vs_monto">
                                        <label class="mx-2 label-filtros" for="valor_vs_monto">Valor de propiedad Vs Monto de préstamo</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" checked name="meta_cierre" value="meta_cierre">
                                        <label class="mx-2 label-filtros" for="meta_cierre">Meta de cierre mensual</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" checked name="grafico_productividad" value="grafico_productividad">
                                        <label class="mx-2 label-filtros" for="grafico_productividad">Productividad por agente</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" checked name="embudo_ventas" value="embudo_ventas">
                                        <label class="mx-2 label-filtros" for="embudo_ventas">Embudo de ventas</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" checked name="tiempo_cierre" value="tiempo_cierre">
                                        <label class="mx-2 label-filtros" for="tiempo_cierre">Tiempo promedio de cierre</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" checked name="volumen_pizarra" value="volumen_pizarra">
                                        <label class="mx-2 label-filtros" for="volumen_pizarra">Volumen por pizarra</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" checked name="cierre_asesor_mes" value="cierre_asesor_mes">
                                        <label class="mx-2 label-filtros" for="cierre_asesor_mes">Cierres de asesor por mes</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" checked name="inicios_mes" value="inicios_mes">
                                        <label class="mx-2 label-filtros" for="inicios_mes">Procesos iniciados por mes</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" checked name="financiamientos_mes" value="financiamientos_mes">
                                        <label class="mx-2 label-filtros" for="financiamientos_mes">Financiamientos por mes</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="graficos_section_container" class="graficos-section-container" style="position: relative; bottom: 0px;">
                            <div class="container-grafico-card">
                                <div class="card shadow" style="width: 100%; max-width: 800px; margin: auto;">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between align-items-center mb-3">
                                            <h5 class="card-title mb-0 w-75">Cartera Total</h5>
                                            <div class="custom-control custom-switch">
                                                <input type="checkbox" class="custom-control-input" id="switchCartera" onchange="toggleCartera(this.checked)">
                                                <label class="custom-control-label" for="switchCartera" style="font-size: 0.85rem;">Solo Finalizados</label>
                                            </div>
                                        </div>
                                        <canvas id="graficoCartera"></canvas>
                                    </div>
                                </div>
                            </div>
                            <div class="container-grafico-card">
                                <div class="card" style="width: 100%; max-width: 500px; margin: 20px auto;">
                                    <div class="card-body">
                                        <h5 class="card-title text-center">Distribución de Programas de Préstamo (Refinances)</h5>
                                        <canvas id="graficoProgramas"></canvas>
                                    </div>
                                </div>
                            </div>
                            <div class="container-grafico-card"> 
                                <div class="card" style="width: 100%; max-width: 900px; margin: 20px auto;">
                                    <div class="card-body">
                                        <h5 class="card-title text-center">Valor de Propiedad vs. Monto de Préstamo</h5>
                                        <canvas id="graficoAreas"></canvas>
                                    </div>
                                </div>
                            </div>
                            <div class="card container-grafico-card" style="width: 100%; max-width: 800px; margin: auto; border: none;">
                                <div class="card h-100">
                                    <div class="card-body text-center d-flex flex-column justify-content-center">
                                        <h5 class="card-title">Meta de Cierre Mensual</h5>
                                        <div style="position: relative; width: 100%; margin: 0 auto;">
                                            <canvas id="graficoGauge"></canvas>
                                        </div>
                                        <div id="gaugeText" style="margin-top:0%; font-weight: bold; font-size: 1.5rem; ">$0 / $0</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div class="card container-grafico-card mb-4">
                                    <div class="card-header"><i class="fas fa-chart-bar me-1"></i> Ranking de Productividad (Agentes)</div>
                                    <div class="card-body"><canvas id="graficoRanking" width="100%" height="40"></canvas></div>
                                </div>
                            </div>
                            <div>
                                <div class="card mb-4 container-grafico-card">
                                    <div class="card-header"><i class="fas fa-filter me-1"></i> Embudo de Ventas (Etapas)</div>
                                    <div class="card-body"><canvas id="graficoEmbudo" width="100%" height="40"></canvas></div>
                                </div>
                            </div>

                            <div>
                                <div class="card shadow mb-4 container-grafico-card">
                                    <div class="card-body">
                                        <h5 class="card-title text-center">Eficiencia: Tiempo Promedio de Cierre (Días)</h5>
                                        <canvas id="graficoVelocidad"></canvas>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div class="card shadow mb-4 container-grafico-card">
                                    <div class="card-body">
                                        <h5 class="card-title text-center">Volumen por Pizarra</h5>
                                        <canvas id="graficoCargaBoards"></canvas>
                                    </div>
                                </div>
                            </div>

                            <div >
                                <div class="card shadow h-100 container-grafico-card">
                                    <div class="card-header py-3">
                                        <h6 class="m-0 font-weight-bold text-primary">Cierres de Asesor por Mes (Tickets Finalizados)</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="chart-area">
                                            <canvas id="chartCierresAgente"></canvas>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div class="card shadow h-100 container-grafico-card">
                                    <div class="card-header py-3">
                                        <h6 class="m-0 font-weight-bold text-success">Procesos Iniciados por Mes (Tickets Creados)</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="chart-area">
                                            <canvas id="chartIniciadosAgente"></canvas>
                                        </div>
                                    </div>
                                </div>
                            </div>

                                    <div>
                                <div class="card shadow h-100 container-grafico-card">
                                    <div class="card-header py-3">
                                        <h6 class="m-0 font-weight-bold text-info">Financiamientos por Mes (Volumen Total $)</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="chart-area">
                                            <canvas id="chartFinanciamientoMensual"></canvas>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="reportes_container" class="mt-3 w-100 px-4 d-none">
                        reportes
                    </div>
                </div>
            </main>
        </div>
    </div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
    <script src="vista/js/scripts.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/simple-datatables@7.1.2/dist/umd/simple-datatables.min.js" crossorigin="anonymous"></script>
    <script src="vista/js/datatables-simple-demo.js"></script>
    <script src="vista/js/main_stadistics.js"></script>
</body>

</html>