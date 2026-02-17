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
            $boards = $modelo->get_boards();
            $modelo_users = new users_model();
            $usuarios = $modelo_users->get_users();
            $boards_users = $modelo->get_all_boards_users($_SESSION['user_id']);
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
            // $modelo = new users_model();
            // $usuarios = $modelo->get_users();
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

    public function add_board()
    {
        $users = $_POST['users_selected'] ?? "";
        session_start();
        $modelo = new boards_model();
        $modelo->set_board($_SESSION['user_id'], $_POST['name'], $_POST['type']);


        $resultado = $modelo->registrar();

        if ($resultado) {
            $registered_board = $modelo->get_last_board();
            if ($users != "") {
                foreach ($users as $user_id) {
                    $modelo->register_user_board($registered_board[0]['id_board'], $user_id);
                }
            }
            echo $registered_board[0]['id_board'];
        } else {
            echo $resultado;
        }
    }

    public function add_gestion()
    {
        session_start();
        $modelo = new boards_model();
        $modelo_gestion = new gestion_model();
        $check_client = $modelo->get_client(strtolower($_POST['client_phone']));
        if (!$check_client) {
            $check_client = $modelo->add_client(strtolower($_POST['client_name']), strtolower($_POST['client_last_name']), $_POST['client_phone']);
        }
        $modelo_gestion->set_gestion($_POST['board'], $check_client, $_SESSION['user_id'], $_POST['property_address'], $_POST['property_value'], $_POST['interes_actual'], $_POST['mortgage'], $_POST['occupancy'], $_POST['call_detail'], $_POST['ltv'], $_POST['interes_estimado'], $_POST['prepayment_penalty'], $_POST['gastos_cierre'], $_POST['tipo_prestamo'], $_POST['condiciones_adicionales'], $_POST['loan_amount'], $_POST['cashout']);
        $resp = $modelo_gestion->registrar();
        $last_gestion = $modelo_gestion->get_last_gestion();
        if (isset($_POST['comments'])) {
            foreach ($_POST['comments'] as $note) {
                $modelo_gestion->add_note($last_gestion[0]['id_gestion'], $_SESSION['user_id'], $note);
            }
        }
        if (isset($_POST['deudas_adicionales'])) {
            foreach ($_POST['deudas_adicionales'] as $deuda) {
                $modelo_gestion->add_deuda($last_gestion[0]['id_gestion'], $deuda['descripcion'], $deuda['monto']);
            }
        }
        $accion = "El usuario " . $_SESSION['username'] . " ha registrado le gestión";
        $tipo_accion = "registro";
        $id_gestion = $last_gestion[0]['id_gestion'];
        $modelo_historial = new historial_model();
        $modelo_historial->set_historial($id_gestion, $_SESSION['user_id'], $accion, $tipo_accion, 'gestion');
        $modelo_historial->registrar();
        echo $last_gestion[0]['id_gestion'];
    }

    public function add_compra()
    {
        session_start();
        $modelo = new boards_model();
        $modelo_compra = new compra_model();
        $check_client = $modelo->get_client(strtolower($_POST['client_phone']));
        if (!$check_client) {
            $check_client = $modelo->add_client(strtolower($_POST['client_name']), strtolower($_POST['client_last_name']), $_POST['client_phone']);
        }

        $modelo_compra->set_compra($_POST['board'], $check_client, $_SESSION['user_id'], $_POST['tipo_proceso'], $_POST['primer_comprador'], $_POST['forma_pago'], $_POST['tiempo_pago_electronico'], $_POST['disponibilidad_comprar'], $_POST['credito_cliente'], $_POST['estatus_legal'], $_POST['interes_ofrecido'], $_POST['gastos_cierre'], $_POST['down_payment'], $_POST['monto_max'], $_POST['condiciones'], $_POST['call_detail'], $_POST['total_requerido']);
        $resp = $modelo_compra->registrar();
        $last_gestion = $modelo_compra->get_last_compra();

        if (isset($_POST['comments'])) {
            foreach ($_POST['comments'] as $note) {
                echo $modelo_compra->add_note($last_gestion[0]['id_compra'], $_SESSION['user_id'], $note);
            }
        }
        $accion = "El usuario " . $_SESSION['username'] . " ha registrado la compra";
        $tipo_accion = "registro_compra";
        $id_gestion = $last_gestion[0]['id_compra'];
        $modelo_historial = new historial_model();
        $modelo_historial->set_historial($id_gestion, $_SESSION['user_id'], $accion, $tipo_accion, 'compra');
        $modelo_historial->registrar();
        $modelo_historial->registrar();
        echo $last_gestion[0]['id_compra'];
    }


    public function update_compra_info()
    {
        session_start();
        $modelo = new boards_model();
        $modelo_compra = new compra_model();
        $gestion_info = $modelo_compra->get_gestion_info($_POST['gestion_id']);

        $name = empty($_POST['client_name']) ? $gestion_info[0]['name'] : $_POST['client_name'];
        $last_name = empty($_POST['client_last_name']) ? $gestion_info[0]['last_name'] : $_POST['client_last_name'];
        $phone =  empty($_POST['client_phone']) ? $gestion_info[0]['phone'] : $_POST['client_phone'];


        $check_client = $modelo->get_client(strtolower($_POST['client_phone']));

        if (!$check_client) {
            $check_client = $modelo->add_client(strtolower($name), strtolower($last_name), $phone);
        } else {
            $check_client = $modelo->update_client(strtolower($name), strtolower($last_name), $phone);
        }

        $call_detail = empty($_POST['call_detail']) ? $gestion_info[0]['detalle_llamada'] : $_POST['call_detail'];
        $tipo_proceso = empty($_POST['tipo_proceso']) ? $gestion_info[0]['tipo_proceso'] : $_POST['tipo_proceso'];
        $estatus_legal =  empty($_POST['estatus_legal']) ? $gestion_info[0]['estatus_legal'] : $_POST['estatus_legal'];
        $primer_comprador =  empty($_POST['primer_comprador']) ? $gestion_info[0]['primer_comprador'] : $_POST['primer_comprador'];
        $forma_pago =  empty($_POST['forma_pago']) ? $gestion_info[0]['forma_pago'] : $_POST['forma_pago'];
        $tiempo_pago_electronico =  empty($_POST['tiempo_pago_electronico']) ? $gestion_info[0]['tiempo_pago_electronico'] : $_POST['tiempo_pago_electronico'];
        $disponibilidad_comprar =  empty($_POST['disponibilidad_comprar']) ? $gestion_info[0]['disponible_comprar'] : $_POST['disponibilidad_comprar'];
        $credito_cliente =  empty($_POST['credito_cliente']) ? $gestion_info[0]['credito_cliente'] : $_POST['credito_cliente'];
        $interes_ofrecido =  empty($_POST['interes_ofrecido']) ? $gestion_info[0]['interes_ofrecido'] : $_POST['interes_ofrecido'];
        $gastos_cierre =  empty($_POST['gastos_cierre']) ? $gestion_info[0]['gastos_cierre'] : $_POST['gastos_cierre'];
        $down_payment =  empty($_POST['down_payment']) ? $gestion_info[0]['down_payment'] : $_POST['down_payment'];
        $monto_max =  empty($_POST['monto_max']) ? $gestion_info[0]['monto_max_aplicado'] : $_POST['monto_max'];
        $condiciones =  empty($_POST['condiciones']) ? $gestion_info[0]['condiciones_notas'] : $_POST['condiciones'];
        $total_requerido =  empty($_POST['total_requerido']) ? $gestion_info[0]['total_requerido'] : $_POST['total_requerido'];

        $modelo_compra->set_compra($_POST['board'], $check_client, $_SESSION['user_id'], $tipo_proceso, $primer_comprador, $forma_pago, $tiempo_pago_electronico, $disponibilidad_comprar, $credito_cliente, $estatus_legal, $interes_ofrecido, $gastos_cierre, $down_payment, $monto_max, $condiciones, $call_detail, $total_requerido);
        $resp = $modelo_compra->update_compra_info($_POST['gestion_id']);

        $last_gestion = $modelo_compra->get_last_compra();

        if (isset($_POST['comments'])) {
            foreach ($_POST['comments'] as $note) {
                echo $modelo_compra->add_note($last_gestion[0]['id_compra'], $_SESSION['user_id'], $note);
            }
        }
        $accion = "El usuario " . $_SESSION['username'] . " ha registrado la compra";
        $tipo_accion = "registro_compra";
        $accion = "El usuario " . $_SESSION['username'] . " ha modificado información de la gestión";
        $tipo_accion = "modificacion";
        $id_gestion = $_POST['gestion_id'];
        $modelo_historial = new historial_model();
        $modelo_historial->set_historial($id_gestion, $_SESSION['user_id'], $accion, $tipo_accion, 'compra');
        $modelo_historial->registrar();
        echo $resp;
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



        $modelo_gestion->set_gestion($_POST['board'], $check_client, $_SESSION['user_id'], $property_address, $property_value, $interes_actual, $mortgage, $occupancy, $call_detail, $ltv, $interes_estimado, $prepayment_penalty, $gastos_cierre, $tipo_prestamo, $condiciones_adicionales, $loan_amount, $cashout);
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
        $modelo->update_board_name($_POST['board_id'], $_POST['name']);
        if ($modelo->delete_relations($_POST['board_id'])) {
            $users = $_POST['users_selected'] ?? "";
            if ($users != "") {
                foreach ($users as $user_id) {
                    $modelo->register_user_board($_POST['board_id'], $user_id);
                }
            }
            echo true;
        }
    }
}
