<div class="access-custom-modal">
    <div class="custom-modal-header d-flex flex-row justify-content-between">
        <div>Modificar pizarra</div>
        <div class="access-close-modal-btn" id="close_access_modal_btn">X</div>
    </div>
    <div class="custom-modal-body">
        <div class="w-100 d-flex flex-row justify-content-between">
            <div class="w-75">
                <label for="board_name_access">Nombre de pizarra:</label>
                <input class="form-control mt-2" placeholder="Nombre" id="board_name_access" type="text" value="<?php echo $board_info[0]['name'] ?? ""; ?>">
            </div>
            <div style="width: 20%;" class="text-center">
                <div>Habilitada:</div>
                <div class="form-check form-switch text-center d-flex justify-content-center mt-2">
                    <input class="form-check-input input-enabled-access" type="checkbox" role="switch" id="flexSwitchCheckChecked" <?php if(isset($board_info) && $board_info[0]['enabled'] == 1){ ?>checked <?php } ?>>
                </div>
            </div>
        </div>
        <hr>
        <div class="mt-4 mb-2 d-flex flex-row justify-content-between">
            <div>
                <label for="users-list">Acceso de usuarios: <span id="cant_users_span_access" class="fw-bold"><?php echo count($boards_users); ?></span></label>
            </div>
            <div>
                <input class="form-control" placeholder="Buscar usuario..." style="height: 30px;" id="search_modal_user_access">
            </div>
        </div>
        <div class="users-list">
            <div class="d-none" id="users_boards_info_access"><?php echo json_encode($boards_users); ?></div>
            <?php foreach ($usuarios as $user) { ?>
                <div class="w-100 d-flex flex-row justify-content-between py-2 users-modal-item">
                    <div class="w-25 text-center"><?php echo ucfirst($user['name']) ?></div>
                    <div class="w-25 text-center"><?php echo ucfirst($user['last_name']) ?></div>
                    <div class="w-25 text-center"><?php echo $user['email'] ?></div>
                    <div class="w-25 text-center">
                        <input class="form-check-input check-user-access" type="checkbox" id="<?php echo $user['user_id'] ?>_access" <?php if (in_array($user['user_id'], $boards_users)) { ?>checked <?php } ?>>
                    </div>
                </div>
            <?php } ?>
        </div>
        <div class="mt-3 w-100 justify-content-center d-flex">
            <div class="btn btn-primary mx-auto" id="btn_crear_access">Guardar cambios</div>
        </div>
    </div>
</div>