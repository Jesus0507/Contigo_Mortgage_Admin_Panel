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
                                        <th>Tipo usuario</th>
                                        <th>Fecha de creación</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($usuarios as $user) { ?>
                                        <tr>
                                            <td class="cell-name"><?php echo ucfirst($user['name']) ?></td>
                                            <td class="cell-lastname"><?php echo ucfirst($user['last_name']) ?></td>
                                            <td class="cell-email"><?php echo $user['email'] ?></td>
                                            <td class="cell-email"><?php echo $user['role'] == "user"? "agente" : "consultor"; ?></td>
                                            <td><?php echo $user['date_created'] ?></td>
                                            <td>
                                                <div class="d-flex flex-row justify-content-around w-100">
                                                    <button class="btn btn-primary edit-client" data-id="<?php echo $user['user_id'] ?>" onclick="edit(this)">
                                                        <i class='fas fa-pencil-alt'></i>
                                                    </button>
                                                    <button class="btn btn-danger" data-id="<?php echo $user['user_id'] ?>" onclick="delete_client(this)">
                                                        <i class="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    <?php } ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/simple-datatables@7.1.2/dist/umd/simple-datatables.min.js" crossorigin="anonymous"></script>

    <script src="<?php echo v_asset('vista/js/datatables-simple-demo.js'); ?>"></script>
    <script src="<?php echo v_asset('vista/js/scripts.js'); ?>"></script>
    <script src="<?php echo v_asset('vista/js/users.js'); ?>"></script>
</body>

</html>