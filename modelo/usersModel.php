<?php

require_once "conect.php";

class users_model
{

	private $name;
	private $last_name;
	private $role;
	private $email;
	private $psw;
	private $is_active;
	private $conexion;

	public function __construct()
	{
		$this->conexion = new base_datos();
	}

	public function set_user($name, $last_name, $role, $email, $psw, $is_active)
	{
		$this->name = $name;
		$this->last_name = $last_name;
		$this->role = $role;
		$this->email = $email;
		$this->psw = $psw;
		$this->is_active = $is_active;
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

	public function registrar()
	{
		$clave = $this->conexion->encoding($this->psw);
		$query = "INSERT INTO users (name,last_name, role, email, psw, is_active) VALUES ('$this->name','$this->last_name', '$this->role','$this->email','$clave', '$this->is_active')";
		try {
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			return true;
		} catch (PDOException $e) {
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}

	public function get_users()
	{
		$query = "SELECT u.*, COUNT(b.id_board) AS total_pizarras FROM users u LEFT JOIN boards b ON u.user_id = b.user_id WHERE u.role != 'admin' GROUP BY u.user_id;";
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

	public function search_user()
	{

		$query = "SELECT * FROM users WHERE email='$this->email'";
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

	public function update_user($name, $last_name, $email, $id)
	{
		$query = "UPDATE users SET name = '$name', last_name = '$last_name', email = '$email'  WHERE user_id = $id";
		try {
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			return true;
		} catch (PDOException $e) {
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}

	public function delete_user($user_id)
	{
		$query = "DELETE FROM users WHERE user_id = $user_id";
		try {
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			return true;
		} catch (PDOException $e) {
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}



	// public function editar($acciones,$codigo){
	// 	$query="UPDATE bitacora SET acciones='$this->acciones' WHERE codigo='$codigo'";
	// 	try {
	// 		$resultado = $this->conexion->prepare($query);
	// 		$resultado->execute();
	// 		return true;
	// 	} catch (PDOException $e) {
	// 		return "Ha ocurrido un error en la línea ".$e->getLine()." <br> Error: ".$e->getMessage();
	// 	}
	// }


}
