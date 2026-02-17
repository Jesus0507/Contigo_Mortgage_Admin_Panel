<div class="access-custom-modal">
    <div class="custom-modal-header d-flex flex-row justify-content-between">
        <div>Modificar pizarra</div>
        <div class="access-close-modal-btn" id="close_access_modal_btn">X</div>
    </div>
    <div class="custom-modal-body">
        <div>
            <label for="board_name">Nombre de pizarra:</label>
            <input class="form-control mt-2" placeholder="Nombre" id="board_name" type="text" value="<?php echo $board_info[0]['name'] ?>">
        </div>
        <div class="mt-4 mb-2 d-flex flex-row justify-content-between">
            <div>
                <label for="users-list">Acceso de usuarios: <span id="cant_users_span" class="fw-bold"><?php echo count($boards_users); ?></span></label>
            </div>
            <div>
                <input class="form-control" placeholder="Buscar usuario..." style="height: 30px;" id="search_modal_user">
            </div>
        </div>
        <div class="users-list">
            <div class="d-none" id="users_boards_info"><?php echo json_encode($boards_users); ?></div>
            <?php foreach ($usuarios as $user) { ?>
                <div class="w-100 d-flex flex-row justify-content-between py-2 users-modal-item">
                    <div class="w-25 text-center"><?php echo ucfirst($user['name']) ?></div>
                    <div class="w-25 text-center"><?php echo ucfirst($user['last_name']) ?></div>
                    <div class="w-25 text-center"><?php echo $user['email'] ?></div>
                    <div class="w-25 text-center">
                        <input class="form-check-input" type="checkbox" id="<?php echo $user['user_id'] ?>" <?php if (in_array($user['user_id'], $boards_users)) { ?>checked <?php } ?>>
                    </div>
                </div>
            <?php } ?>
        </div>
        <div class="mt-3 w-100 justify-content-center d-flex">
            <div class="btn btn-primary mx-auto" id="btn_crear">Guardar cambios</div>
        </div>
    </div>
</div>