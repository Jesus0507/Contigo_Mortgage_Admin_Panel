<?php

class gestionController
{

	public function __construct()
	{
		require_once "modelo/gestionModel.php";
		require_once "modelo/historialModel.php";
	}


	public function get_gestion_info()
	{
		$modelo = new gestion_model();
		$modelo_historial = new historial_model();
		$gestion_info = $modelo->get_gestion_info($_POST['id_gestion']);
		$notes = $modelo->get_gestion_notes($_POST['id_gestion']);
		$deudas = $modelo->get_gestion_deudas($_POST['id_gestion']);
		$historial = $modelo_historial->get_historial_gestion($_POST['id_gestion'],'gestion');
		$gestion_informacion = [
			"gestion_info" => $gestion_info,
			"notas" => $notes,
			"deudas" => $deudas,
			"historial" => $historial

		];
		echo json_encode($gestion_informacion);
	}

	public function delete_deuda()
	{
		session_start();
		$modelo = new gestion_model();
		$deudas = $modelo->get_gestion_deudas($_POST['id_gestion']);
		$selected_deuda = "";
		foreach($deudas as $d){if ($d['id_deuda'] == $_POST['id_deuda']){$selected_deuda = $d;}}
		$modelo_historial = new historial_model();
		$accion = "El usuario " . $_SESSION['username'] . " eliminó una deuda de " . $selected_deuda['amount'] . " (" . $selected_deuda['description'] . ")";
		$tipo_accion = "remove_deuda";
		$modelo_historial->set_historial($_POST['id_gestion'], $_SESSION['user_id'], $accion, $tipo_accion,'gestion');
		$modelo_historial->registrar();
		echo $modelo->delete_deuda($_POST['id_deuda']);
	}


	public function add_new_deuda()
	{
		session_start();
		$modelo = new gestion_model();
		$modelo_historial = new historial_model();
		$accion = "El usuario " . $_SESSION['username'] . " agregó una nueva deuda de " . $_POST['amount'] . " (" . $_POST['descripcion'] . ")";
		$tipo_accion = "add_deuda";
		$modelo_historial->set_historial($_POST['id_gestion'], $_SESSION['user_id'], $accion, $tipo_accion,'gestion');
		$modelo_historial->registrar();
		$result_add_deuda = $modelo->add_deuda($_POST['id_gestion'], $_POST['descripcion'], $_POST['amount']);
		if ($result_add_deuda == true) {
			$id_deuda = $modelo->get_last_deuda();
			echo $id_deuda[0]['id_deuda'];
		} else {
			echo $result_add_deuda;
		}
	}

	public function add_new_comment()
	{
		session_start();
		$modelo_gestion = new gestion_model();
		$modelo_historial = new historial_model();
		$accion = "El usuario " . $_SESSION['username'] . " agregó una nota a la gestión";
		$tipo_accion = "add_nota";
		$modelo_historial->set_historial($_POST['id_gestion'], $_SESSION['user_id'], $accion, $tipo_accion,'gestion');
		$modelo_historial->registrar();
		echo $modelo_gestion->add_note($_POST['id_gestion'], $_SESSION['user_id'], $_POST['contenido']);
	}
}
