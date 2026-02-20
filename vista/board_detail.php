<!DOCTYPE html>
<html lang="en">
<?php require_once 'header/header.php'; ?>
<?php if ($board_info[0]['board_type'] == "gestion_clientes") {
    require_once 'header/modal_gestion.php';
} else {
    require_once 'header/modal_compras.php';
} ?>
<?php require_once 'header/modal_access.php'; ?>

<body class="sb-nav-fixed">
    <?php require_once 'header/navbar.php'; ?>
    <div id="layoutSidenav">
        <?php require_once 'header/sidebar.php'; ?>
        <div id="layoutSidenav_content" style="background: white">
            <main>
                <div class="container-fluid px-4">
                    <span class="d-none" id="hidden_board_type"><?php echo $board_info[0]['board_type'] ?></span>
                    <h1 class="mt-4" id="board_name_title"><?php echo $board_info[0]['name'] ?></h1>
                    <h4><?php if ($board_info[0]['board_type'] == "gestion_clientes") echo "Gestión de clientes" ?>
                        <?php if ($board_info[0]['board_type'] == "compras") echo "Compras" ?>
                    </h4>
                    <span id="board_id" class="d-none"><?php echo $_GET['info']; ?></span>
                    <div class="w-100 d-flex flex-row justify-content-between">
                        <div class="d-flex flex-row">
                            <div><input class="form-control" placeholder="Buscar..."></div><i class="fas fa-search mt-2 mx-3"></i>
                            <?php if ($_SESSION['user_role'] == "admin") { ?>
                                <div><button class="btn btn-dark mx-2" id="access_modal_btn"><i class="fas fa-users-cog"></i> Administrar acceso</button></div>
                            <?php } ?>
                            <div><button class="btn btn-dark mx-2" id="add_column"><i class="far fa-plus-square"></i> Nueva columna</button></div>
                        </div>
                        <div><button class="btn btn-primary mb-4 modal-btn" id="modal_btn"><i class="fas fa-ticket-alt"></i> <?php if ($board_info[0]['board_type'] == "gestion_clientes") echo "Agregar gestión" ?><?php if ($board_info[0]['board_type'] != "gestion_clientes") echo "Agregar compra" ?></button></div>
                    </div>
                </div>
                <div class="container-tasks">
                    <?php
                    $all_tickets = explode('/', $board_info[0]['etapas']);
                    foreach ($all_tickets as $ticket) {
                        $cant = 0;
                        foreach ($all_gestions as $gestion) {
                            if ($gestion['etapa_actual'] == $ticket) {
                                $cant = $cant + 1;
                            }
                        }

                    ?>
                        <div class="task-column">
                            <div class="task-title d-flex flex-row justify-content-between">
                                <div class="d-flex flex-row">
                                    <div class="task-title-text"><?php echo $ticket ?></div>
                                    <div><span class="task_cant"><?php echo $cant; ?></span></div>

                                </div>
                                <?php if ($ticket != $all_tickets[count($all_tickets) - 1]) { ?> <div class="ticket-options opt-clickeable points_clickeable"><span class="opt-clickeable">...</span></div><?php } ?>
                            </div>
                            <?php if ($ticket != $all_tickets[count($all_tickets) - 1]) { ?>
                                <div class="ticket-options-container d-none opt-clickeable">
                                    <div class="opt-item opt-clickeable">Cambiar nombre de columna</div>
                                    <?php if ($ticket != $all_tickets[0]) { ?>
                                        <div class="opt-item opt-clickeable">Mover columna a la izquierda</div>
                                    <?php } ?>
                                    <div class="opt-item opt-clickeable">Mover columna a la derecha</div>
                                    <div class="opt-item opt-clickeable">Eliminar columna</div>

                                </div><?php } ?>

                            <ul class="tasks">
                                <?php
                                foreach ($all_gestions as $gestion) {
                                    if ($gestion['etapa_actual'] == $ticket && ($_SESSION['user_role'] == 'admin' || $_SESSION['user_id'] == $gestion['user_id'])) {
                                ?>
                                        <li class="task" draggable="true"><?php echo ucfirst($gestion['name']) . " " . ucfirst($gestion['last_name']); ?><span class="gestion-id d-none"><?php echo $board_info[0]['board_type'] == "gestion_clientes" ? $gestion['id_gestion'] : $gestion['id_compra'] ?></span></li>
                                <?php
                                    }
                                }
                                ?>
                            </ul>
                        </div>
                    <?php } ?>
                </div>
                <!-- <div class="card mb-4">
                    <div class="card-header">
                        <i class="fas fa-table me-1"></i>
                        Listado de pizarras
                    </div> -->
                <!-- <div class="card-body">
                        <table id="datatablesSimple">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Tipo</th>
                                    <th>Etapa actual</th>
                                    <th>Creado por</th>
                                    <th>Cliente</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <th>Nombre</th>
                                <th>Tipo</th>
                                <th>Etapa actual</th>
                                <th>Creado por</th>
                                <th>Cliente</th>
                                <th>Acciones</th>
                            </tbody>
                        </table>
                    </div>
                </div> -->
        </div>
        </main>
        <!-- <footer class="py-4 bg-light mt-auto">
                <div class="container-fluid px-4">
                    <div class="d-flex align-items-center justify-content-between small">
                        <div class="text-muted">Copyright &copy; Your Website 2023</div>
                        <div>
                            <a href="#">Privacy Policy</a>
                            &middot;
                            <a href="#">Terms &amp; Conditions</a>
                        </div>
                    </div>
                </div>
            </footer> -->
    </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/simple-datatables@7.1.2/dist/umd/simple-datatables.min.js" crossorigin="anonymous"></script>
    <script src="vista/js/datatables-simple-demo.js"></script>
    <script src="vista/js/scripts.js"></script>
    <script src="vista/js/custom_modal.js"></script>
    <?php if ($board_info[0]['board_type'] == "gestion_clientes") { ?>
        <script src="vista/js/modal_gestion.js"></script>
    <?php } else { ?>
        <script src="vista/js/modal_compras.js"></script>
    <?php } ?>
    <script src="vista/js/access_modal.js"></script>
    <script src="vista/js/board_detail.js"></script>
</body>

</html>