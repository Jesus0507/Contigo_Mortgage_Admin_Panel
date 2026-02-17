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
                                        <a class="small text-white stretched-link" href="#">View Details</a>
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
                                        <a class="small text-white stretched-link" href="#">View Details</a>
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
                                        <a class="small text-white stretched-link" href="#">View Details</a>
                                        <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                                    </div>
                                </div>
                            </div>
                        <?php } ?>
                        <div class="col-xl-3 col-md-6">
                            <div class="card contigo-blue text-white mb-4">
                                <div class="card-body d-flex flex-row justify-content-between">
                                    <div><i class="fas fa-clipboard-list"></i> Mis pizarras</div>
                                    <div><?php echo $cantMyBoards; ?></div>
                                </div>
                                <div class="card-footer d-flex align-items-center justify-content-between">
                                    <a class="small text-white stretched-link" href="#">View Details</a>
                                    <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xl-6">
                            <div class="card" style="width: 100%; max-width: 800px; margin: auto;">
                                <div class="card-body">
                                    <h5 class="card-title text-center">Cartera Total por Tipo de Gestión</h5>
                                    <canvas id="graficoCartera"></canvas>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="card" style="width: 100%; max-width: 500px; margin: 20px auto;">
                                <div class="card-body">
                                    <h5 class="card-title text-center">Distribución de Programas de Préstamo (Refinances)</h5>
                                    <canvas id="graficoProgramas"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xl-6">
                            <div class="card" style="width: 100%; max-width: 900px; margin: 20px auto;">
                                <div class="card-body">
                                    <h5 class="card-title text-center">Valor de Propiedad vs. Monto de Préstamo</h5>
                                    <canvas id="graficoAreas"></canvas>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="card" style="width: 100%; max-width: 400px; margin: 20px auto;">
                                <div class="card-body text-center">
                                    <h5 class="card-title">Meta de Cierre Mensual</h5>
                                    <canvas id="graficoGauge"></canvas>
                                    <div id="gaugeText" style="margin-top: -20px; font-weight: bold; font-size: 1.2rem;">$0 / $0</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xl-6">
                            <div class="card mb-4">
                                <div class="card-header"><i class="fas fa-chart-bar me-1"></i> Ranking de Productividad (Agentes)</div>
                                <div class="card-body"><canvas id="graficoRanking" width="100%" height="40"></canvas></div>
                            </div>
                        </div>
                        <div class="col-xl-6">
                            <div class="card mb-4">
                                <div class="card-header"><i class="fas fa-filter me-1"></i> Embudo de Ventas (Etapas)</div>
                                <div class="card-body"><canvas id="graficoEmbudo" width="100%" height="40"></canvas></div>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-4">
                        <div class="col-xl-8 col-lg-7">
                            <div class="card shadow mb-4">
                                <div class="card-body">
                                    <h5 class="card-title text-center">Eficiencia: Tiempo Promedio de Cierre (Días)</h5>
                                    <canvas id="graficoVelocidad"></canvas>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-4 col-lg-5">
                            <div class="card shadow mb-4">
                                <div class="card-body">
                                    <h5 class="card-title text-center">Volumen por Pizarra</h5>
                                    <canvas id="graficoCargaBoards"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
        </main>
    </div>
    </div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
    <script src="vista/js/scripts.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js" crossorigin="anonymous"></script>
    <!-- <script src="vista/js/demo/chart-area-demo.js"></script> -->
    <!-- <script src="vista/js/demo/chart-bar-demo.js"></script> -->
    <!-- <script src="vista/js/demo/chart-pie-demo.js"></script> -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/simple-datatables@7.1.2/dist/umd/simple-datatables.min.js" crossorigin="anonymous"></script>
    <script src="vista/js/datatables-simple-demo.js"></script>
    <script src="vista/js/main_stadistics.js"></script>
</body>

</html>