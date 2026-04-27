<?php

class boardsController
{

    public function __construct()
    {
        require_once "modelo/boardsModel.php";
        require_once "modelo/gestionModel.php";
        require_once "modelo/compraModel.php";
        require_once "modelo/usersModel.php";
        require_once "modelo/historialModel.php";
    }
    public function index()
    {
        session_start();
        if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
            require_once "vista/login.php";
            session_destroy();
        } else {
            $modelo = new boards_model();
            $modelo_users = new users_model();
            $boards = $modelo->get_boards();
            $usuarios = $modelo_users->get_users();
            $boards_users = $modelo->get_all_boards_users($_SESSION['user_id']);
            $raw_gestions = $modelo->get_boards_users_gestions();

            $users_gestions = [];
            if (is_array($raw_gestions)) {
                foreach ($raw_gestions as $gestion) {
                    if ($gestion['user_id'] == $_SESSION['user_id']) {
                        $users_gestions[$gestion['id_board']] = $gestion;
                    }
                }
            }
            require_once "vista/boards.php";
        }
    }

    public function register()
    {

        session_start();
        if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
            require_once "vista/login.php";
            session_destroy();
        } else {
            require_once "vista/add_board.php";
        }
    }

    public function detail()
    {
        session_start();
        if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
            require_once "vista/login.php";
            session_destroy();
        } else {
            $modelo = new boards_model();
            $board_info = $modelo->get_boards_by_id($_GET['info']);
            $board_type = $board_info[0]['board_type'];
            if ($board_type == "gestion_clientes") $all_gestions = $modelo->get_boards_gestions($_GET['info']);
            if ($board_type == "compras") $all_gestions = $modelo->get_boards_compras($_GET['info']);

            $boards_users = $modelo->get_boards_users($_GET['info']);
            $modelo_users = new users_model();
            $usuarios = $modelo_users->get_users();
            require_once "vista/board_detail.php";
        }
    }

    public function get_board_info_modal()
    {
        $modelo = new boards_model();
        $id = $_POST['board_id'];
        $board_info = $modelo->get_boards_by_id($id);
        $boards_users = $modelo->get_boards_users($id);
        echo json_encode([
            "board_info" => $board_info,
            "board_users" => $boards_users
        ]);
    }

    public function add_board()
    {
        $users = $_POST['users_selected'] ?? "";
        session_start();
        $modelo = new boards_model();

        // Obtenemos la conexión desde el modelo
        $db = $modelo->get_conexion();
        $db->beginTransaction();

        try {
            $modelo->set_board($_SESSION['user_id'], $_POST['name'], $_POST['type']);
            $resultado = $modelo->registrar();

            if ($resultado === true) {
                $registered_board = $modelo->get_last_board();
                if ($users != "") {
                    foreach ($users as $user_id) {
                        $modelo->register_user_board($registered_board[0]['id_board'], $user_id);
                    }
                }
                $db->commit();
                echo $registered_board[0]['id_board'];
            } else {
                throw new Exception($resultado); // Captura el error de PDO que retorna tu modelo
            }
        } catch (Exception $e) {
            $db->rollBack();
            http_response_code(500);
            echo "Error: " . $e->getMessage();
        }
    }

    public function add_gestion()
    {
        session_start();
        $modelo = new boards_model();
        $modelo_gestion = new gestion_model();
        $modelo_historial = new historial_model();

        $db = $modelo_gestion->get_conexion();
        $db->beginTransaction();

        try {
            // Manejo de cliente
            $check_client = $modelo->get_client($_POST['client_phone']);
            if (!$check_client) {
                $check_client = $modelo->add_client(strtolower($_POST['client_name']), strtolower($_POST['client_last_name']), $_POST['client_phone']);
            }

            $modelo_gestion->set_gestion($_POST['board'], $check_client, $_POST['user_id'], $_POST['property_address'], $_POST['property_value'], $_POST['interes_actual'], $_POST['mortgage'], $_POST['occupancy'], $_POST['call_detail'], $_POST['ltv'], $_POST['interes_estimado'], $_POST['prepayment_penalty'], $_POST['gastos_cierre'], $_POST['tipo_prestamo'], $_POST['condiciones_adicionales'], $_POST['loan_amount'], $_POST['cashout'], $_POST['mortgage_estimado'], $_POST['prioridad']);

            $res_reg = $modelo_gestion->registrar();
            if ($res_reg !== true) throw new Exception("Error registro: " . $res_reg);

            $last_gestion = $modelo_gestion->get_last_gestion();
            $id_gestion = $last_gestion[0]['id_gestion'];

            // Notas y deudas
            if (isset($_POST['comments'])) {
                foreach ($_POST['comments'] as $note) {
                    $modelo_gestion->add_note($id_gestion, $_SESSION['user_id'], $note);
                }
            }

            if (isset($_POST['deudas_adicionales'])) {
                foreach ($_POST['deudas_adicionales'] as $deuda) {
                    $modelo_gestion->add_deuda($id_gestion, $deuda['descripcion'], $deuda['monto']);
                }
            }

            // Historial
            $accion = "El usuario " . $_SESSION['username'] . " ha registrado la gestión";
            $modelo_historial->set_historial($id_gestion, $_SESSION['user_id'], $accion, 'registro', 'gestion');
            $modelo_historial->registrar();

            $db->commit();
            echo $id_gestion;
        } catch (Exception $e) {
            $db->rollBack();
            http_response_code(500);
            echo "Error crítico: " . $e->getMessage();
        }
    }

    public function add_compra()
    {
        session_start();
        $modelo = new boards_model();
        $modelo_compra = new compra_model();
        $modelo_historial = new historial_model();

        $db = $modelo_compra->get_conexion();
        $db->beginTransaction();

        try {
            $check_client = $modelo->get_client($_POST['client_phone']);
            if (!$check_client) {
                $check_client = $modelo->add_client(strtolower($_POST['client_name']), strtolower($_POST['client_last_name']), $_POST['client_phone']);
            }

            $modelo_compra->set_compra($_POST['board'], $check_client, $_POST['user_asigned'], $_POST['tipo_proceso'], $_POST['primer_comprador'], $_POST['forma_pago'], $_POST['tiempo_pago_electronico'], $_POST['disponibilidad_comprar'], $_POST['credito_cliente'], $_POST['estatus_legal'], $_POST['interes_ofrecido'], $_POST['gastos_cierre'], $_POST['down_payment'], $_POST['monto_max'], $_POST['condiciones'], $_POST['call_detail'], $_POST['total_requerido'], $_POST['programa_aplica'], $_POST['realtor_name'], $_POST['realtor_tlf'], $_POST['realtor_email'], $_POST['prioridad']);

            $res_reg = $modelo_compra->registrar();
            if ($res_reg !== true) throw new Exception("Error registro: " . $res_reg);

            $last_compra = $modelo_compra->get_last_compra();
            $id_compra = $last_compra[0]['id_compra'];

            // Lógica compleja de ingresos
            if (isset($_POST['detalle_ingresos'])) {
                $ingresos = json_decode($_POST['detalle_ingresos'], true);
                if (is_array($ingresos)) {
                    foreach ($ingresos as $cliente) {
                        $id_cliente_income = $modelo_compra->add_cliente_income($id_compra, strtolower($cliente['nombre']), strtolower($cliente['apellido']), $cliente['fico'] ?? null, $cliente['deuda'] ?? 0, $cliente['estatusLegal'] ?? null);

                        foreach ($cliente['trabajos'] as $job) {
                            $id_trabajo = $modelo_compra->add_cliente_trabajo($id_cliente_income, $job['tipo'], $job['empresa'], $job['modo'] ?? 'taxes', $job['valor_hora'] ?? null, $job['horas_semanales'] ?? null, $job['frecuencia_anual'] ?? null, $job['incomeAnual']);

                            if (!empty($job['detallesTaxes'])) {
                                foreach ($job['detallesTaxes'] as $tax) {
                                    $modelo_compra->add_trabajo_tax_detalle($id_trabajo, $tax['anio'], $tax['monto']);
                                }
                            }
                        }
                    }
                }
            }

            if (isset($_POST['comments'])) {
                foreach ($_POST['comments'] as $note) {
                    $modelo_compra->add_note($id_compra, $_SESSION['user_id'], $note);
                }
            }

            $accion = "El usuario " . $_SESSION['username'] . " ha registrado la compra";
            $modelo_historial->set_historial($id_compra, $_SESSION['user_id'], $accion, 'registro_compra', 'compra');
            $modelo_historial->registrar();

            $db->commit();
            echo $id_compra;
        } catch (Exception $e) {
            $db->rollBack();
            http_response_code(500);
            echo "Error en compra: " . $e->getMessage();
        }
    }
    public function update_compra_info()
    {
        session_start();
        $modelo = new boards_model();
        $modelo_compra = new compra_model();

        $db = $modelo_compra->get_conexion();
        $db->beginTransaction();

        try {
            $id_compra = $_POST['gestion_id'];
            $gestion_info = $modelo_compra->get_gestion_info($id_compra);

            $name = empty($_POST['client_name']) ? $gestion_info[0]['name'] : $_POST['client_name'];
            $last_name = empty($_POST['client_last_name']) ? $gestion_info[0]['last_name'] : $_POST['client_last_name'];
            $phone = empty($_POST['client_phone']) ? $gestion_info[0]['phone'] : $_POST['client_phone'];

            $check_client = $modelo->get_client($phone);
            if (!$check_client) {
                $check_client = $modelo->add_client(strtolower($name), strtolower($last_name), $phone);
            } else {
                $modelo->update_client(strtolower($name), strtolower($last_name), $phone);
            }

            $call_detail = empty($_POST['call_detail']) ? $gestion_info[0]['detalle_llamada'] : $_POST['call_detail'];
            $tipo_proceso = empty($_POST['tipo_proceso']) ? $gestion_info[0]['tipo_proceso'] : $_POST['tipo_proceso'];
            $estatus_legal = empty($_POST['estatus_legal']) ? $gestion_info[0]['estatus_legal'] : $_POST['estatus_legal'];
            $primer_comprador = empty($_POST['primer_comprador']) ? $gestion_info[0]['primer_comprador'] : $_POST['primer_comprador'];
            $forma_pago = empty($_POST['forma_pago']) ? $gestion_info[0]['forma_pago'] : $_POST['forma_pago'];
            $tiempo_pago_electronico = empty($_POST['tiempo_pago_electronico']) ? $gestion_info[0]['tiempo_pago_electronico'] : $_POST['tiempo_pago_electronico'];
            $disponibilidad_comprar = empty($_POST['disponibilidad_comprar']) ? $gestion_info[0]['disponible_comprar'] : $_POST['disponibilidad_comprar'];
            $credito_cliente = empty($_POST['credito_cliente']) ? $gestion_info[0]['credito_cliente'] : $_POST['credito_cliente'];
            $interes_ofrecido = empty($_POST['interes_ofrecido']) ? $gestion_info[0]['interes_ofrecido'] : $_POST['interes_ofrecido'];
            $gastos_cierre = empty($_POST['gastos_cierre']) ? $gestion_info[0]['gastos_cierre'] : $_POST['gastos_cierre'];
            $down_payment = empty($_POST['down_payment']) ? $gestion_info[0]['down_payment'] : $_POST['down_payment'];
            $monto_max = empty($_POST['monto_max']) ? $gestion_info[0]['monto_max_aplicado'] : $_POST['monto_max'];
            $condiciones = empty($_POST['condiciones']) ? $gestion_info[0]['condiciones_notas'] : $_POST['condiciones'];
            $total_requerido = empty($_POST['total_requerido']) ? $gestion_info[0]['total_requerido'] : $_POST['total_requerido'];
            $programa_aplica = empty($_POST['programa_aplica']) ? $gestion_info[0]['programa_aplica'] : $_POST['programa_aplica'];
            $realtor_name = empty($_POST['realtor_name']) ? $gestion_info[0]['realtor_name'] : $_POST['realtor_name'];
            $realtor_tlf = empty($_POST['realtor_tlf']) ? $gestion_info[0]['realtor_tlf'] : $_POST['realtor_tlf'];
            $realtor_email = empty($_POST['realtor_email']) ? $gestion_info[0]['realtor_email'] : $_POST['realtor_email'];


            $modelo_compra->set_compra($_POST['board'], $check_client, $_POST['user_asigned'], $tipo_proceso, $primer_comprador, $forma_pago, $tiempo_pago_electronico, $disponibilidad_comprar, $credito_cliente, $estatus_legal, $interes_ofrecido, $gastos_cierre, $down_payment, $monto_max, $condiciones, $call_detail, $total_requerido, $programa_aplica, $realtor_name, $realtor_tlf, $realtor_email, $_POST['prioridad']);
            $resp = $modelo_compra->update_compra_info($id_compra);


            $modelo_compra->delete_cliente_compra($id_compra);
            $modelo_compra->set_compra($_POST['board'], $check_client, $_POST['user_asigned'], $_POST['tipo_proceso'], $_POST['primer_comprador'], $_POST['forma_pago'], $_POST['tiempo_pago_electronico'], $_POST['disponibilidad_comprar'], $_POST['credito_cliente'], $_POST['estatus_legal'], $_POST['interes_ofrecido'], $_POST['gastos_cierre'], $_POST['down_payment'], $_POST['monto_max'], $_POST['condiciones'], $_POST['call_detail'], $_POST['total_requerido'], $_POST['programa_aplica'], $_POST['realtor_name'], $_POST['realtor_tlf'], $_POST['realtor_email'], $_POST['prioridad']);
            $resp = $modelo_compra->update_compra_info($id_compra);

            $modelo_compra->delete_cliente_compra($id_compra);

            if (isset($_POST['detalle_ingresos'])) {
                $ingresos = json_decode($_POST['detalle_ingresos'], true);
                if (is_array($ingresos)) {
                    foreach ($ingresos as $cliente) {
                        $id_cliente_income = $modelo_compra->add_cliente_income($id_compra, strtolower($cliente['nombre']), strtolower($cliente['apellido']), $cliente['fico'] ?? null, $cliente['deuda'] ?? 0, $cliente['estatusLegal'] ?? null);
                        foreach ($cliente['trabajos'] as $job) {
                            $id_trabajo = $modelo_compra->add_cliente_trabajo($id_cliente_income, $job['tipo'], $job['empresa'], $job['modo'] ?? 'taxes', $job['valor_hora'] ?? null, $job['horas_semanales'] ?? null, $job['frecuencia_anual'] ?? null, $job['incomeAnual']);
                            if (!empty($job['detallesTaxes'])) {
                                foreach ($job['detallesTaxes'] as $tax) {
                                    $modelo_compra->add_trabajo_tax_detalle($id_trabajo, $tax['anio'], $tax['monto']);
                                }
                            }
                        }
                    }
                }
            }

            if (isset($_POST['comments'])) {
                foreach ($_POST['comments'] as $note) {
                    $modelo_compra->add_note($id_compra, $_SESSION['user_id'], $note);
                }
            }

            $accion = "El usuario " . $_SESSION['username'] . " ha modificado información de la gestión";
            $tipo_accion = "modificacion";
            $modelo_historial = new historial_model();
            $modelo_historial->set_historial($id_compra, $_SESSION['user_id'], $accion, $tipo_accion, 'compra');
            $modelo_historial->registrar();

            $db->commit();
            echo $resp;
        } catch (Exception $e) {
            $db->rollBack();
            http_response_code(500);
            echo "Error: " . $e->getMessage();
        }
    }

    public function update_gestion_info()
    {
        session_start();
        $modelo = new boards_model();
        $modelo_gestion = new gestion_model();
        $gestion_info = $modelo_gestion->get_gestion_info($_POST['gestion_id']);

        $name = empty($_POST['client_name']) ? $gestion_info[0]['name'] : $_POST['client_name'];
        $last_name = empty($_POST['client_last_name']) ? $gestion_info[0]['last_name'] : $_POST['client_last_name'];
        $phone =  empty($_POST['client_phone']) ? $gestion_info[0]['phone'] : $_POST['client_phone'];

        $check_client = $modelo->get_client(strtolower($_POST['client_phone']));
        if (!$check_client) {
            $check_client = $modelo->add_client(strtolower($name), strtolower($last_name), $phone);
        } else {
            $check_client = $modelo->update_client(strtolower($name), strtolower($last_name), $phone);
        }

        $property_address = empty($_POST['property_address']) ? $gestion_info[0]['property_address'] : $_POST['property_address'];
        $property_value = empty($_POST['property_value']) ? $gestion_info[0]['property_value'] : $_POST['property_value'];
        $interes_actual = empty($_POST['interes_actual']) ? $gestion_info[0]['interes_actual'] : $_POST['interes_actual'];
        $mortgage = empty($_POST['mortgage']) ? $gestion_info[0]['mortgage'] : $_POST['mortgage'];
        $occupancy = empty($_POST['occupancy']) ? $gestion_info[0]['occupancy'] : $_POST['occupancy'];
        $call_detail = empty($_POST['call_detail']) ? $gestion_info[0]['detalle_llamada'] : $_POST['call_detail'];
        $ltv = empty($_POST['ltv']) ? $gestion_info[0]['ltv'] : $_POST['ltv'];
        $interes_estimado = empty($_POST['interes_estimado']) ? $gestion_info[0]['interes_estimado'] : $_POST['interes_estimado'];
        $prepayment_penalty = empty($_POST['prepayment_penalty']) ? $gestion_info[0]['prepayment_penalty'] : $_POST['prepayment_penalty'];
        $gastos_cierre = empty($_POST['gastos_cierre']) ? $gestion_info[0]['gastos_cierre'] : $_POST['gastos_cierre'];
        $tipo_prestamo = empty($_POST['tipo_prestamo']) ? $gestion_info[0]['tipo_prestamo'] : $_POST['tipo_prestamo'];
        $condiciones_adicionales = empty($_POST['condiciones_adicionales']) ? $gestion_info[0]['condiciones_adicionales'] : $_POST['condiciones_adicionales'];
        $loan_amount = empty($_POST['loan_amount']) ? $gestion_info[0]['loan_amount'] : $_POST['loan_amount'];
        $cashout = empty($_POST['cashout']) ? $gestion_info[0]['cash_out'] : $_POST['cashout'];
        $mortgage_estimado = empty($_POST['mortgage_estimado']) ? $gestion_info[0]['mortgage_estimado'] : $_POST['mortgage_estimado'];



        $modelo_gestion->set_gestion($_POST['board'], $check_client, $_POST['user_id'], $property_address, $property_value, $interes_actual, $mortgage, $occupancy, $call_detail, $ltv, $interes_estimado, $prepayment_penalty, $gastos_cierre, $tipo_prestamo, $condiciones_adicionales, $loan_amount, $cashout, $mortgage_estimado, $_POST['prioridad']);
        $resp = $modelo_gestion->update_gestion_info($_POST['gestion_id']);
        $accion = "El usuario " . $_SESSION['username'] . " ha modificado información de la gestión";
        $tipo_accion = "modificacion";
        $id_gestion = $_POST['gestion_id'];
        $modelo_historial = new historial_model();
        $modelo_historial->set_historial($id_gestion, $_SESSION['user_id'], $accion, $tipo_accion, 'gestion');
        $modelo_historial->registrar();
        echo $resp;
    }

    public function update_gestion()
    {
        session_start();
        $modelo_gestion = new gestion_model();
        $modelo_compra = new compra_model();
        $modelo_historial = new historial_model();
        $last_status = $_POST['tipo_gestion'] == "gestion_clientes" ? $modelo_gestion->get_gestion_info($_POST['id_gestion']) : $modelo_compra->get_gestion_info($_POST['id_gestion']);
        $accion = "El usuario " . $_SESSION['username'] . " cambio el estado de la gestión de " . strtolower($last_status[0]['etapa_actual']) . " a " . strtolower($_POST['new_etapa']);
        $tipo_accion = "cambio_estado";
        $modelo_historial->set_historial($_POST['id_gestion'], $_SESSION['user_id'], $accion, $tipo_accion, $_POST['tipo_gestion'] == "gestion_clientes" ? 'gestion' : 'compra');
        $modelo_historial->registrar();

        echo $_POST['tipo_gestion'] == "gestion_clientes" ? $modelo_gestion->update_gestion(strtolower($_POST['new_etapa']), $_POST['id_gestion']) : $modelo_compra->update_gestion(strtolower($_POST['new_etapa']), $_POST['id_gestion']);;
    }

    public function update_board()
    {
        session_start();
        $modelo = new boards_model();
        echo $modelo->update_board(strtolower($_POST['order_etapas']), $_POST['id_board']);
    }


    public function change_board_order()
    {
        $model = new boards_model();
        $modelo_gestion = new gestion_model();
        $board_info = $model->get_boards_by_id($_POST['id_board']);
        $etapas = explode("/", $board_info[0]['etapas']);
        $i = 0;
        foreach ($etapas as $etapa) {
            if ($etapa == $_POST['column']) {
                switch ($_POST['opt']) {
                    case 'mover columna a la izquierda':
                        $aux = $etapas[$i - 1];
                        $etapas[$i - 1] = $etapa;
                        $etapas[$i] = $aux;
                        break;
                    case 'mover columna a la derecha':
                        $aux = $etapas[$i + 1];
                        $etapas[$i + 1] = $etapa;
                        $etapas[$i] = $aux;
                        break;
                    case 'cambiar nombre de columna':
                        $new_name_column = $_POST['new_name'];
                        $etapas[$i] = $new_name_column;
                        break;
                    default:
                        if ($i != 0) {
                            $new_etapa = $etapas[$i - 1];
                        } else {
                            $new_etapa = $etapas[$i + 1];
                        }
                        $all_gestions = $model->get_boards_gestions($_POST['id_board']);
                        foreach ($all_gestions as $gestion) {
                            if ($gestion['etapa_actual'] == $etapa) {
                                $modelo_gestion->update_gestion(strtolower($new_etapa), $gestion['id_gestion']);
                            }
                        }
                        array_splice($etapas, $i, 1);
                        break;
                }
            }

            $i++;
        }
        echo  $model->update_board(strtolower(implode('/', $etapas)), $_POST['id_board']);
    }


    public function update_board_access()
    {
        $modelo = new boards_model();
        $db = $modelo->get_conexion();
        $db->beginTransaction();

        try {
            $modelo->update_board_name($_POST['board_id'], $_POST['name'], $_POST['board_enabled']);
            $modelo->delete_relations($_POST['board_id']);

            $users = $_POST['users_selected'] ?? "";
            if ($users != "") {
                foreach ($users as $user_id) {
                    $modelo->register_user_board($_POST['board_id'], $user_id);
                }
            }
            $db->commit();
            echo true;
        } catch (Exception $e) {
            $db->rollBack();
            echo false;
        }
    }
    public function export_excel()
    {
        $board_type = $_POST['type_board'];
        $modelo = new boards_model();
        $resp = $modelo->get_excel_consult($board_type, $_POST['tickets']);
        echo json_encode($resp);
    }


    public function delete_gestion_ticket()
    {
        $board_type = $_POST['type_gestion'];
        $gestion_id = $_POST['id_gestion'];
        $modelo = new boards_model();
        $resp = $modelo->get_delete_gestion($board_type, $gestion_id);
        echo $resp;
    }
}
