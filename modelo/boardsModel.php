<?php

require_once "conect.php";

class boards_model
{

	private $user_id;
	private $name;
	private $board_type;
	private $conexion;

	public function __construct()
	{
		$this->conexion = new base_datos();
	}

	public function set_board($user_id, $name, $board_type)
	{
		$this->name = $name;
		$this->user_id = $user_id;
		$this->board_type = $board_type;
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
		$query = "INSERT INTO boards (user_id,name, board_type, etapas) VALUES ('$this->user_id','$this->name', '$this->board_type', 'prospecto/finalizado')";
		try {
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			return true;
		} catch (PDOException $e) {
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}


	public function register_user_board($board_id, $user_id)
	{
		$query = "INSERT INTO users_boards (user_id, id_board) VALUES ($user_id, $board_id)";
		try {
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			return true;
		} catch (PDOException $e) {
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}

	public function get_boards_users($board_id)
	{
		$query = "SELECT * FROM users_boards WHERE id_board = $board_id";
		try {
			$users = [];
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			foreach ($resultado->fetchAll(PDO::FETCH_ASSOC) as $v) {
				$users[] = $v["user_id"];
			}
			return $users;
		} catch (PDOException $e) {
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}

	public function get_all_boards_users($user_id)
	{
		$query = "SELECT * FROM users_boards WHERE user_id = $user_id";
		try {
			$users = [];
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			foreach ($resultado->fetchAll(PDO::FETCH_ASSOC) as $v) {
				$users[] = $v["id_board"];
			}
			return $users;
		} catch (PDOException $e) {
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}

	public function update_board_name($board_id, $name)
	{
		$query = "UPDATE boards SET name = '$name'  WHERE id_board = $board_id";
		try {
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			return true;
		} catch (PDOException $e) {
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}


	public function delete_relations($board_id)
	{
		$query = "DELETE FROM users_boards WHERE id_board = $board_id";
		try {
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			return true;
		} catch (PDOException $e) {
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}

	public function get_boards()
	{
		// Usamos LEFT JOIN para ambas tablas y contamos según el board_type
		$query = "SELECT 
                b.*, 
                u.name AS user_name, 
                u.last_name AS user_last_name, 
                CASE 
                    WHEN b.board_type = 'compras' THEN COUNT(DISTINCT c.id_compra)
                    ELSE COUNT(DISTINCT g.id_gestion)
                END AS total_gestiones
              FROM boards b
              JOIN users u ON b.user_id = u.user_id
              LEFT JOIN gestion g ON b.id_board = g.id_board
              LEFT JOIN compras c ON b.id_board = c.id_board
              GROUP BY b.id_board, u.name, u.last_name
              ORDER BY b.id_board;";

		try {
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			// Retornamos directamente el fetchAll para simplificar el código
			return $resultado->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}

	public function get_my_boards($user_id)
	{
		$query = "SELECT * FROM boards WHERE user_id = $user_id";
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


	public function get_boards_by_id($id_board)
	{
		$query = "SELECT * FROM boards WHERE id_board = $id_board";
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

	public function get_client($phone)
	{
		$query = "SELECT * from clients  WHERE phone = '$phone'";
		try {
			$clients = [];
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			$clients = $resultado->fetchAll(PDO::FETCH_ASSOC);
			if (count($clients) > 0) {
				return $clients[0]['client_id'];
			} else {
				return false;
			}
		} catch (PDOException $e) {
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}


	public function add_client($name, $last_name, $phone)
	{
		$query = "INSERT INTO clients (name, last_name, phone) VALUES ('$name','$last_name','$phone')";
		try {
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			return $this->get_client($phone);
		} catch (PDOException $e) {
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}

	public function update_client($name, $last_name, $phone)
	{
		$query = "UPDATE clients SET name = '$name', last_name = '$last_name', phone = '$phone' WHERE phone = '$phone'";
		try {
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			return $this->get_client($phone);
		} catch (PDOException $e) {
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}


	public function get_boards_gestions($id_board)
	{
		$query = "SELECT c.name, c.last_name, g.* from clients c, gestion g where g.id_board = $id_board and c.client_id = g.client_id;";
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

	public function get_boards_compras($id_board)
	{
		$query = "SELECT c.name, c.last_name, co.* from clients c, compras co where co.id_board = $id_board and c.client_id = co.client_id;";
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

	public function get_last_board()
	{
		$query = "SELECT * FROM boards  ORDER BY id_board DESC LIMIT 1";
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

	public function registrar_board_etapa($id_board, $id_etapa)
	{
		$query = "INSERT INTO board_etapa (id_board,id_etapa) VALUES ('$id_board','$id_etapa')";
		try {
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			return true;
		} catch (PDOException $e) {
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}


	public function update_board($etapas, $id_board)
	{
		$query = "UPDATE boards SET etapas = '$etapas'  WHERE id_board = $id_board";
		try {
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			return true;
		} catch (PDOException $e) {
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}




	// public function search_user()
	// {

	// 	$query = "SELECT * FROM users WHERE email='$this->email'";
	// 	try {
	// 		$resultado = $this->conexion->prepare($query);
	// 		$resultado->execute();
	// 		$resultado->setFetchMode(PDO::FETCH_ASSOC);
	// 		$respuesta_arreglo = $resultado->fetchAll(PDO::FETCH_ASSOC);
	// 		return $respuesta_arreglo;
	// 	} catch (PDOException $e) {
	// 		return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
	// 	}
	// }


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
