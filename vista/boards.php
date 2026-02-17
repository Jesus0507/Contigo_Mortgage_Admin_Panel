<!DOCTYPE html>
<html lang="en">
<?php require_once 'header/header.php'; ?>
<?php require_once 'header/modal.php'; ?>

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
                                    <th>Tipo</th>
                                    <th>Cantidad de tickets</th>
                                    <th>Creado por</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                foreach ($boards as $board) {
                                    if (in_array($board['id_board'], $boards_users) || $_SESSION['user_role'] == "admin") {
                                ?>
                                        <tr>
                                            <td><?php echo $board['name'] ?><span class="d-none hidden-id"><?php echo $board['id_board'] ?></span></td>
                                            <td><?php echo $board['board_type'] ?></td>
                                            <td><?php echo $board['total_gestiones'] ?></td>
                                            <td><?php echo $board['user_name'] . " " . $board['user_last_name'] ?></td>
                                        </tr>
                                <?php }
                                } ?>
                            </tbody>
                        </table>
                    </div>
                </div>
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
    <script src="vista/js/modal_board.js"></script>
    <script src="vista/js/boards.js"></script>
</body>

</html>