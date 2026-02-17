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
                    <h1 class="mt-4">Agentes</h1>
                    <div class="w-100 text-end">
                        <div class="btn btn-primary mb-4" onclick="location.href = 'index.php?c=users&a=register'"><i class="fas fa-user-plus"></i> Agregar agente</div>
                    </div>
                    <div class="card mb-4">
                        <div class="card-header">
                            <i class="fas fa-table me-1"></i>
                            Listado de agentes
                        </div>
                        <div class="card-body">
                            <table id="datatablesSimple">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Apellido</th>
                                        <th>Correo</th>
                                        <th>Fecha de creación</th>
                                        <th>Cantidad de pizarras</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <!-- <tfoot>
                                    <tr>
                                        <th>Name</th>
                                        <th>Position</th>
                                        <th>Office</th>
                                        <th>Age</th>
                                        <th>Start date</th>
                                        <th>Salary</th>
                                    </tr>
                                </tfoot> -->
                                <tbody>
                                    <?php
                                    foreach ($usuarios as $user) { ?>
                                        <tr>
                                            <td><input class="form-control input-table" readonly="true" value="<?php echo ucfirst($user['name']) ?>"></td>
                                            <td><input class="form-control input-table" readonly="true" value="<?php echo ucfirst($user['last_name']) ?>"></td>
                                            <td><input class="form-control input-table" readonly="true" value="<?php echo $user['email'] ?>"></td>
                                            <td><?php echo $user['date_created'] ?></td>
                                            <td><?php echo $user['total_pizarras'] ?></td>
                                            <td>
                                                <div class="d-flex flex-row justify-content-around w-100"><button class="<?php echo $user['user_id']?> btn btn-primary edit-client" onclick="edit(this)"><i class='fas fa-pencil-alt'></i></button><button class="<?php echo $user['user_id']?> btn btn-danger" onclick="delete_client(this)"><i class="fas fa-trash"></i></button></div>
                                            </td>
                                            </td>
                                        </tr>
                                    <?php } ?>
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
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/simple-datatables@7.1.2/dist/umd/simple-datatables.min.js" crossorigin="anonymous"></script>
    <script src="vista/js/datatables-simple-demo.js"></script>
    <script src="vista/js/scripts.js"></script>
     <script src="vista/js/users.js"></script>
</body>

</html>