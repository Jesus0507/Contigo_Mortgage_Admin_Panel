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
				$resp = 1;
				session_start();
				$_SESSION['username'] = $resultado[0]['name'] . " " . $resultado[0]['last_name'];
				$_SESSION['user_role'] = $resultado[0]['role'];
				$_SESSION['user_id'] = $resultado[0]['user_id'];
			}
		} else {
			$resp = 1;
		}


		echo $resp;
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
			// $estadisticas = $modelo->get_stadistics();
			require_once "vista/main.php";
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

	public function get_velocidad_cierre() {
        echo (new main_model())->get_velocidad_cierre();
    }

    public function get_carga_boards() {
        echo (new main_model())->get_carga_boards();
    }
}
