<?php

class loginController
{

	public function __construct()
	{
		require_once "modelo/loginModel.php";
	}

	public function index()
	{

		$conexion = new base_datos();

		if ($conexion->getRepConexion() == false) {
			echo "<h2>" . $conexion->getErrorConexion() . "</h2>";
		} else {
			require_once "vista/login.php";
		}
	}

	public function logout()
	{
		session_start();
		session_destroy();
		$this->index();
	}
}
