<!DOCTYPE html>
<html lang="es" class="notranslate" translate="no">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="description" content="" />
    <meta name="author" content="" />
    <title>Contigo Mortgage - Admin Panel</title>

    <link href="https://cdn.jsdelivr.net/npm/simple-datatables@7.1.2/dist/style.min.css" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <script src="https://use.fontawesome.com/releases/v6.3.0/js/all.js" crossorigin="anonymous"></script>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

    <link rel="icon" href="vista/images/favicon.png" type="image/x-icon">

    <link href="<?php echo v_asset('vista/css/styles.css'); ?>" rel="stylesheet" />
    <link href="<?php echo v_asset('vista/css/modal.css'); ?>" rel="stylesheet" />
    <link href="<?php echo v_asset('vista/css/board_detail.css'); ?>" rel="stylesheet" />
    <?php if ($_SESSION['first_login'] == 0) { ?>
        <script src="<?php echo v_asset('vista/js/first_login.js') ?>"></script>
        <div class="modal fade" id="modalSeguridad" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-lg">
                <div class="modal-content border-0 shadow-lg">
                    <div class="modal-header bg-dark text-white">
                        <h5 class="modal-title"><i class="fas fa-shield-alt me-2"></i>Seguridad de la Cuenta</h5>
                    </div>
                    <div class="modal-body">
                        <form id="formSeguridad" class="needs-validation" novalidate>
                            <div class="row">
                                <div class="col-md-6 border-end">
                                    <h6 class="text-primary mb-3"><i class="fas fa-key me-2"></i>Actualizar Contraseña</h6>

                                    <div class="mb-3">
                                        <label class="form-label small">Contraseña Actual</label>
                                        <div class="input-group">
                                            <input type="password" name="pass_actual" id="pass_actual" class="form-control" required>
                                            <button class="btn btn-outline-secondary toggle-password" type="button">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label small">Nueva Contraseña</label>
                                        <div class="input-group">
                                            <input type="password" name="pass_nueva" id="pass_nueva" class="form-control" minlength="6" required>
                                            <button class="btn btn-outline-secondary toggle-password" type="button">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                        </div>
                                        <div class="form-text" style="font-size: 0.7rem;">Mínimo 6 caracteres.</div>
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label small">Confirmar Nueva Contraseña</label>
                                        <div class="input-group">
                                            <input type="password" id="pass_confirm" class="form-control" required>
                                            <button class="btn btn-outline-secondary toggle-password" type="button">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                        </div>
                                        <div id="msg-error-pass" class="text-danger small d-none">Las contraseñas no coinciden.</div>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <h6 class="text-primary mb-3"><i class="fas fa-user-check me-2"></i>Preguntas de Seguridad</h6>
                                    <div class="mb-2">
                                        <label class="form-label small">Nombre de tu primera mascota</label>
                                        <input type="text" name="p_mascota" class="form-control form-control-sm" required>
                                    </div>
                                    <div class="mb-2">
                                        <label class="form-label small">Color favorito</label>
                                        <input type="text" name="p_color" class="form-control form-control-sm" required>
                                    </div>
                                    <div class="mb-2">
                                        <label class="form-label small">Personaje favorito</label>
                                        <input type="text" name="p_personaje" class="form-control form-control-sm" required>
                                    </div>
                                    <hr>
                                    <div class="mb-2">
                                        <label class="form-label small fw-bold">Pregunta personalizada</label>
                                        <input type="text" name="p_custom" class="form-control form-control-sm" required>
                                    </div>
                                    <div class="mb-2">
                                        <label class="form-label small fw-bold">Respuesta personalizada</label>
                                        <input type="text" name="r_custom" class="form-control form-control-sm" required>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer bg-light">
                        <button type="button" id="btnGuardarSeguridad" class="btn btn-dark w-100">Guardar Cambios y Continuar</button>
                    </div>
                </div>
            </div>
        </div>
    <?php } ?>
</head>