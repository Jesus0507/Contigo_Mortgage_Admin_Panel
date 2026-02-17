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
                    <h1 class="mt-4">Registro de agentes</h1>
                    <div class="card mb-4 mt-5">
                        <div class="card-header">
                            <i class="	fas fa-user-plus me-1"></i>
                            Agregar agente
                        </div>
                        <div class="card-body d-flex flex-row" style="background: #E6F2F2">
                            <div class="w-50 pt-5">
                                <div class="d-none w-100 text-center" style="color: red" id="label_warnings"></div>
                                <div class="w-75 mx-auto d-flex flex-row justify-content-center mt-5">
                                    <div class="w-50 mt-5">
                                        <label>Nombre:</label>
                                        <input placeholder="Nombre" class="form-control w-75">
                                    </div>
                                    <div class="w-50 mt-5">
                                        <label>Apellido:</label>
                                        <input placeholder="Apellido" class="form-control w-75">
                                    </div>

                                </div>
                                <div class="w-75 mx-auto d-flex flex-row justify-content-between mt-4 mb-3">
                                    <div class="w-50">
                                        <label>Correo:</label>
                                        <input placeholder="Correo electrónico" class="form-control w-75">
                                    </div>
                                    <div class="w-50">
                                        <label>Contraseña:</label>
                                        <div class=" d-flex flex-row">
                                            <input placeholder="Contraseña" class="form-control w-75" type="password">
                                            <div class="btn btn-primary" id="input_eye_btn"><i class="fas fa-eye"></i></div>
                                        </div>
                                    </div>

                                </div>
                                <div class="w-100 text-center mt-5">
                                    <div class="btn btn-primary mx-auto mt-4" id="btn_registro">Registrar</div>
                                </div>
                            </div>
                            <div class="w-50 pt-3 user-register-img">
                                <img src="vista/images/user_register.png">
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer class="py-4 bg-light mt-auto">
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
            </footer>
        </div>
    </div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/simple-datatables@7.1.2/dist/umd/simple-datatables.min.js" crossorigin="anonymous"></script>
    <script src="vista/js/datatables-simple-demo.js"></script>
    <script src="vista/js/scripts.js"></script>
    <script src="vista/js/add_user.js"></script>
</body>

</html>