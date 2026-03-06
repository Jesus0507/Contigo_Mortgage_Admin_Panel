<div class="custom-modal modal-gestion modal-compras">
    <span class="d-none" id="hidden_user_name"><?php echo $_SESSION['username'] ?></span>
    <div class="custom-modal-header d-flex flex-row justify-content-between">
        <div id="modal_gestion_title">Nueva compra</div>
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
    <div class="custom-modal-body">
        <div class="d-flex flex-row w-100" id="gestion_container" style="height:100%;">
            <div style="overflow-y: auto; width: 30%">
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
            <div style="overflow-y: auto; width: 36%">
                <div style="font-size: 13px; font-weight: bold">DATOS ADICIONALES</div>
                <hr class="m-2">
                <div class="mb-2 d-flex flex-row w-100 justify-content-between">
                    <div style='width:45%'>
                        <label for="address mb-2" id="process_type_label">Tipo de proceso:</label>
                        <select class="form-select" id="process_type">
                            <option value="">Seleccionar</option>
                            <option value="income_check">Income check</option>
                            <option value="non_qm">Non qm</option>
                        </select>
                    </div>
                    <div style='width:45%'>
                        <label for="address mb-2" id="estatus_legal_label">Estatus legal:</label>
                        <select class="form-select" id="estatus_legal">
                            <option value="">Seleccionar</option>
                            <option value="ciudadano">Ciudadano</option>
                            <option value="residente">Residente</option>
                            <option value="permiso_trabajo">Permiso de trabajo</option>
                            <option value="tax_id">Tax id</option>
                        </select>
                    </div>
                </div>
                <div class="w-100 d-flex flex-row justify-content-between mb-2 d-none primer-comprador-field">
                    <div class="w-100">
                        <label for="address mb-2" id="primer_comprador_label">¿Es primer comprador?:</label>
                        <select class="form-select" id="primer_comprador">
                            <option value="">Seleccionar</option>
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                </div>
                <div class="mb-2 d-flex flex-row w-100 justify-content-between forma-pago-container d-none">
                    <div style="width:45%">
                        <label for="address mb-2" id="forma_pago_label">Forma de pago:</label>
                        <select class="form-select" id="forma_pago">
                            <option value="">Seleccionar</option>
                            <option value="medio_electronico">Medio electrónico</option>
                            <option value="cash">Cash</option>
                        </select>
                    </div>
                    <div style="width:45%">
                        <label for="address mb-2" id="tiempo_pago_electronico_label">Tiempo pagando:</label>
                        <div class="d-flex flex-row w-100">
                            <div class="w-50">
                                <input class="form-control" id="tiempo_pago" placeholder="Cantidad">
                            </div>
                            <div class="w-50">
                                <select class="form-select" id="tiempo_pago_formato">
                                    <option value="dias">Día(s)</option>
                                    <option value="meses">Mes(es)</option>
                                    <option value="anio">Año(s)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="w-100 d-flex flex-row justify-content-between">

                    <div style="width: 45%">
                        <label for="mortgage" id="disponible_comprar_label">Disp. para comprar:</label>
                        <input class="form-control" id="disponible_comprar" placeholder="Disponibilidad para comprar">
                    </div>
                    <div style="width:45%">
                        <label for="gastos_cierre mb-2" id="cedito_cliente_label">Crédito cliente:</label>
                        <input id="credito_cliente" class="form-control" placeholder="Crédito del cliente">
                    </div>
                </div>
                <div class="w-100 mt-3 d-none" id="tabla_income_info">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div style="font-size: 13px; font-weight: bold">DETALLE DE INGRESOS</div>
                        <button type="button" class="btn btn-sm btn-primary" onclick="agregarTarjetaCliente()">
                            <i class="fas fa-user-plus"></i> Añadir Cliente/Co-Prestatario
                        </button>
                    </div>
                    <div id="income_cards_container" style="max-height: 500px; overflow-y: auto; border: 1px solid #ddd; border-radius: 10px; padding: 10px; background: #fdfdfd;">
                    </div>
                </div>
            </div>
            <div class="modal-divider mx-2"></div>
            <div style="overflow-y: auto; width: 30%">
                <div class="d-flex flex-row w-100 justify-content-between px-2">
                    <div style="font-size: 13px; font-weight: bold">ESTIMACIONES</div>
                </div>
                <hr class="m-2">
                <div class="w-100 d-flex flex-row justify-content-between mb-2">
                    <div style="width:45%">
                        <label for="gastos_cierre mb-2" id="monto_max_label">Monto máx aplicado:</label>
                        <input class="form-control" id="monto_max" placeholder="Máximo que el cliente aplica" <?php if ($_SESSION['user_role'] != "admin") { ?> disabled <?php } ?>>
                    </div>
                    <div style="width: 45%">
                        <label for="address" id="interes_ofrecido_label">Interés ofrecido:</label>
                        <input class="form-control" id="interes_ofrecido" placeholder="Interés ofrecido" <?php if ($_SESSION['user_role'] != "admin") { ?> disabled <?php } ?>>
                    </div>
                </div>
                <div class="w-100 d-flex flex-row justify-content-between mb-2">
                    <div style="width:45%">
                        <label for="address" id="down_payment_label">Down payment (%):</label>
                        <div class="w-100 d-flex flex-row">
                            <div>
                                <input class="form-control" style="width: 40%" id="down_payment" placeholder="Down payment" <?php if ($_SESSION['user_role'] != "admin") { ?> disabled <?php } ?>>
                            </div>
                            <div class="mt-2">
                                <span id="down_payment_label_percent">0,00</span>
                            </div>
                        </div>
                    </div>
                    <div style="width: 45%">
                        <label for="address" id="gastos_cierre_label">Gastos de cierre (%):</label>
                        <div class="w-100 d-flex flex-row">
                            <div>
                                <input style="width:40%" class="form-control" id="gastos_cierre" placeholder="Gastos de cierre" <?php if ($_SESSION['user_role'] != "admin") { ?> disabled <?php } ?>>
                            </div>
                            <div class="mt-2">
                                <span id="gastos_cierre_percent_label">0,00</span>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="w-100 mb-2">
                    <label>Total requerido:</label>
                    <input class="form-control" id="total_requerido" disabled placeholder="Total requerido">
                </div>
                <div class="mb-2 d-flex flex-row w-100 justify-content-between programa_container d-none">
                    <div style='width:45%'>
                        <label for="address mb-2" id="programa_aplica_label">Programa al que aplica:</label>
                        <select class="form-select" id="programa_aplica">
                            <option value="">Seleccionar</option>
                            <option value="fha">Fha</option>
                            <option value="conventional">Conventional</option>
                            <option value="usda">Usda</option>
                            <option value="va_loan">Va Loan</option>
                            <option value="fnba">Fnba</option>
                        </select>
                    </div>
                    <div style='width:45%'>
                        <label for="address mb-2" id="loan_amount_compra_label">Loan Amount:</label>
                        <input class="form-control" placeholder="Loan amount" id="loan_amount_compra">
                    </div>
                </div>
                <div class="mb-2">
                    <label for="aditional_conditions" id="conditions_label">Condiciones o notas importantes:</label>
                    <textarea class="form-control" id="conditions" placeholder="Agregar información importante..." rows="2" <?php if ($_SESSION['user_role'] != "admin") { ?> disabled <?php } ?>></textarea>
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