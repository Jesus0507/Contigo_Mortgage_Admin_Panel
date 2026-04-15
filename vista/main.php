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
                        <div class="mb-3 d-flex flex-row w-75 mx-auto justify-content-between">
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
                            <div class="d-flex flex-row">
                                <div style="color: green; font-weight: bold;">Meta Mensual <?php echo $monto_mensual[0]['mes']."  /  ".$monto_mensual[0]['anio']."  :" ?></div><div><input disabled style="height:30px" class="form-control" id="meta_mensual_input" placeholder="Meta mensual" value="<?php echo $monto_mensual[0]['monto_meta'] ?>"></div><div><button id="monto_max_btn" class="btn btn-primary" style="height: 30px; padding-top: 3px !important"><i class="fas fa-pencil-alt"></i></button></div></div>
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

                            <div>
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

                        <div class="d-flex justify-content-end w-100 mb-3">
                            <button id="btn_generar_reporte" class="btn btn-primary btn-sm px-4 shadow-sm" style="height: 38px;">
                                Generar <i class="fas fa-sync ms-1"></i>
                            </button>
                        </div>

                        <div class="d-flex flex-wrap justify-content-between w-100">
                            <div class="statistics-filter" style="width: 250px; margin-bottom: 10px;" id="container_tipo_tabla">
                                <div class="filtros-header d-flex flex-row justify-content-between w-100">
                                    <div>Tipo de tabla <i class="fas fa-clipboard-list"></i></div>
                                    <div><i class="filtro-icon-reportes material-icons">keyboard_arrow_down</i></div>
                                </div>
                                <div class="filtros-body-reportes d-none">
                                    <div class="p-2 sticky-top bg-white border-bottom">
                                        <input type="text" class="form-control form-control-sm busqueda-filtro" placeholder="Buscar tipo...">
                                    </div>
                                    <div class="options-list">
                                        <div class="report-option-item bg-light border-bottom">
                                            <input type="checkbox" class="me-2 check-all" value="all" checked onchange="changeBoardType(this)">
                                            <span class="option-label fw-bold">Todos</span>
                                        </div>
                                        <?php foreach ($all_board_types as $bt) : ?>
                                            <div class="report-option-item">
                                                <input type="checkbox" class="me-2" value="<?php echo $bt['board_type'] ?>" checked onchange="changeBoardType(this)">
                                                <span class="option-label text-truncate"><?php echo $bt['board_type'] == "gestion_clientes" ? "Refinanciamientos" : $bt['board_type']; ?></span>
                                            </div>
                                        <?php endforeach; ?>
                                    </div>
                                </div>
                            </div>

                            <div class="statistics-filter" style="width: 250px; margin-bottom: 10px;" id="container_tablas">
                                <div class="filtros-header d-flex flex-row justify-content-between w-100">
                                    <div>Tablas <i class="fas fa-clipboard"></i></div>
                                    <div><i class="filtro-icon-reportes material-icons">keyboard_arrow_down</i></div>
                                </div>
                                <div class="filtros-body-reportes d-none">
                                    <div class="p-2 sticky-top bg-white border-bottom">
                                        <input type="text" class="form-control form-control-sm busqueda-filtro" placeholder="Buscar tabla...">
                                    </div>
                                    <div class="options-list">
                                        <div class="report-option-item bg-light border-bottom">
                                            <input type="checkbox" class="me-2 check-all" value="all" checked data-relation="all">
                                            <span class="option-label fw-bold">Todos</span>
                                        </div>
                                        <?php foreach ($boards as $b) : ?>
                                            <div class="report-option-item">
                                                <input type="checkbox" class="me-2" value="<?php echo $b['id_board'] ?>" data-relation="<?php echo $b['board_type'] ?>" checked>
                                                <span class="option-label text-truncate"><?php echo $b['name'] ?></span>
                                            </div>
                                        <?php endforeach; ?>
                                    </div>
                                </div>
                            </div>

                            <div class="statistics-filter" style="width: 250px; margin-bottom: 10px;" id="container_agentes">
                                <div class="filtros-header d-flex flex-row justify-content-between w-100">
                                    <div>Agentes <i class="fas fa-users-cog"></i></div>
                                    <div><i class="filtro-icon-reportes material-icons">keyboard_arrow_down</i></div>
                                </div>
                                <div class="filtros-body-reportes d-none">
                                    <div class="p-2 sticky-top bg-white border-bottom">
                                        <input type="text" class="form-control form-control-sm busqueda-filtro" placeholder="Buscar agente...">
                                    </div>
                                    <div class="options-list">
                                        <div class="report-option-item bg-light border-bottom">
                                            <input type="checkbox" class="me-2 check-all" value="all" checked data-relation="all">
                                            <span class="option-label fw-bold">Todos</span>
                                        </div>
                                        <?php foreach ($users as $u) : if ($u['relaciones_completas'] != null) { ?>
                                                <div class="report-option-item">
                                                    <input type="checkbox" class="me-2" data-relation="<?php echo $u['relaciones_completas']; ?>" value="<?php echo $u['user_id'] ?>" checked>
                                                    <span class="option-label text-truncate"><?php echo $u['name'] . " " . $u['last_name'] ?></span>
                                                </div>
                                        <?php }
                                        endforeach; ?>
                                    </div>
                                </div>
                            </div>

                            <div class="statistics-filter" style="width: 250px; margin-bottom: 10px;" id="container_estado">
                                <div class="filtros-header d-flex flex-row justify-content-between w-100">
                                    <div>Estado <i class="fas fa-exchange-alt"></i></div>
                                    <div><i class="filtro-icon-reportes material-icons">keyboard_arrow_down</i></div>
                                </div>
                                <div class="filtros-body-reportes d-none">
                                    <div class="p-2 sticky-top bg-white border-bottom">
                                        <input type="text" class="form-control form-control-sm busqueda-filtro" placeholder="Buscar estado...">
                                    </div>
                                    <div class="options-list">
                                        <div class="report-option-item bg-light border-bottom">
                                            <input type="checkbox" class="me-2 check-all" value="all" checked>
                                            <span class="option-label fw-bold">Todos</span>
                                        </div>
                                        <?php foreach ($all_etapas as $e) : ?>
                                            <div class="report-option-item">
                                                <input type="checkbox" class="me-2" data-typeboard ="<?php echo $e['board_type'];?>" data-relation="<?php echo $e['id_board']; ?>" value="<?php echo $e['etapa_actual'] ?>" checked>
                                                <span class="option-label text-truncate"><?php echo $e['etapa_actual'] ?></span>
                                            </div>
                                        <?php endforeach; ?>
                                    </div>
                                </div>
                            </div>

                            <div class="statistics-filter" style="width: 250px; margin-bottom: 10px;" id="container_clientes">
                                <div class="filtros-header d-flex flex-row justify-content-between w-100">
                                    <div>Clientes <i class="fas fa-users"></i></div>
                                    <div><i class="filtro-icon-reportes material-icons">keyboard_arrow_down</i></div>
                                </div>
                                <div class="filtros-body-reportes d-none">
                                    <div class="p-2 sticky-top bg-white border-bottom">
                                        <input type="text" class="form-control form-control-sm busqueda-filtro" placeholder="Buscar cliente...">
                                    </div>
                                    <div class="options-list">
                                        <div class="report-option-item bg-light border-bottom">
                                            <input type="checkbox" class="me-2 check-all" value="all" checked>
                                            <span class="option-label fw-bold">Todos</span>
                                        </div>
                                        <?php foreach ($clients_tickets as $c) : ?>
                                            <div class="report-option-item">
                                                <input type="checkbox" class="me-2" data-relation="<?php echo $c['tablas_presente'] ?>" value="<?php echo $c['client_id'] ?>" checked>
                                                <span class="option-label text-truncate"><?php echo $c['name'] . " " . $c['last_name'] ?></span>
                                            </div>
                                        <?php endforeach; ?>
                                    </div>
                                </div>
                            </div>

                            <div class="statistics-filter" style="width: 280px; margin-bottom: 10px;">
                                <div class="filtros-header d-flex flex-row justify-content-between w-100">
                                    <div>Fechas <i class="fas fa-calendar-alt"></i></div>
                                    <div><i class="filtro-icon-reportes material-icons">keyboard_arrow_down</i></div>
                                </div>
                                <div class="filtros-body-reportes d-none p-2">
                                    <div class="d-flex flex-column gap-2">
                                        <div>
                                            <label class="small text-muted">Inicio:</label>
                                            <input id="rep_fecha_inicio" class="form-control form-control-sm" type="date">
                                        </div>
                                        <div>
                                            <label class="small text-muted">Fin:</label>
                                            <input id="rep_fecha_fin" class="form-control form-control-sm" type="date">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="w-100 mt-3 d-flex justify-content-between">
                            <div style="width: 80%" id="report_preview"></div>
                            <div style="width: 15%" class="d-none mt-5" id="report_preview_buttons">
                                <button class="btn btn-danger" id="btn_export_pdf">Exportar a PDF <i class="fas fa-file-pdf"></i></button>
                                <button class="btn btn-success mt-4" id="btn_export_excel">Exportar a Excel <i class="fas fa-file-excel"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
    <script src="vista/js/scripts.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/simple-datatables@7.1.2/dist/umd/simple-datatables.min.js" crossorigin="anonymous"></script>
    <script src="vista/js/datatables-simple-demo.js"></script>
    <script src="vista/js/main_stadistics.js"></script>
    <?php if ($_SESSION['user_role'] == "admin") { ?>
        <script src="vista/js/main_reports.js"></script>
        <script src="vista/js/main_monto_max.js"></script>
    <?php } ?>
</body>

</html>