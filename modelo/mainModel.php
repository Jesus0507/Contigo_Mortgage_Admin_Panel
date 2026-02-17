<?php

require_once "conect.php";

class main_model
{

	private $usuario;
	private $clave;
	private $conexion;

	public function __construct()
	{
		$this->conexion = new base_datos();
	}

	public function set_user($usuario, $clave)
	{
		$this->usuario = $usuario;
		$this->clave = $clave;
	}

	public function get_inicio()
	{
		$psw = $this->conexion->encoding($this->clave);
		$query = "SELECT * FROM users WHERE email='$this->usuario' AND psw='$psw'";
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

public function get_stadistics()
{
    // Al no tener símbolos, el SUM funciona directamente
    $sql = "SELECT 
                (SELECT SUM(loan_amount) FROM gestion) as total_gestion,
                (SELECT SUM(monto_max_aplicado) FROM compras) as total_compras";
    try {
        $resultado = $this->conexion->prepare($sql);
        $resultado->execute();
        
        // Usamos fetch para obtener la fila única de resultados
        $respuesta = $resultado->fetch(PDO::FETCH_ASSOC);

        // Validamos que si no hay datos, devuelva 0 en lugar de null
        $total_g = isset($respuesta['total_gestion']) ? (float)$respuesta['total_gestion'] : 0;
        $total_c = isset($respuesta['total_compras']) ? (float)$respuesta['total_compras'] : 0;

        return json_encode([
            'labels' => ['Refinanciamientos (Gestión)', 'Compras de Vivienda'],
            'totals' => [$total_g, $total_c]
        ]);
    } catch (PDOException $e) {
        return json_encode(["error" => $e->getMessage()]);
    }
}

	// 5. Ranking de Agentes (Productividad)
	public function get_ranking_agentes()
	{
		$sql = "SELECT 
    u.name, 
    u.last_name, 
    COUNT(universo.tipo) as total_casos,
    SUM(CASE WHEN universo.tipo = 'Refinanciamiento' THEN 1 ELSE 0 END) as total_refi,
    SUM(CASE WHEN universo.tipo = 'Compra' THEN 1 ELSE 0 END) as total_compra
FROM users u 
LEFT JOIN (
    -- Etiquetamos cada registro según su tabla de origen
    SELECT user_id, 'Refinanciamiento' as tipo FROM gestion
    UNION ALL
    SELECT user_id, 'Compra' as tipo FROM compras
) as universo ON u.user_id = universo.user_id 
GROUP BY u.user_id, u.name, u.last_name
ORDER BY total_casos DESC 
LIMIT 5;";
		try {
			$resultado = $this->conexion->prepare($sql);
			$resultado->execute();
			$respuesta = $resultado->fetchAll(PDO::FETCH_ASSOC);

			$nombres = [];
			$totales = [];
			$refis = [];
			$compras = [];

			foreach ($respuesta as $row) {
				$nombres[] = $row['name'] . " " . $row['last_name'];
				$totales[] = (int)$row['total_casos'];
				$refis[]   = (int)$row['total_refi'];
				$compras[] = (int)$row['total_compra'];
			}

			return json_encode([
				'labels'  => $nombres,
				'data'    => $totales,
				'refis'   => $refis,
				'compras' => $compras
			]);
		} catch (PDOException $e) {
			return json_encode(["error" => $e->getMessage()]);
		}
	}

	// 6. Embudo de Ventas (Fases del proceso)
	public function get_embudo_ventas()
	{
		$sql = "SELECT etapa_actual, COUNT(*) as cantidad 
                FROM gestion 
                WHERE etapa_actual IS NOT NULL 
                GROUP BY etapa_actual 
                ORDER BY cantidad DESC";
		try {
			$resultado = $this->conexion->prepare($sql);
			$resultado->execute();
			$respuesta = $resultado->fetchAll(PDO::FETCH_ASSOC);

			$etapas = [];
			$totales = [];
			foreach ($respuesta as $row) {
				$etapas[] = ucfirst($row['etapa_actual']);
				$totales[] = (int)$row['cantidad'];
			}
			return json_encode(['labels' => $etapas, 'data' => $totales]);
		} catch (PDOException $e) {
			return json_encode(["error" => $e->getMessage()]);
		}
	}

	// 7. Velocidad de Cierre (Días promedio por mes)
	public function get_velocidad_cierre()
	{
		$sql = "SELECT DATE_FORMAT(last_update, '%M') as mes, 
                AVG(DATEDIFF(last_update, date_created)) as promedio_dias 
                FROM gestion 
                WHERE etapa_actual = 'finalizado' 
                GROUP BY MONTH(last_update) 
                ORDER BY MONTH(last_update) ASC";
		try {
			$resultado = $this->conexion->prepare($sql);
			$resultado->execute();
			$res = $resultado->fetchAll(PDO::FETCH_ASSOC);
			$meses = [];
			$dias = [];
			foreach ($res as $row) {
				$meses[] = $row['mes'];
				$dias[] = round($row['promedio_dias'], 1);
			}
			return json_encode(['labels' => $meses, 'data' => $dias]);
		} catch (PDOException $e) {
			return json_encode(["error" => $e->getMessage()]);
		}
	}

	// 8. Carga de Trabajo por Board (¿Qué oficina/pizarra está más llena?)
	public function get_carga_boards()
	{
		$sql = "SELECT 
            b.name, 
            COUNT(union_tablas.id_board) as total 
        FROM boards b 
        LEFT JOIN (
            SELECT id_board FROM gestion
            UNION ALL
            SELECT id_board FROM compras
        ) as union_tablas ON b.id_board = union_tablas.id_board 
        GROUP BY b.id_board, b.name;";
		try {
			$resultado = $this->conexion->prepare($sql);
			$resultado->execute();
			$res = $resultado->fetchAll(PDO::FETCH_ASSOC);
			$nombres = [];
			$totales = [];
			foreach ($res as $row) {
				$nombres[] = $row['name'];
				$totales[] = (int)$row['total'];
			}
			return json_encode(['labels' => $nombres, 'data' => $totales]);
		} catch (PDOException $e) {
			return json_encode(["error" => $e->getMessage()]);
		}
	}

	public function get_comparativa_valores()
	{
		// Limpiamos ambos campos financieros y traemos la fecha para el eje X
		$sql = "SELECT 
                DATE_FORMAT(date_created, '%d/%m/%Y') as fecha,
                CAST(REPLACE(REPLACE(REPLACE(property_value, '$', ''), ',', ''), ' ', '') AS DECIMAL(15,2)) as valor_propiedad,
                CAST(REPLACE(REPLACE(REPLACE(loan_amount, '$', ''), ',', ''), ' ', '') AS DECIMAL(15,2)) as monto_prestamo
            FROM gestion 
            ORDER BY date_created ASC 
            LIMIT 20"; // Limitamos a los últimos 20 para no saturar el gráfico

		try {
			$resultado = $this->conexion->prepare($sql);
			$resultado->execute();
			$respuesta_arreglo = $resultado->fetchAll(PDO::FETCH_ASSOC);

			$fechas = [];
			$valores = [];
			$prestamos = [];

			foreach ($respuesta_arreglo as $fila) {
				$fechas[] = $fila['fecha'];
				$valores[] = (float)($fila['valor_propiedad'] ?? 0);
				$prestamos[] = (float)($fila['monto_prestamo'] ?? 0);
			}

			return json_encode([
				'labels' => $fechas,
				'valores' => $valores,
				'prestamos' => $prestamos
			]);
		} catch (PDOException $e) {
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}

	public function get_distribucion_prestamos()
	{
		$sql = "SELECT tipo_prestamo, COUNT(*) as cantidad 
            FROM gestion 
            WHERE tipo_prestamo IS NOT NULL AND tipo_prestamo != ''
            GROUP BY tipo_prestamo";

		try {
			$resultado = $this->conexion->prepare($sql);
			$resultado->execute();

			// Obtenemos todos los registros
			$respuesta_arreglo = $resultado->fetchAll(PDO::FETCH_ASSOC);

			$labels = [];
			$counts = [];

			// Recorremos el arreglo para separar labels y cantidades
			foreach ($respuesta_arreglo as $fila) {
				$labels[] = $fila['tipo_prestamo'];
				$counts[] = (int)$fila['cantidad'];
			}

			$data_grafico = json_encode([
				'labels' => $labels,
				'data' => $counts
			]);

			return $data_grafico;
		} catch (PDOException $e) {
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}

	public function get_meta_cierre_mensual()
	{
		// Sumamos los gastos de cierre solo de los registros que están en etapa de cierre
		// Ajusta 'Cerrado' al nombre exacto de tu etapa final
		$sql = "SELECT SUM(CAST(REPLACE(REPLACE(REPLACE(gastos_cierre, '$', ''), ',', ''), ' ', '') AS DECIMAL(15,2))) as total_actual
            FROM gestion 
            WHERE etapa_actual = 'finalizado' 
            AND MONTH(date_created) = MONTH(CURRENT_DATE()) 
            AND YEAR(date_created) = YEAR(CURRENT_DATE())";

		try {
			$resultado = $this->conexion->prepare($sql);
			$resultado->execute();
			$fila = $resultado->fetch(PDO::FETCH_ASSOC);

			$total_actual = (float)($fila['total_actual'] ?? 0);
			$meta_objetivo = 50000.00; // Define aquí tu meta mensual

			return json_encode([
				'actual' => $total_actual,
				'meta' => $meta_objetivo,
				'porcentaje' => ($total_actual / $meta_objetivo) * 100
			]);
		} catch (PDOException $e) {
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}




	public function get_speed_stadistic()
	{
		if ($_SESSION['user_role'] == "admin") {
			$query = "SELECT DATE_FORMAT(last_update, '%Y-%m-%d') as fecha_finalizacion, AVG(DATEDIFF(last_update, date_created)) as promedio_dias FROM gestion WHERE etapa_actual = 'finalizado' AND last_update IS NOT NULL GROUP BY DATE_FORMAT(last_update, '%Y-%m-%d') ORDER BY last_update ASC LIMIT 30";
		} else {
			$user_id = $_SESSION['user_id'];

			$query = "SELECT DATE_FORMAT(g.last_update, '%Y-%m-%d') as fecha_finalizacion, 
            AVG(DATEDIFF(g.last_update, g.date_created)) as promedio_dias FROM gestion g
        	INNER JOIN boards b ON g.id_board = b.id_board WHERE g.etapa_actual = 'finalizado' 
          	AND g.last_update IS NOT NULL AND b.user_id = $user_id
        	GROUP BY DATE_FORMAT(g.last_update, '%Y-%m-%d') ORDER BY g.last_update ASC LIMIT 30";
		}
		try {
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			$respuesta_arreglo = $resultado->fetchAll(PDO::FETCH_ASSOC);
			$labels = [];
			$puntos = [];

			foreach ($respuesta_arreglo as $row) {
				$labels[] = $row['fecha_finalizacion'];
				$puntos[] = round($row['promedio_dias'], 1); // Redondeamos a 1 decimal
			}

			$velocidad_data = [
				"labels" => $labels,
				"datasets" => [
					[
						"label" => "Días promedio para cerrar",
						"data" => $puntos,
						"borderColor" => "#4e73df",
						"backgroundColor" => "rgba(78, 115, 223, 0.05)",
						"fill" => true,
						"lineTension" => 0.3
					]
				]
			];

			// Lo pasas a la vista
			$json_velocidad = json_encode($velocidad_data);
			return $json_velocidad;
		} catch (PDOException $e) {
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}

	public function get_cake_stadistic()
	{
		if ($_SESSION['user_role'] == "admin") {
			$query = "SELECT etapa_actual, COUNT(*) as total FROM gestion WHERE etapa_actual NOT IN ('prospecto', 'finalizado') GROUP BY etapa_actual";
		} else {
			$user_id = $_SESSION['user_id'];

			$query = "SELECT g.etapa_actual, COUNT(*) as total FROM gestion g INNER JOIN boards b ON g.id_board = b.id_board
        	WHERE g.etapa_actual NOT IN ('prospecto', 'finalizado') AND b.user_id = $user_id GROUP BY g.etapa_actual";
		}
		try {
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			$resultado->setFetchMode(PDO::FETCH_ASSOC);
			$respuesta_arreglo = $resultado->fetchAll(PDO::FETCH_ASSOC);
			$labels = [];
			$counts = [];
			$colors = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796', '#5a5c69'];

			foreach ($respuesta_arreglo as $row) {
				$labels[] = $row['etapa_actual'];
				$counts[] = (int)$row['total'];
			}

			// Estructura para Chart.js
			$limbo_data = [
				"labels" => $labels,
				"datasets" => [
					[
						"data" => $counts,
						"backgroundColor" => array_slice($colors, 0, count($labels)),
						"hoverBackgroundColor" => array_slice($colors, 0, count($labels)),
						"hoverBorderColor" => "rgba(234, 236, 244, 1)",
					]
				]
			];

			$json_limbo = json_encode($limbo_data);
			return $json_limbo;
		} catch (PDOException $e) {
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}
}
