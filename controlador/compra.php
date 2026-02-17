<?php

class compraController
{

	public function __construct()
	{
		require_once "modelo/compraModel.php";
		require_once "modelo/historialModel.php";
	}


	public function get_compras_info()
	{
		$modelo = new compra_model();
		$modelo_historial = new historial_model();
		$gestion_info = $modelo->get_gestion_info($_POST['id_compra']);
		$notes = $modelo->get_gestion_notes($_POST['id_compra']);
		$historial = $modelo_historial->get_historial_gestion($_POST['id_compra'],'compra');
		$gestion_informacion = [
			"gestion_info" => $gestion_info,
			"notas" => $notes,
			"historial" => $historial

		];
		echo json_encode($gestion_informacion);
	}




	public function add_new_comment()
	{
		session_start();
		$modelo_gestion = new compra_model();
		$modelo_historial = new historial_model();
		$accion = "El usuario " . $_SESSION['username'] . " agregó una nota a la compra";
		$tipo_accion = "add_nota";
		$modelo_historial->set_historial($_POST['id_gestion'], $_SESSION['user_id'], $accion, $tipo_accion,'compra');
		$modelo_historial->registrar();
		echo $modelo_gestion->add_note($_POST['id_gestion'], $_SESSION['user_id'], $_POST['contenido']);
	}
}
