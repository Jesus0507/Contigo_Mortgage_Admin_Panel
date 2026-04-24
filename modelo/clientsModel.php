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

	public function get_clients_by_user($user_id)
	{
		// Agrupamos por client_id para que no se repitan
		$query = "SELECT c.* FROM clients c
              LEFT JOIN compras co ON c.client_id = co.client_id
              LEFT JOIN gestion g ON c.client_id = g.client_id
              WHERE co.user_id = :user_id OR g.user_id = :user_id
              GROUP BY c.client_id";

		try {
			$clients = [];
			$resultado = $this->conexion->prepare($query);
			$resultado->bindValue(':user_id', $user_id, PDO::PARAM_INT);
			$resultado->execute();

			return $resultado->fetchAll(PDO::FETCH_ASSOC);
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
