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
		    $this->conexion->escribir_log("Error en Registro: " . $e->getMessage()." Query:".$query, 'debug_registro.txt');
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
		    $this->conexion->escribir_log("Error en Registro: " . $e->getMessage()." Query:".$query, 'debug_registro.txt');
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
		    $this->conexion->escribir_log("Error en Registro: " . $e->getMessage()." Query:".$query, 'debug_registro.txt');
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}

	public function search_user_email($email)
	{

		$query = "SELECT * FROM users WHERE email='$email'";
		try {
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			$respuesta_arreglo = $resultado->fetchAll(PDO::FETCH_ASSOC);
			return $respuesta_arreglo;
		} catch (PDOException $e) {
		    $this->conexion->escribir_log("Error en Registro: " . $e->getMessage()." Query:".$query, 'debug_registro.txt');
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}

	public function update_user($name, $last_name, $email, $role, $id)
	{
		$query = "UPDATE users SET name = '$name', last_name = '$last_name', email = '$email', role = '$role'  WHERE user_id = $id";
		try {
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			return true;
		} catch (PDOException $e) {
		    $this->conexion->escribir_log("Error en Registro: " . $e->getMessage()." Query:".$query, 'debug_registro.txt');
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}


	public function update_user_profile($name, $last_name, $email, $psw, $security_questions, $custom_security_question, $id)
	{
		$query = "UPDATE users SET name = '$name', last_name = '$last_name', email = '$email', psw = '$psw', security_questions = '$security_questions', custom_security_question = '$custom_security_question'  WHERE user_id = $id";
		try {
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			return true;
		} catch (PDOException $e) {
		    $this->conexion->escribir_log("Error en Registro: " . $e->getMessage()." Query:".$query, 'debug_registro.txt');
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}

	public function update_user_security($psw, $security_questions, $custom_security_question, $id)
	{
		$query = "UPDATE users SET psw = '$psw', security_questions = '$security_questions', custom_security_question = '$custom_security_question', first_login = 1  WHERE user_id = $id";
		try {
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			return true;
		} catch (PDOException $e) {
		    $this->conexion->escribir_log("Error en Registro: " . $e->getMessage()." Query:".$query, 'debug_registro.txt');
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
		    $this->conexion->escribir_log("Error en Registro: " . $e->getMessage()." Query:".$query, 'debug_registro.txt');
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}

	// Obtener agentes para el datalist (excluyendo al eliminado)
	public function get_agents_except($user_id)
	{
		$query = "SELECT user_id, name, last_name, email FROM users WHERE user_id != $user_id AND is_active = 1";
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

	public function delete_user_with_redistribute($old_user_id, $new_agents_array)
	{
		try {
			$this->conexion->beginTransaction();

			// 0. Obtener email del agente saliente
			$stmtOld = $this->conexion->prepare("SELECT email FROM users WHERE user_id = :id");
			$stmtOld->execute(['id' => $old_user_id]);
			$old_email = $stmtOld->fetchColumn();

			$num_agentes = count($new_agents_array);

			// 1. REPARTO DE TICKETS (Gestión y Compras)
			// Nota: Verifica si en 'compras' la PK es 'id' o 'id_compra'. 
			// Si es como en notas, cámbialo a 'id'.
			$tablas_tickets = ['gestion' => 'id_gestion', 'compras' => 'id_compra'];

			foreach ($tablas_tickets as $tabla => $pk) {
				$stmt = $this->conexion->prepare("SELECT $pk FROM $tabla WHERE user_id = :old");
				$stmt->execute(['old' => $old_user_id]);
				$registros = $stmt->fetchAll(PDO::FETCH_ASSOC);

				if (count($registros) > 0) {
					$update = $this->conexion->prepare("UPDATE $tabla SET user_id = :new_id WHERE $pk = :reg_id");
					$insertNota = $this->conexion->prepare("INSERT INTO notas (gestion_id, user_id, contenido, tipo_nota, fecha_creacion) VALUES (:g_id, :u_id, :txt, :tipo, NOW())");

					foreach ($registros as $index => $reg) {
						$agente_destino_id = $new_agents_array[$index % $num_agentes];
						$update->execute(['new_id' => $agente_destino_id, 'reg_id' => $reg[$pk]]);

						$tipo_nota = ($tabla == 'gestion') ? 'gestion' : 'compra';
						$insertNota->execute([
							'g_id' => $reg[$pk],
							'u_id' => $agente_destino_id,
							'txt'  => "SISTEMA: Cliente reasignado automáticamente desde $old_email.",
							'tipo' => $tipo_nota
						]);
					}
				}
			}

			// 2. TRATAMIENTO DE NOTAS (Usando la columna 'id' según tu imagen)
			// Corregido: SELECT id ...
			$stmtNotas = $this->conexion->prepare("SELECT id, contenido FROM notas WHERE user_id = :old");
			$stmtNotas->execute(['old' => $old_user_id]);
			$notas_viejas = $stmtNotas->fetchAll(PDO::FETCH_ASSOC);

			if (count($notas_viejas) > 0) {
				// Corregido: WHERE id = :n_id
				$updNota = $this->conexion->prepare("UPDATE notas SET user_id = :new_id, contenido = :new_txt WHERE id = :n_id");

				foreach ($notas_viejas as $index => $nota) {
					$agente_heredero = $new_agents_array[$index % $num_agentes];
					$nuevo_contenido = $nota['contenido'] . " (Original de: $old_email)";

					$updNota->execute([
						'new_id'  => $agente_heredero,
						'new_txt' => $nuevo_contenido,
						'n_id'    => $nota['id'] // Usando el valor de la columna 'id'
					]);
				}
			}

			// 3. Eliminar al usuario
			$delete = $this->conexion->prepare("DELETE FROM users WHERE user_id = :old");
			$delete->execute(['old' => $old_user_id]);

			$this->conexion->commit();
			return true;
		} catch (PDOException $e) {
			$this->conexion->rollBack();
			return "Error en la redistribución: " . $e->getMessage();
		}
	}

	public function update_user_psw($psw, $id)
	{
		$query = "UPDATE users SET psw = '$psw' WHERE user_id = $id";
		try {
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			return true;
		} catch (PDOException $e) {
		    $this->conexion->escribir_log("Error en Registro: " . $e->getMessage()." Query:".$query, 'debug_registro.txt');
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}
}
