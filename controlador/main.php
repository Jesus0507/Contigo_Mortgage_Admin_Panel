<?php

class mainController
{

	public function __construct()
	{
		require_once "modelo/mainModel.php";
		require_once "modelo/usersModel.php";
		require_once "modelo/clientsModel.php";
		require_once "modelo/boardsModel.php";
	}

	public function index()
	{
		$modelo = new main_model();
		$resp = 0;

		if (isset($_GET['init'])) {
			$modelo->set_user(strtolower($_POST['usuario']), $_POST['clave']);
			$resultado = $modelo->get_inicio();
			if (count($resultado) > 0) {
				session_start();
				$_SESSION['username'] = $resultado[0]['name'] . " " . $resultado[0]['last_name'];
				$_SESSION['user_role'] = $resultado[0]['role'];
				$_SESSION['user_id'] = $resultado[0]['user_id'];
				$_SESSION['first_login'] = $resultado[0]['first_login'];
				$_SESSION['email'] = $resultado[0]['email'];
				$_SESSION['psw'] = $resultado[0]['psw'];
				$_SESSION['security_questions'] = $resultado[0]['security_questions'];
				$_SESSION['custom_questions'] = $resultado[0]['custom_security_question'];
				$resp =  $resultado[0]['role'] == "admin" ? "index.php?c=main&a=main_view" : "index.php?c=boards&a=index";
			}
		} else {
			session_start();
			$resp = $_SESSION['user_role'] == "admin" ? "index.php?c=main&a=main_view" : "index.php?c=boards&a=index";
		}


		echo $resp;
	}

	public function change_monto_max()
	{
		$new_monto_mensual = $_POST['new_monto'];
		$modelo = new main_model();
		$modelo->update_monto_max($new_monto_mensual);
		echo true;
	}

	public function main_view()
	{
		session_start();
		if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
			require_once "vista/login.php";
			session_destroy();
		} else {
			$modelo = new main_model();
			$modeloUsers = new users_model();
			$modeloClients = new clients_model();
			$modeloBoards = new boards_model();
			$cantUsers = count($modeloUsers->get_users());
			$cantClients = count($modeloClients->get_clients());
			$cantBoards = count($modeloBoards->get_boards());
			$cantMyBoards = count($modeloBoards->get_my_boards($_SESSION['user_id']));
			$all_board_types = $modelo->get_unique_board_types();
			$boards = $modeloBoards->get_boards();
			$users = $modeloUsers->get_users();
			$all_etapas = $modelo->get_todas_las_etapas();
			$clients_tickets = $modelo->get_clientes_con_tickets();
			$monto_mensual = $modelo->get_monto_mensual();
			require_once "vista/main.php";
		}
	}
	public function get_report_preview_data()
	{
		// Recibimos y sanitizamos entradas básicas
		$filtros = [
			'tipos'        => $_POST['tipos'] ?? [],
			'tablas'       => $_POST['tablas'] ?? [],
			'agentes'      => $_POST['agentes'] ?? [],
			'estados'      => $_POST['estados'] ?? [],
			'clientes'     => $_POST['clientes'] ?? [],
			'fecha_inicio' => $_POST['fecha_inicio'] ?? null,
			'fecha_fin'    => $_POST['fecha_fin'] ?? null
		];

		// Validación obligatoria de fechas
		if (empty($filtros['fecha_inicio']) || empty($filtros['fecha_fin'])) {
			echo json_encode(['error' => 'Rango de fechas incompleto']);
			return;
		}

		$modelo = new main_model();
		$data = $modelo->get_filtered_report_data($filtros);

		if (isset($data['error'])) {
			http_response_code(500);
			echo json_encode($data);
		} else {
			echo json_encode($data);
		}
	}
	public function get_cartera_total_data()
	{
		$modelo = new main_model();
		$estadisticas = $modelo->get_stadistics();
		echo $estadisticas;
	}

	public function get_distribucion_prestamos()
	{
		$modelo = new main_model();
		$estadisticas = $modelo->get_distribucion_prestamos();
		echo $estadisticas;
	}

	public function get_clientes_sin_seguimiento()
	{
		// 1. Validamos si viene un agente_id específico desde el AJAX
		// Si no viene, se pasa como null para traer todos los agentes
		$agente_id = (isset($_POST['agente_id']) && $_POST['agente_id'] != "") ? $_POST['agente_id'] : null;

		$modelo = new main_model();

		// 2. Llamamos al método del modelo pasándole el ID del agente
		$estadisticas = $modelo->get_clientes_sin_seguimiento($agente_id);

		// 3. Retornamos el JSON al frontend
		echo $estadisticas;
	}

	public function get_comparativa_valores()
	{
		$modelo = new main_model();
		$estadisticas = $modelo->get_comparativa_valores();
		echo $estadisticas;
	}

	public function  get_meta_cierre_mensual()
	{
		$modelo = new main_model();
		$estadisticas = $modelo->get_meta_cierre_mensual();
		echo $estadisticas;
	}

	public function get_monthly_agent_stats()
	{
		// Verificación de sesión de admin (opcional pero recomendada)
		// if($_SESSION['role'] != 'admin') { echo json_encode(['error' => 'No autorizado']); return; }

		$modelo = new main_model();
		echo $modelo->get_monthly_agent_stats();
	}

	public function get_ranking_agentes()
	{
		$modelo = new main_model();
		echo $modelo->get_ranking_agentes();
	}

	public function get_embudo_ventas()
	{
		$modelo = new main_model();
		echo $modelo->get_embudo_ventas();
	}

	public function get_velocidad_cierre()
	{
		echo (new main_model())->get_velocidad_cierre();
	}

	public function get_carga_boards()
	{
		echo (new main_model())->get_carga_boards();
	}


	public function get_all_statistics() {}
}
