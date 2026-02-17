<?php

require_once "conect.php";

class clients_model
{

	private $name;
	private $last_name;
	private $phone;
	private $conexion;

	public function __construct()
	{
		$this->conexion = new base_datos();
	}

	public function set_user($name, $last_name, $phone)
	{
		$this->name = $name;
		$this->last_name = $last_name;
		$this->phone = $phone;
	}

	public function update_client($name, $last_name, $phone)
	{
		$query = "UPDATE clients SET name = '$name', last_name = '$last_name'  WHERE phone = '$phone'";
		try {
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			return true;
		} catch (PDOException $e) {
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}

		public function delete_client($phone)
	{
		$query = "DELETE FROM clients WHERE phone = '$phone'";
		try {
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			return true;
		} catch (PDOException $e) {
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}


	// public function get_bitacora(){
	// 	$bitacora_result=[
	// 		'codigo'=>$this->codigo,
	// 		'fecha'=>$this->fecha,
	// 		'cedula_usuario'=>$this->cedula_usuario,
	// 		'inicio_sesion'=>$this->inicio_sesion,
	// 		'acciones'=>$this->acciones,
	// 		'final_sesion'=>$this->final_sesion

	// 	];
	// 	return $bitacora_result;
	// }

	// public function registrar()
	// {
	// 	$clave = $this->conexion->encoding($this->psw);
	// 	$query = "INSERT INTO users (name,last_name, role, email, psw, is_active) VALUES ('$this->name','$this->last_name', '$this->role','$this->email','$clave', '$this->is_active')";
	// 	try {
	// 		$resultado = $this->conexion->prepare($query);
	// 		$resultado->execute();
	// 		return true;
	// 	} catch (PDOException $e) {
	// 		return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
	// 	}
	// }

	public function get_clients()
	{
		$query = "SELECT * FROM clients";
		try {
			$users = [];
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			foreach ($resultado->fetchAll(PDO::FETCH_ASSOC) as $v) {
				$users[] = $v;
			}
			return $users;
		} catch (PDOException $e) {
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}


	public function search_client($phone)
	{

		$query = "SELECT * FROM clients WHERE phone='$phone'";
		try {
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			$respuesta_arreglo = $resultado->fetchAll(PDO::FETCH_ASSOC);
			return $respuesta_arreglo;
		} catch (PDOException $e) {
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}
}
