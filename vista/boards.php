<!DOCTYPE html>
<html lang="en">
<?php require_once 'header/header.php'; ?>
<?php require_once 'header/modal.php'; ?>
<?php require_once 'header/modal_access.php'; ?>

<body class="sb-nav-fixed">
    <?php require_once 'header/navbar.php'; ?>
    <div id="layoutSidenav">
        <?php require_once 'header/sidebar.php'; ?>
        <div id="layoutSidenav_content" style="background: white">
            <main>
                <div class="container-fluid px-4">
                    <h1 class="mt-4">Pizarras</h1>
                    <?php if ($_SESSION['user_role'] == "admin") { ?>
                        <div class="w-100 text-end">
                            <button class="btn btn-primary mb-4 modal-btn" id="modal_btn"><i class="fas fa-chalkboard"></i> Nueva Pizarra
                        </div>
                    <?php } ?>
                </div>
                <div class="card mb-4">
                    <div class="card-header">
                        <i class="fas fa-table me-1"></i>
                        Listado de pizarras
                    </div>
                    <div class="card-body">
                        <table id="datatablesSimple">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Tipo de proceso</th>
                                    <th>Cantidad de procesos</th>
                                    <?php
                                    if ($_SESSION['user_role'] == "admin") { ?>
                                        <th>Estado</th>
                                    <?php } ?>
                                    <th>Creado por</th>
                                    <?php
                                    if ($_SESSION['user_role'] == "admin") { ?>
                                        <th>Acciones</th>
                                    <?php } ?>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                foreach ($boards as $board) {
                                    if ((in_array($board['id_board'], $boards_users) && $board['enabled'] == 1) || $_SESSION['user_role'] == "admin") {
                                ?>

                                        <tr>
                                            <td><?php echo $board['name'] ?><span class="d-none hidden-id"><?php echo $board['id_board'] ?></span></td>
                                            <td><?php echo $board['board_type'] == "gestion_clientes" ? "refinances" : "compras"; ?><span class="d-none hidden-id"><?php echo $board['id_board'] ?></span></td>
                                            <td>
                                                <?php
                                                if ($_SESSION['user_role'] == "admin") {
                                                    echo $board['total_gestiones'];
                                                } else {
                                                    if (isset($users_gestions[$board['id_board']])) {
                                                        $stats = $users_gestions[$board['id_board']];

                                                        if ($board['board_type'] == "gestion_clientes") {
                                                            echo $stats['total_en_gestion'];
                                                        } else if ($board['board_type'] == "compras") {
                                                            echo $stats['total_en_compras'];
                                                        }
                                                    } else {
                                                        echo "0";
                                                    }
                                                }
                                                ?>
                                                <span class="d-none hidden-id"><?php echo $board['id_board'] ?></span>
                                            </td>
                                            <?php
                                            if ($_SESSION['user_role'] == "admin") { ?>
                                                <td><?php echo $board['enabled'] == 1 ? "Habilitado" : "Deshabilitado"; ?><span class="d-none hidden-id"><?php echo $board['id_board'] ?></span></td>
                                            <?php } ?>
                                            <td><?php echo $board['user_name'] . " " . $board['user_last_name'] ?><span class="d-none hidden-id"><?php echo $board['id_board'] ?></span></td>
                                            <?php
                                            if ($_SESSION['user_role'] == "admin") { ?>
                                                <td>
                                                    <div><button class="btn btn-dark mx-2 access-modal-btn-class" onclick="open_modal(<?php echo $board['id_board']; ?>)"><i class="fas fa-users-cog"></i></button></div>
                                                </td>
                                            <?php } ?>
                                        </tr>
                                <?php }
                                } ?>
                            </tbody>
                        </table>
                    </div>
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

    <script src="<?php echo v_asset('vista/js/datatables-simple-demo.js'); ?>"></script>
    <script src="<?php echo v_asset('vista/js/scripts.js'); ?>"></script>
    <script src="<?php echo v_asset('vista/js/custom_modal.js'); ?>"></script>
    <script src="<?php echo v_asset('vista/js/modal_board.js'); ?>"></script>
    <script src="<?php echo v_asset('vista/js/boards.js'); ?>"></script>
    <script src="<?php echo v_asset('vista/js/access_modal.js'); ?>"></script>
</body>

</html>