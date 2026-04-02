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
		$query = "SELECT u.*, COUNT(DISTINCT b.id_board) AS total_pizarras,(SELECT GROUP_CONCAT(DISTINCT relacion) FROM (
        SELECT CONCAT('compras-', id_board) AS relacion, user_id FROM compras UNION ALL SELECT CONCAT('gestion_clientes-', id_board) AS relacion, user_id FROM gestion) AS t_relaciones
        WHERE t_relaciones.user_id = u.user_id) AS relaciones_completas FROM users u  LEFT JOIN boards b ON u.user_id = b.user_id WHERE u.role != 'admin' GROUP BY u.user_id;";
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

	// Obtener agentes para el datalist (excluyendo al eliminado)
	public function get_agents_except($user_id)
	{
		$query = "SELECT user_id, name, last_name FROM users WHERE user_id != $user_id AND is_active = 1";
		return $this->conexion->query($query)->fetchAll(PDO::FETCH_ASSOC);
	}

	public function delete_user_with_reassign($user_id, $new_agent_id)
	{
		if ($user_id == $new_agent_id) return "Error: El agente de destino no puede ser el mismo que el eliminado.";

		try {
			$this->conexion->beginTransaction();

			// 1. Reasignar en tabla gestion
			$q1 = "UPDATE gestion SET user_id = :new_agent WHERE user_id = :old_user";
			$res1 = $this->conexion->prepare($q1);
			$res1->execute(['new_agent' => $new_agent_id, 'old_user' => $user_id]);

			// 2. Reasignar en tabla compras
			$q2 = "UPDATE compras SET user_id = :new_agent WHERE user_id = :old_user";
			$res2 = $this->conexion->prepare($q2);
			$res2->execute(['new_agent' => $new_agent_id, 'old_user' => $user_id]);

			// 3. Eliminar el usuario
			$q3 = "DELETE FROM users WHERE user_id = :old_user";
			$res3 = $this->conexion->prepare($q3);
			$res3->execute(['old_user' => $user_id]);

			$this->conexion->commit();
			return true;
		} catch (PDOException $e) {
			$this->conexion->rollBack();
			return "Error: " . $e->getMessage();
		}
	}
}
