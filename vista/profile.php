<?php require_once 'header/header.php'; ?>

<body class="sb-nav-fixed">
    <?php require_once 'header/navbar.php'; ?>
    <div id="layoutSidenav">
        <?php require_once 'header/sidebar.php'; ?>
        <div id="layoutSidenav_content">
            <main>
                <div class="container-fluid px-4">
                    <h1 class="mt-4">Mi Perfil</h1>
                    <ol class="breadcrumb mb-4">
                        <li class="breadcrumb-item active">Gestión de datos personales y seguridad</li>
                    </ol>

                    <div class="card mb-4 shadow">
                        <div class="card-header bg-dark text-white">
                            <i class="fas fa-user-edit me-1"></i>
                            Editar Información del Perfil
                        </div>
                        <div class="card-body" style="background: #f8f9fa">
                            <form id="formPerfil">
                                <div class="row">
                                    <div class="col-lg-5 border-end">
                                        <h5 class="text-primary mb-4">Datos Generales</h5>
                                        <div class="mb-3">
                                            <label class="form-label">Nombre:</label>
                                            <input type="text" id="perfil_nombre" name="nombre" class="form-control" value="<?php echo explode(" ", $_SESSION['username'])[0]; ?>" required>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Apellido:</label>
                                            <input type="text" id="perfil_apellido" name="apellido" class="form-control" value="<?php echo implode(" ", array_slice(explode(" ", $_SESSION['username']), 1)); ?>" required>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Correo Electrónico:</label>
                                            <input type="email" id="perfil_email" name="email" class="form-control" value="<?php echo $_SESSION['email']; ?>" required>
                                        </div>

                                        <hr class="mt-5">
                                        <h5 class="text-danger mb-3">Cambiar Contraseña</h5>
                                        <p class="small text-muted italic">Deja en blanco si no deseas cambiarla.</p>

                                        <div class="mb-3">
                                            <label class="form-label small">Nueva Contraseña:</label>
                                            <div class="input-group">
                                                <input type="password" id="pass_nueva" name="pass_nueva" class="form-control">
                                                <button class="btn btn-outline-secondary toggle-password" type="button"><i class="fas fa-eye"></i></button>
                                            </div>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label small">Confirmar Nueva Contraseña:</label>
                                            <div class="input-group">
                                                <input type="password" id="pass_confirm" class="form-control">
                                                <button class="btn btn-outline-secondary toggle-password" type="button"><i class="fas fa-eye"></i></button>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-lg-7 ps-lg-4">
                                        <h5 class="text-primary mb-4">Preguntas de Seguridad</h5>
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label small">Primera Mascota:</label>
                                                <input type="text" name="p_mascota" class="form-control" placeholder="Respuesta">
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label small">Color Favorito:</label>
                                                <input type="text" name="p_color" class="form-control" placeholder="Respuesta">
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label small">Personaje Favorito:</label>
                                                <input type="text" name="p_personaje" class="form-control" placeholder="Respuesta">
                                            </div>
                                            <div class="col-md-12 mt-3">
                                                <div class="p-3 bg-white border rounded">
                                                    <label class="form-label fw-bold"><?php echo $custom_question ?>:</label>
                                                    <input type="text" name="r_custom" class="form-control" placeholder="Tu respuesta">
                                                </div>
                                            </div>
                                        </div>

                                        <div class="mt-5 pt-4 border-top">
                                            <label class="form-label fw-bold text-danger">Contraseña Actual (Requerido para guardar cambios):</label>
                                            <div class="input-group mb-3">
                                                <input type="password" name="pass_actual" id="pass_actual" class="form-control border-danger" required>
                                                <button class="btn btn-outline-danger toggle-password" type="button"><i class="fas fa-eye"></i></button>
                                            </div>
                                            <button type="button" id="btn_save_perfil" class="btn btn-dark w-100 py-2">
                                                <i class="fas fa-save me-2"></i>Guardar Cambios de Perfil
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <script src="<?php echo v_asset('vista/js/scripts.js'); ?>"></script>
    <script src="<?php echo v_asset('vista/js/edit_profile.js'); ?>"></script>
</body>

</html>