<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="description" content="Recuperación de contraseña" />
    <meta name="author" content="" />
    <title>Recuperar Contraseña - Contigo Mortgage - Admin Panel</title>

    <link href="<?php echo v_asset('vista/css/styles.css'); ?>" rel="stylesheet" />
    <link href="<?php echo v_asset('vista/css/login.css'); ?>" rel="stylesheet" />

    <link rel="icon" href="vista/images/favicon.png" type="image/x-icon" />

    <script src="https://use.fontawesome.com/releases/v6.3.0/js/all.js" crossorigin="anonymous"></script>
</head>

<body class="bg-primary">
    <div id="layoutAuthentication">
        <div id="layoutAuthentication_content">
            <main>
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-lg-6 mt-5"> <!-- Aumentado un poco el ancho por los campos nuevos -->
                            <div class="card shadow-lg border-0 rounded-lg mt-5">
                                <div class="card-header text-center">
                                    <img src="vista/images/icon_white.png" alt="Logo">
                                    <div class="text-light mt-2">
                                        <h2>Recuperar Acceso</h2>
                                        <p class="small">Contigo Mortgage Admin Panel</p>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <form id="forgotPswForm">
                                        <!-- Identificación -->
                                        <div class="form-floating mb-3">
                                            <input class="form-control" id="inputEmail" type="email" placeholder="nombre@ejemplo.com" required />
                                            <label for="inputEmail">Correo electrónico</label>
                                        </div>

                                        <hr class="text-light">
                                        <h5 class="text-light mb-3">Preguntas de Seguridad</h5>

                                        <div class="row mb-3">
                                            <div class="col-md-6">
                                                <div class="form-floating mb-3 mb-md-0">
                                                    <input class="form-control" id="petAnswer" type="text" placeholder="Respuesta" required />
                                                    <label for="petAnswer">¿Primera Mascota?</label>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-floating">
                                                    <input class="form-control" id="colorAnswer" type="text" placeholder="Respuesta" required />
                                                    <label for="colorAnswer">¿Color Favorito?</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row mb-3">
                                            <div class="col-md-6">
                                                <div class="form-floating mb-3 mb-md-0">
                                                    <input class="form-control" id="charAnswer" type="text" placeholder="Respuesta" required />
                                                    <label for="charAnswer">¿Personaje Favorito?</label>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-floating">
                                                    <input class="form-control" id="customAnswer" type="text" placeholder="Respuesta" required />
                                                    <label for="customAnswer">Respuesta personalizada</label>
                                                </div>
                                            </div>
                                        </div>

                                        <hr class="text-light">
                                        <h5 class="text-light mb-3">Nueva Contraseña</h5>

                                        <div class="row mb-3">
                                            <div class="col-md-6">
                                                <div class="form-floating mb-3 mb-md-0">
                                                    <input class="form-control" id="newPassword" type="password" placeholder="Nueva contraseña" required />
                                                    <label for="newPassword">Nueva contraseña</label>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-floating">
                                                    <input class="form-control" id="confirmPassword" type="password" placeholder="Confirmar contraseña" required />
                                                    <label for="confirmPassword">Confirmar contraseña</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="d-flex align-items-center justify-content-between mt-4 mb-0">
                                            <a class="small text-light" href="index.php?c=login">Volver al inicio</a>
                                            <button class="btn btn-primary" id="recoveryBtn">Actualizar contraseña</button>
                                        </div>
                                    </form>
                                </div>
                                <div class="card-footer text-center py-3 text-light">
                                    <div class="small">¿Problemas técnicos? Contacte al administrador.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
        <div id="layoutAuthentication_footer">
            <footer class="py-4 bg-light mt-auto">
                <div class="container-fluid px-4">
                    <div class="d-flex align-items-center justify-content-between small">
                        <div class="text-muted">Todos los derechos reservados &copy; Contigo Mortgage Admin Panel 2026</div>
                    </div>
                </div>
            </footer>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>

    <script src="<?php echo v_asset('vista/js/scripts.js'); ?>"></script>
    <!-- Asegúrate de crear o modificar este JS para manejar la recuperación -->
    <script src="<?php echo v_asset('vista/js/recovery.js'); ?>"></script>
</body>

</html>