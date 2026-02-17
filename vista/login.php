<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="description" content="" />
        <meta name="author" content="" />
        <title>Iniciar Sesión - Contigo Mortgage - Admin Panel</title>
        <link href="vista/css/styles.css" rel="stylesheet" />
        <link href="vista/css/login.css" rel="stylesheet" />
        <link rel="icon" href="vista/images/favicon.png" type="image/x-icon"/>
        <script src="https://use.fontawesome.com/releases/v6.3.0/js/all.js" crossorigin="anonymous"></script>
    </head>
    <body class="bg-primary">
        <div id="layoutAuthentication">
            <div id="layoutAuthentication_content">
                <main>
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-lg-5 mt-5">
                                <div class="card shadow-lg border-0 rounded-lg mt-5">
                                    <div class="card-header">
                                        <img src="vista/images/icon_white.png">
                                        <div class="text-light mt-2"><h2>Contigo Mortgage</h2></div>
                                    </div>
                                    <div class="card-body">
                                        <form>
                                            <div class="form-floating mb-3">
                                                <input class="form-control" id="inputEmail" type="email" />
                                                <label for="inputEmail" id="emailLabel">Correo electrónico</label>
                                            </div>
                                            <div class="form-floating mb-3">
                                                <input class="form-control" id="inputPassword" type="password"/>
                                                <label for="inputPassword" id="pswLabel">Contraseña</label>
                                            </div>
                                            <div class="d-flex align-items-center justify-content-between mt-4 mb-0">
                                                <a class="small text-light" href="password.php">Olvidé mi contraseña</a>
                                                <div class="btn btn-primary" id="loginBtn">Iniciar sesión</div>
                                            </div>
                                        </form>
                                    </div>
                                    <div class="card-footer text-center py-3 text-light">
                                        <div class="small"><a href="register.php" class="text-light">Registrarse</a></div>
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
                            <div class="text-muted">Todos los derechos reservados &copy; Contigo Mortgage Admin Panel 2025</div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
        <script src="vista/js/scripts.js"></script>
         <script src="vista/js/login.js"></script>
    </body>
</html>
