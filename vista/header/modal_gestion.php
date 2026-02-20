<div class="custom-modal modal-gestion">
    <span class="d-none" id="hidden_user_name"><?php echo $_SESSION['username'] ?></span>
    <div class="custom-modal-header d-flex flex-row justify-content-between">
        <div id="modal_gestion_title">Nuevo registro</div>
        <span id="modal_id_gestion" class="d-none"></span>
        <div class="d-flex flex-row">
            <?php if ($_SESSION['user_role'] != "user") { ?>
                <div class="btn btn-primary mx-2 d-none" id="property_update"><span class="fas fa-edit"></span></div>
            <?php } ?>
            <div class="btn btn-primary mx-2" title="Guardar registro" id="property_register"><span class="fas fa-save"></span></div>
            <div class="close-modal-btn" id="close_modal_btn">X</div>
        </div>
    </div>
    <div class="custom-modal-options mt-2 mb-2">
        <div class="d-flex flex-row justify-content-between w-100">
            <div class="d-flex flex-row gestion-options">
                <div class="w-50 text-center active" id="gestion_tab">Gestión</div>
                <div class="w-50 text-center" id="seguimiento_tab">Seguimiento</div>
            </div>
            <div style="font-weight: bold" id="asesor_name">Asesor: Pepito</div>
        </div>
    </div>
    <button class="d-none" id="hidden_calcs"></button>
    <div class="custom-modal-body">
        <div class="d-flex flex-row w-100" id="gestion_container" style="height:100%;">
            <div style="overflow-y: auto; width: 33%">
                <div style="font-size: 13px; font-weight: bold">CLIENTE</div>
                <hr class="m-2">
                <div class="mb-2 mt-2">
                    <label for="client_name" id="client_name_label">Nombre:</label>
                    <input class="form-control" id="client_name" placeholder="Nombre del cliente">
                </div>
                <div class="mb-2">
                    <label for="client_last_name" id="client_last_name_label">Apellido:</label>
                    <input class="form-control" id="client_last_name" placeholder="Apellido del cliente">
                </div>
                <div class="mb-2">
                    <label for="client_phone" id="client_phone_label">Teléfono:</label>
                    <input class="form-control" id="client_phone" placeholder="Teléfono ej: +12125550199">
                </div>
                <div class="mb-2">
                    <label for="call_detail" id="call_detail_label">Detalle de llamada:</label>
                    <textarea class="form-control" id="call_detail" placeholder="Escriba el detalle de la llamada..." rows="4"></textarea>
                </div>

            </div>
            <div class="modal-divider mx-2"></div>
            <div style="overflow-y: auto; width: 33%">
                <div style="font-size: 13px; font-weight: bold">DATOS ADICIONALES</div>
                <hr class="m-2">
                <div class="w-100 mb-2">
                    <label for="address mb-2" id="address_label">Dirección de la propiedad:</label>
                    <input class="form-control" id="address" placeholder="Dirección">
                </div>
                <div class="w-100 d-flex flex-row justify-content-between mb-2">
                    <div style="width:45%">
                        <label for="address mb-2" id="property_value_label">Valor de propiedad:</label>
                        <input class="form-control monto-input" id="property_value" placeholder="Valor $ ej: 24.500,60">
                    </div>
                    <div style="width: 45%">
                        <label for="address" id="interes_actual_label">Interés actual:</label>
                        <input class="form-control" id="interes_actual" placeholder="Interés actual % max 100">
                    </div>
                </div>

                <div class="w-100 d-flex flex-row justify-content-between">

                    <div style="width: 45%">
                        <label for="mortgage" id="mortgage_label">Mortgage actual:</label>
                        <input class="form-control monto-input" id="mortgage" placeholder="Mortgage">
                    </div>
                    <div style="width:45%">
                        <label for="gastos_cierre mb-2" id="occupancy_label">Occupancy:</label>
                        <select id="occupancy" class="form-select">
                            <option value="">Seleccionar</option>
                            <option value="primary_residence">Primary residence</option>
                            <option value="investment_property">Invesment property</option>
                        </select>
                    </div>
                </div>
                <hr class="m-3">
                <div class="mt-1">
                    <div class="d-flex flex-row justify-content-between">
                        <div>
                            <label for="deudas_adicionales">Deudas adicionales: </label>
                        </div>
                        <div>
                            <button class="btn btn-primary" id="add_new_deuda"><span class="fas fa-plus"></span></button>

                        </div>
                    </div>
                    <div class="mt-3 deudas-adicionales">
                        <div id="deudas_fields"></div>
                        <div id="deudas_data">
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-divider mx-2"></div>
            <div style="overflow-y: auto; width: 33%">
                <div class="d-flex flex-row w-100 justify-content-between px-2">
                    <div style="font-size: 13px; font-weight: bold">ESTIMACIONES</div>
                    <div class="form-check form-switch">
                        <label class="form-check-label" for="max_ltv_switch">Max LTV</label>
                        <input class="form-check-input" type="checkbox" checked role="switch" id="max_ltv_switch" <?php if ($_SESSION['user_role'] != "admin") { ?> disabled <?php } ?>>
                    </div>
                </div>
                <hr class="m-2">
                <div class="w-100 d-flex flex-row justify-content-between mb-2">
                    <div style="width: 45%">
                        <label for="address" id="ltv_label">LTV:</label>
                        <input class="form-control" id="ltv_value" placeholder="LTV % max 75" <?php if ($_SESSION['user_role'] != "admin") { ?> disabled <?php } ?>>
                    </div>
                    <div style="width: 45%">
                        <label for="address" id="interes_estimado_label">Interés estimado:</label>
                        <input class="form-control" id="interes_estimado" placeholder="Interés estimado % max 100" <?php if ($_SESSION['user_role'] != "admin") { ?> disabled <?php } ?>>
                    </div>
                </div>
                <div class="w-100 d-flex flex-row justify-content-between mb-2">
                    <div style="width:45%">
                        <label for="address" id="prepayment_penalty_label">Prepayment penalty:</label>
                        <input class="form-control" id="prepayment_penalty" placeholder="Prepayment penalty" <?php if ($_SESSION['user_role'] != "admin") { ?> disabled <?php } ?>>
                    </div>
                    <div style="width:45%">
                        <label for="gastos_cierre mb-2" id="gastos_cierre_label">Gastos de cierre (%):</label>
                        <input class="form-control" id="gastos_cierre" placeholder="Gastos de cierre" <?php if ($_SESSION['user_role'] != "admin") { ?> disabled <?php } ?>>
                    </div>
                </div>
                <div class="w-100 d-flex flex-row justify-content-between mb-2">

                    <div class="w-100">
                        <label for="gastos_cierre mb-2" id="tipo_prestamo_label">Tipo de préstamo:</label>
                        <select id="tipo_prestamo" class="form-select" <?php if ($_SESSION['user_role'] != "admin") { ?> disabled <?php } ?>>
                            <option value="">Seleccionar</option>
                            <option value="fha">Fha</option>
                            <option value="conventional">Conventional</option>
                            <option value="non_qm">Non qm</option>
                            <option value="fnba_primary_profit_and_lost">Fnba primary profit and lost</option>
                            <option value="fnba_primary_w2_income">Fnba primary w2 income</option>
                        </select>
                    </div>
                </div>
                <div class="mb-2">
                    <label for="aditional_conditions" id="aditional_conditions_label">Condiciones adicionales:</label>
                    <textarea class="form-control" id="aditional_conditions" placeholder="Describa las condiciones adicionales..." rows="2" <?php if ($_SESSION['user_role'] != "admin") { ?> disabled <?php } ?>></textarea>
                </div>
                <div class="w-100 d-flex flex-row justify-content-between">
                    <div style="width: 45%">
                        <label for="address" id="loan_amount_label">Loan Amount:</label>
                        <input class="form-control" id="loan_amount" placeholder="Loan Amount" <?php if ($_SESSION['user_role'] != "admin") { ?> disabled <?php } ?>>
                    </div>
                    <div style="width: 45%">
                        <label for="mortgage" id="cashout_label">Cash out:</label>
                        <input class="form-control" id="cashout" placeholder="Cash out" <?php if ($_SESSION['user_role'] != "admin") { ?> disabled <?php } ?>>
                    </div>

                </div>

            </div>
        </div>
        <div class="gestion-tabs d-none" id="seguimiento_container">
            <div class="d-flex flex-row justify-content-between tabs-options">
                <div class="selected-div">Notas de gestión</div>
                <div>Historial de gestión</div>
            </div>
            <div class="notes-container">
                <div class="fake-comments-div">
                    <div>Escribir una nota...</div>
                </div>
                <div class="comment-container d-none">
                    <div class="toolbar" id="toolbar">
                        <button class="toolbar-btn" onclick="applyFormat('bold')"><b>B</b></button>
                        <button class="toolbar-btn" onclick="applyFormat('italic')"><i>I</i></button>

                        <div class="color-picker-wrapper">
                            <input type="color" onchange="applyColor(this.value)">
                        </div>

                        <div style="position: relative; display: inline-block;">
                            <button class="toolbar-btn" onclick="toggleLinkMenu()">🔗</button>

                            <div id="link-menu" class="floating-menu">
                                <input type="text" id="link-url" placeholder="Enlace: https://...">
                                <input type="text" id="link-text" placeholder="Texto descriptivo">
                                <div class="menu-footer">
                                    <button class="btn-confirm" onclick="confirmLink()">Insertar</button>
                                    <button class="btn-cancel" onclick="toggleLinkMenu()">Cancelar</button>
                                </div>
                            </div>
                        </div>

                        <div class="separator"></div>
                        <button class="toolbar-btn" onclick="applyFormat('insertUnorderedList')">• Lista</button>
                        <button class="toolbar-btn" onclick="applyFormat('insertOrderedList')">1. Lista</button>
                    </div>

                    <div id="editor" contenteditable="true" placeholder="Escribe algo aquí..."></div>

                    <div class="footer">
                        <button class="btn btn-light" id="btn_cancel_comment">Cancelar</button>
                        <button class="btn btn-light" id="btn_save_comment">Guardar</button>
                    </div>
                </div>
                <div class="comments-area">

                </div>
            </div>
            <div class="historial-container d-none">
            </div>
        </div>
    </div>
</div>