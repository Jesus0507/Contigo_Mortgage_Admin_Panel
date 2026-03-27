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
    // Limpieza estándar: punto fuera, coma por punto decimal
    $cleanG = "CAST(REPLACE(REPLACE(loan_amount, '.', ''), ',', '.') AS DECIMAL(15,2))";
    $cleanC_monto = "CAST(REPLACE(REPLACE(monto_max_aplicado, '.', ''), ',', '.') AS DECIMAL(15,2))";
    $cleanC_down = "CAST(REPLACE(REPLACE(down_payment, '.', ''), ',', '.') AS DECIMAL(15,2))";
    $formulaC = "($cleanC_monto - ($cleanC_monto * $cleanC_down / 100))";

    $sql = "SELECT 
                -- PROYECCIÓN (Todo)
                (SELECT SUM($cleanG) FROM gestion) as prog_g,
                (SELECT SUM($formulaC) FROM compras) as prog_c,
                -- REAL (Solo finalizados)
                (SELECT SUM($cleanG) FROM gestion WHERE etapa_actual = 'finalizado') as real_g,
                (SELECT SUM($formulaC) FROM compras WHERE etapa_actual = 'finalizado') as real_c";

    try {
        $resultado = $this->conexion->prepare($sql);
        $resultado->execute();
        $res = $resultado->fetch(PDO::FETCH_ASSOC);

        return json_encode([
            'labels' => ['Refinanciamientos (Gestión)', 'Compras de Vivienda'],
            'proyeccion' => [(float)$res['prog_g'], (float)$res['prog_c']],
            'real' => [(float)$res['real_g'], (float)$res['real_c']]
        ]);
    } catch (PDOException $e) {
        return json_encode(["error" => $e->getMessage()]);
    }
}
	public function get_ranking_agentes()
	{
		$sql = "SELECT 
        u.name, 
        u.last_name, 
        SUM(CASE WHEN universo.tipo = 'Refinanciamiento' AND universo.etapa_actual != 'finalizado' THEN 1 ELSE 0 END) as refi_iniciado,
        SUM(CASE WHEN universo.tipo = 'Refinanciamiento' AND universo.etapa_actual = 'finalizado' THEN 1 ELSE 0 END) as refi_finalizado,
        SUM(CASE WHEN universo.tipo = 'Compra' AND universo.etapa_actual != 'finalizado' THEN 1 ELSE 0 END) as compra_iniciado,
        SUM(CASE WHEN universo.tipo = 'Compra' AND universo.etapa_actual = 'finalizado' THEN 1 ELSE 0 END) as compra_finalizado,
        COUNT(universo.user_id) as total_casos
    FROM users u 
    LEFT JOIN (
        SELECT user_id, 'Refinanciamiento' as tipo, etapa_actual FROM gestion
        UNION ALL
        SELECT user_id, 'Compra' as tipo, etapa_actual FROM compras
    ) as universo ON u.user_id = universo.user_id 
    GROUP BY u.user_id, u.name, u.last_name
    ORDER BY total_casos DESC 
    LIMIT 5;";

		try {
			$resultado = $this->conexion->prepare($sql);
			$resultado->execute();
			$respuesta = $resultado->fetchAll(PDO::FETCH_ASSOC);

			$nombres = [];
			$refi_ini = [];
			$refi_fin = [];
			$compra_ini = [];
			$compra_fin = [];

			foreach ($respuesta as $row) {
				$nombres[] = $row['name'] . " " . $row['last_name'];
				$refi_ini[] = (int)$row['refi_iniciado'];
				$refi_fin[] = (int)$row['refi_finalizado'];
				$compra_ini[] = (int)$row['compra_iniciado'];
				$compra_fin[] = (int)$row['compra_finalizado'];
			}

			return json_encode([
				'labels' => $nombres,
				'refi_iniciado' => $refi_ini,
				'refi_finalizado' => $refi_fin,
				'compra_iniciado' => $compra_ini,
				'compra_finalizado' => $compra_fin
			]);
		} catch (PDOException $e) {
			return json_encode(["error" => $e->getMessage()]);
		}
	}

	public function get_embudo_ventas()
	{
		$sql = "SELECT 
        b.name as pizarra,
        COUNT(universo.id) as total,
        SUM(CASE WHEN universo.etapa_actual = 'finalizado' THEN 1 ELSE 0 END) as finalizados
    FROM boards b
    LEFT JOIN (
        SELECT id_board, etapa_actual, id_gestion as id FROM gestion
        UNION ALL
        SELECT id_board, etapa_actual, id_compra as id FROM compras
    ) as universo ON b.id_board = universo.id_board
    WHERE b.enabled = 1
    GROUP BY b.id_board, b.name";

		try {
			$resultado = $this->conexion->prepare($sql);
			$resultado->execute();
			$respuesta = $resultado->fetchAll(PDO::FETCH_ASSOC);

			$pizarras = [];
			$totales = [];
			$finalizados = [];

			foreach ($respuesta as $row) {
				$pizarras[] = $row['pizarra'];
				$totales[] = (int)$row['total'];
				$finalizados[] = (int)$row['finalizados'];
			}

			return json_encode([
				'labels' => $pizarras,
				'totales' => $totales,
				'finalizados' => $finalizados
			]);
		} catch (PDOException $e) {
			return json_encode(["error" => $e->getMessage()]);
		}
	}

	public function get_velocidad_cierre()
	{
		$sql = "SELECT 
                CONCAT(u.name, ' ', u.last_name) as agente,
                AVG(DATEDIFF(universo.last_update, universo.date_created)) as promedio_dias
            FROM users u
            INNER JOIN (
                SELECT user_id, date_created, last_update, etapa_actual FROM gestion
                UNION ALL
                SELECT user_id, date_created, last_update, etapa_actual FROM compras
            ) as universo ON u.user_id = universo.user_id
            WHERE universo.etapa_actual = 'finalizado'
            GROUP BY u.user_id
            ORDER BY promedio_dias ASC"; // Ordenar del más rápido al más lento

		try {
			$resultado = $this->conexion->prepare($sql);
			$resultado->execute();
			$res = $resultado->fetchAll(PDO::FETCH_ASSOC);

			$agentes = [];
			$dias = [];
			foreach ($res as $row) {
				$agentes[] = $row['agente'];
				$dias[] = round((float)$row['promedio_dias'], 1);
			}
			return json_encode(['labels' => $agentes, 'data' => $dias]);
		} catch (PDOException $e) {
			return json_encode(["error" => $e->getMessage()]);
		}
	}


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

		$sql = "SELECT 
                DATE_FORMAT(date_created, '%d/%m/%Y') as fecha,
                CAST(REPLACE(REPLACE(REPLACE(property_value, '$', ''), ',', ''), ' ', '') AS DECIMAL(15,2)) as valor_propiedad,
                CAST(REPLACE(REPLACE(REPLACE(loan_amount, '$', ''), ',', ''), ' ', '') AS DECIMAL(15,2)) as monto_prestamo
            FROM gestion 
            ORDER BY date_created ASC 
            LIMIT 20";

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


			$respuesta_arreglo = $resultado->fetchAll(PDO::FETCH_ASSOC);

			$labels = [];
			$counts = [];


			foreach ($respuesta_arreglo as $fila) {
				$labels[] = str_replace("_", " ", $fila['tipo_prestamo']);
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
		$mes_actual = date('n');
		$anio_actual = date('Y');

		try {
			// 1. Obtener total de Gestión
			$sqlG = "SELECT COALESCE(SUM(CAST(REPLACE(REPLACE(REPLACE(REPLACE(loan_amount, '$', ''), '.', ''), ',', '.'), ' ', '') AS DECIMAL(15,2))), 0) as total 
                 FROM gestion 
                 WHERE (etapa_actual = 'finalizado' OR etapa_actual = 'en proceso') 
                 AND MONTH(date_created) = :mes AND YEAR(date_created) = :anio";

			$queryG = $this->conexion->prepare($sqlG);
			$queryG->execute([':mes' => $mes_actual, ':anio' => $anio_actual]);
			$total_g = $queryG->fetch(PDO::FETCH_ASSOC)['total'];

			// 2. Obtener total de Compras (Calculado)
			$sqlC = "SELECT COALESCE(SUM(
                    CAST(REPLACE(REPLACE(REPLACE(REPLACE(monto_max_aplicado, '$', ''), '.', ''), ',', '.'), ' ', '') AS DECIMAL(15,2)) - 
                    (CAST(REPLACE(REPLACE(REPLACE(REPLACE(monto_max_aplicado, '$', ''), '.', ''), ',', '.'), ' ', '') AS DECIMAL(15,2)) * CAST(REPLACE(REPLACE(REPLACE(REPLACE(down_payment, '$', ''), '.', ''), ',', '.'), ' ', '') AS DECIMAL(15,2)) / 100)
                 ), 0) as total 
                 FROM compras 
                 WHERE (etapa_actual = 'finalizado' OR etapa_actual = 'en proceso') 
                 AND MONTH(date_created) = :mes AND YEAR(date_created) = :anio";

			$queryC = $this->conexion->prepare($sqlC);
			$queryC->execute([':mes' => $mes_actual, ':anio' => $anio_actual]);
			$total_c = $queryC->fetch(PDO::FETCH_ASSOC)['total'];

			// 3. Obtener Meta
			$sqlM = "SELECT COALESCE(monto_meta, 50000.00) as meta 
                 FROM metas_mensuales 
                 WHERE mes = :mes AND anio = :anio LIMIT 1";

			$queryM = $this->conexion->prepare($sqlM);
			$queryM->execute([':mes' => $mes_actual, ':anio' => $anio_actual]);
			$meta_res = $queryM->fetch(PDO::FETCH_ASSOC);
			$meta = $meta_res ? $meta_res['meta'] : 50000.00;

			$actual = (float)$total_g + (float)$total_c;

			return json_encode([
				'actual' => $actual,
				'meta' => (float)$meta
			]);
		} catch (PDOException $e) {
			return json_encode(["error" => $e->getMessage()]);
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
				$puntos[] = round($row['promedio_dias'], 1);
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
	public function get_monthly_agent_stats()
	{
		$anio_actual = date('Y');

		try {
			// 1. CIERRES POR ASESOR
			$sqlCierres = "SELECT 
                            CONCAT(u.name, ' ', u.last_name) as agente,
                            MONTH(universo.last_update) as mes,
                            COUNT(*) as total_cierres
                        FROM users u
                        INNER JOIN (
                            SELECT user_id, last_update, etapa_actual FROM gestion
                            UNION ALL
                            SELECT user_id, last_update, etapa_actual FROM compras
                        ) as universo ON u.user_id = universo.user_id
                        WHERE universo.etapa_actual = 'finalizado'
                        AND YEAR(universo.last_update) = :anio
                        GROUP BY u.user_id, mes";

			$queryCierres = $this->conexion->prepare($sqlCierres);
			$queryCierres->execute([':anio' => $anio_actual]);
			$resCierres = $queryCierres->fetchAll(PDO::FETCH_ASSOC);

			// 2. PROCESOS INICIADOS
			$sqlIniciados = "SELECT 
                            CONCAT(u.name, ' ', u.last_name) as agente,
                            MONTH(universo.date_created) as mes,
                            COUNT(*) as total_iniciados
                        FROM users u
                        INNER JOIN (
                            SELECT user_id, date_created FROM gestion
                            UNION ALL
                            SELECT user_id, date_created FROM compras
                        ) as universo ON u.user_id = universo.user_id
                        WHERE YEAR(universo.date_created) = :anio
                        GROUP BY u.user_id, mes";

			$queryIniciados = $this->conexion->prepare($sqlIniciados);
			$queryIniciados->execute([':anio' => $anio_actual]);
			$resIniciados = $queryIniciados->fetchAll(PDO::FETCH_ASSOC);

			// 3. FINANCIAMIENTOS MENSUALES (Limpieza basada en tu función de éxito)
			$sqlFinanciamiento = "SELECT 
                                mes, 
                                SUM(monto_mensual) as monto_total
                              FROM (
                                  -- Suma de GESTIÓN
                                  SELECT 
                                      MONTH(last_update) as mes, 
                                      SUM(CAST(REPLACE(REPLACE(loan_amount, '.', ''), ',', '.') AS DECIMAL(15,2))) as monto_mensual
                                  FROM gestion
                                  WHERE etapa_actual = 'finalizado'
                                  AND YEAR(last_update) = :anio
                                  GROUP BY mes

                                  UNION ALL

                                  -- Suma de COMPRAS
                                  SELECT 
                                      MONTH(last_update) as mes,
                                      SUM(
                                          CAST(REPLACE(REPLACE(monto_max_aplicado, '.', ''), ',', '.') AS DECIMAL(15,2)) - 
                                          (CAST(REPLACE(REPLACE(monto_max_aplicado, '.', ''), ',', '.') AS DECIMAL(15,2)) * CAST(REPLACE(REPLACE(down_payment, '.', ''), ',', '.') AS DECIMAL(15,2)) / 100)
                                      ) as monto_mensual
                                  FROM compras
                                  WHERE etapa_actual = 'finalizado'
                                  AND YEAR(last_update) = :anio
                                  GROUP BY mes
                              ) as subconsulta_unificada
                              GROUP BY mes
                              ORDER BY mes ASC";

			$queryFin = $this->conexion->prepare($sqlFinanciamiento);
			$queryFin->execute([':anio' => $anio_actual]);
			$resFin = $queryFin->fetchAll(PDO::FETCH_ASSOC);

			return json_encode([
				'meses_labels' => ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
				'cierres_por_agente' => $resCierres,
				'iniciados_por_agente' => $resIniciados,
				'financiamiento_mensual' => $resFin
			]);
		} catch (PDOException $e) {
			return json_encode(["error" => $e->getMessage()]);
		}
	}
}
