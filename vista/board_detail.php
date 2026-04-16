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
                            <div>
                                <input id="searchInputTasks" class="form-control" placeholder="Buscar..." onkeyup="applyBoardFilters()">
                            </div>
                            <i class="fas fa-search mt-2 mx-3"></i>
                            <?php if ($_SESSION['user_role'] == "admin") { ?>
                                <div><button class="btn btn-dark mx-2" id="access_modal_btn" onclick="open_modal(null)"><i class="fas fa-users-cog"></i> Administrar acceso</button></div>
                            <?php } ?>
                            <div><button class="btn btn-dark mx-2" id="add_column"><i class="far fa-plus-square"></i> Nueva columna</button></div>
                            <div>
                                <div class="d-flex gap-3 mb-4 flex-wrap">
                                    <?php if ($_SESSION['user_role'] == "admin") { ?>
                                        <div class="dropdown">
                                            <button class="btn btn-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside">
                                                <i class="fas fa-filter me-2"></i> Filtro
                                            </button>
                                            <div class="dropdown-menu shadow-lg p-0" style="width: 550px; border-radius: 8px; overflow: hidden;">
                                                <div class="d-flex" style="min-height: 350px;">

                                                    <div class="bg-light border-end" style="width: 40%;">
                                                        <div class="nav flex-column nav-pills p-2" id="v-pills-tab" role="tablist">
                                                            <button class="nav-link active text-start mb-1" data-bs-toggle="pill" data-bs-target="#tab-agentes" type="button" role="tab">
                                                                Persona asignada
                                                            </button>
                                                            <button class="nav-link text-start" data-bs-toggle="pill" data-bs-target="#tab-estados" type="button" role="tab">
                                                                Estado
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div class="tab-content p-3" id="v-pills-tabContent" style="width: 60%;">

                                                        <div class="tab-pane fade show active" id="tab-agentes" role="tabpanel">
                                                            <div class="input-group mb-3">
                                                                <span class="input-group-text bg-white border-end-0"><i class="fas fa-search text-muted"></i></span>
                                                                <input type="text" class="form-control border-start-0 filter-search" placeholder="Buscar persona asignada..." onkeyup="searchInTab(this)">
                                                            </div>
                                                            <div class="options-list" style="max-height: 250px; overflow-y: auto;">
                                                                <?php
                                                                $ids_con_gestion = array_column($all_gestions, 'user_id');

                                                                foreach ($usuarios as $user) {
                                                                    if (in_array($user['user_id'], $ids_con_gestion)) {
                                                                ?>
                                                                        <div class="form-check dropdown-item py-1">
                                                                            <input class="form-check-input filter-check-agent"
                                                                                type="checkbox"
                                                                                value="<?php echo $user['user_id']; ?>"
                                                                                id="u<?php echo $user['user_id']; ?>"
                                                                                onchange="applyBoardFilters()">
                                                                            <label class="form-check-label w-100" for="u<?php echo $user['user_id']; ?>">
                                                                                <?php echo $user['name'] . " " . $user['last_name']; ?>
                                                                            </label>
                                                                        </div>
                                                                <?php
                                                                    }
                                                                }
                                                                ?>
                                                            </div>
                                                        </div>

                                                        <div class="tab-pane fade" id="tab-estados" role="tabpanel">
                                                            <div class="input-group mb-3">
                                                                <span class="input-group-text bg-white border-end-0"><i class="fas fa-search text-muted"></i></span>
                                                                <input type="text" class="form-control border-start-0 filter-search" placeholder="Buscar estado..." onkeyup="searchInTab(this)">
                                                            </div>
                                                            <div class="options-list" style="max-height: 250px; overflow-y: auto;">
                                                                <?php
                                                                $etapas_unicas = array_unique(array_column($all_gestions, 'etapa_actual'));

                                                                foreach ($etapas_unicas as $index => $etapa) {
                                                                    $etapa_label = strtoupper($etapa);
                                                                ?>
                                                                    <div class="form-check dropdown-item py-1">
                                                                        <input class="form-check-input filter-check-status"
                                                                            type="checkbox"
                                                                            value="<?php echo $etapa_label ?>"
                                                                            id="status_<?php echo $index; ?>"
                                                                            onchange="applyBoardFilters()">
                                                                        <label class="form-check-label w-100" for="status_<?php echo $index; ?>">
                                                                            <?php echo $etapa_label ?>
                                                                        </label>
                                                                    </div>
                                                                <?php } ?>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    <?php } ?>

                                </div>
                            </div>
                        </div>
                        <div><button class="btn btn-primary mb-4 modal-btn" id="modal_btn"><i class="fas fa-ticket-alt"></i> <?php if ($board_info[0]['board_type'] == "gestion_clientes") echo "Agregar gestión" ?><?php if ($board_info[0]['board_type'] != "gestion_clientes") echo "Agregar proceso" ?></button></div>
                    </div>
                </div>
                <div class="container-tasks">
                    <?php
                    $all_tickets = explode('/', $board_info[0]['etapas']);
                    foreach ($all_tickets as $ticket) {
                        $cant = 0;
                        if (isset($all_gestions) && is_array($all_gestions)) {
                            foreach ($all_gestions as $gestion) {
                                if ($gestion['etapa_actual'] == $ticket) {
                                    $cant = $cant + 1;
                                }
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
                                if (isset($all_gestions) && is_array($all_gestions)) {
                                    foreach ($all_gestions as $gestion) {
                                        if ($gestion['etapa_actual'] == $ticket && ($_SESSION['user_role'] == 'admin' || $_SESSION['user_id'] == $gestion['user_id'])) {
                                ?>
                                            <li class="task task-container"
                                                <?php if (strtolower($gestion['etapa_actual']) != "finalizado" || $_SESSION['user_role'] == 'admin') { ?>
                                                draggable="true"
                                                <?php } else { ?>
                                                draggable="false"
                                                <?php } ?>
                                                data-user-id="<?php echo $gestion['user_id']; ?>"
                                                data-status="<?php echo strtoupper($gestion['etapa_actual']); ?>"
                                                data-user-type="<?php echo $_SESSION['user_role']; ?>">

                                                <?php echo ucfirst($gestion['name']) . " " . ucfirst($gestion['last_name']); ?>
                                                <span class="gestion-id d-none">
                                                    <?php echo $board_info[0]['board_type'] == "gestion_clientes" ? $gestion['id_gestion'] : $gestion['id_compra'] ?>
                                                </span>
                                                <i class="fas fa-square" style="color: <?php
                                                                                        echo ($gestion['prioridad'] == 1) ? 'green' : (($gestion['prioridad'] == 2) ? '#F5B027' : 'red');
                                                                                        ?>"></i>
                                            </li>
                                <?php
                                        }
                                    }
                                }
                                ?>
                            </ul>
                        </div>
                    <?php } ?>
                </div>
        </div>
        </main>

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