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

	public function get_monto_mensual()
	{
		$query = "SELECT * FROM metas_mensuales";
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

	public function update_monto_max($new_meta)
	{
		$mes_actual = date('n');
		$anio_actual = date('Y');

		$query = "UPDATE metas_mensuales SET monto_meta = '$new_meta', mes = '$mes_actual', anio = '$anio_actual' WHERE id_meta = 1";
		try {
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			return true;
		} catch (PDOException $e) {
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}


	public function get_unique_board_types()
	{
		// Aplicamos el REPLACE para normalizar 'gestion_clientes' a 'refinanciamientos'
		$query = "SELECT DISTINCT REPLACE(board_type, 'gestion_clientes', 'gestion_clientes') as board_type FROM boards";

		try {
			$types = [];
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			$resultado->setFetchMode(PDO::FETCH_ASSOC);

			foreach ($resultado->fetchAll(PDO::FETCH_ASSOC) as $v) {
				$types[] = $v;
			}

			return $types;
		} catch (PDOException $e) {
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}

	public function get_filtered_report_data($filtros)
	{
		// Definimos las fórmulas de limpieza para los montos (basado en tus imágenes de formato moneda)
		$cleanG_loan = "CAST(REPLACE(REPLACE(t.loan_amount, '.', ''), ',', '.') AS DECIMAL(15,2))";
		$cleanC_monto = "CAST(REPLACE(REPLACE(t.monto_max_aplicado, '.', ''), ',', '.') AS DECIMAL(15,2))";
		$cleanC_down = "CAST(REPLACE(REPLACE(t.down_payment, '.', ''), ',', '.') AS DECIMAL(15,2))";

		// Fórmula para compras: monto - (monto * down / 100)
		$formulaC = "($cleanC_monto - ($cleanC_monto * $cleanC_down / 100))";

		// SQL Base con todos los joins necesarios por cada tipo de tabla
		$sqlBase = "
        SELECT 
            t.client_id, t.user_id, t.id_board, t.etapa_actual, t.date_created,
            c.name as cliente_nombre, c.last_name as cliente_apellido,
            b.name as board_nombre,
            b.board_type as tipo_tabla,
            u.name as agente_nombre, u.last_name as agente_apellido,
            $formulaC as loan_amount,
            t.monto_max_aplicado as propiedad_valor, -- O la columna que definas para valor propiedad
            'compras' as origen
        FROM compras t
        LEFT JOIN clients c ON t.client_id = c.client_id
        LEFT JOIN boards b ON t.id_board = b.id_board
        LEFT JOIN users u ON t.user_id = u.user_id
        
        UNION ALL
        
        SELECT 
            t.client_id, t.user_id, t.id_board, t.etapa_actual, t.date_created,
            c.name as cliente_nombre, c.last_name as cliente_apellido,
            b.name as board_nombre,
            b.board_type as tipo_tabla,
            u.name as agente_nombre, u.last_name as agente_apellido,
            $cleanG_loan as loan_amount,
            t.property_value as propiedad_valor,
            'gestion' as origen
        FROM gestion t
        LEFT JOIN clients c ON t.client_id = c.client_id
        LEFT JOIN boards b ON t.id_board = b.id_board
        LEFT JOIN users u ON t.user_id = u.user_id
    ";

		$sql = "SELECT * FROM ($sqlBase) as report WHERE date_created BETWEEN ? AND ?";

		$params = [
			$filtros['fecha_inicio'] . " 00:00:00",
			$filtros['fecha_fin'] . " 23:59:59"
		];

		// --- Filtros Dinámicos ---

		// 1. Tipos de tabla (compras / gestion_clientes)
		if (!empty($filtros['tipos'])) {
			$placeholders = implode(',', array_fill(0, count($filtros['tipos']), '?'));
			$sql .= " AND tipo_tabla IN ($placeholders)";
			foreach ($filtros['tipos'] as $t) $params[] = $t;
		}

		// 2. Tablas específicas (id_board)
		if (!empty($filtros['tablas'])) {
			$placeholders = implode(',', array_fill(0, count($filtros['tablas']), '?'));
			$sql .= " AND id_board IN ($placeholders)";
			foreach ($filtros['tablas'] as $id) $params[] = $id;
		}

		// 3. Agentes (user_id)
		if (!empty($filtros['agentes'])) {
			$placeholders = implode(',', array_fill(0, count($filtros['agentes']), '?'));
			$sql .= " AND user_id IN ($placeholders)";
			foreach ($filtros['agentes'] as $id) $params[] = $id;
		}

		// 4. Estados (etapa_actual)
		if (!empty($filtros['estados'])) {
			$placeholders = implode(',', array_fill(0, count($filtros['estados']), '?'));
			$sql .= " AND etapa_actual IN ($placeholders)";
			foreach ($filtros['estados'] as $estado) $params[] = $estado;
		}

		// 5. Clientes específicos
		if (!empty($filtros['clientes'])) {
			$placeholders = implode(',', array_fill(0, count($filtros['clientes']), '?'));
			$sql .= " AND client_id IN ($placeholders)";
			foreach ($filtros['clientes'] as $id) $params[] = $id;
		}

		$sql .= " ORDER BY date_created DESC";

		try {
			$stmt = $this->conexion->prepare($sql);
			$stmt->execute($params);
			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			return ["error" => $e->getMessage()];
		}
	}


	public function get_todas_las_etapas()
	{
		// Usamos UNION para juntar los resultados de ambas tablas y DISTINCT de forma implícita
		$query = "SELECT etapa_actual, id_board, 'compras' as board_type FROM compras 
              UNION 
              SELECT etapa_actual, id_board, 'gestion_clientes' as board_type FROM gestion";

		try {
			$etapas = [];
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			$resultado->setFetchMode(PDO::FETCH_ASSOC);

			foreach ($resultado->fetchAll() as $v) {
				// Validamos que no sea un valor vacío o nulo antes de agregarlo
				if (!empty($v['etapa_actual'])) {
					$etapas[] = $v;
				}
			}

			return $etapas;
		} catch (PDOException $e) {
			return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
		}
	}

	public function get_clientes_con_tickets()
	{
		// Seleccionamos nombre y apellido unicos de clientes que existen en compras o gestion
		$query = "SELECT  c.client_id,  c.name,  c.last_name, ( SELECT GROUP_CONCAT(DISTINCT relacion) FROM (
		SELECT CONCAT('compras-', id_board) AS relacion, client_id FROM compras UNION ALL SELECT CONCAT('gestion_clientes-', id_board) AS relacion, client_id FROM gestion) AS t_relaciones_clientes
        WHERE t_relaciones_clientes.client_id = c.client_id ) AS tablas_presente FROM clients c WHERE EXISTS (SELECT 1 FROM compras WHERE client_id = c.client_id)
   		OR EXISTS (SELECT 1 FROM gestion WHERE client_id = c.client_id) ORDER BY c.name ASC;";

		try {
			$clientes = [];
			$resultado = $this->conexion->prepare($query);
			$resultado->execute();
			$resultado->setFetchMode(PDO::FETCH_ASSOC);

			foreach ($resultado->fetchAll() as $v) {
				$clientes[] = $v;
			}

			return $clientes;
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

			// 3. Obtener Meta (CORREGIDO: Limpiamos el formato '950.000,00' a nivel de SQL)
			$sqlM = "SELECT COALESCE(
                    REPLACE(REPLACE(monto_meta, '.', ''), ',', '.'), 
                    '50000.00'
                 ) as meta 
                 FROM metas_mensuales 
                 WHERE mes = :mes AND anio = :anio LIMIT 1";

			$queryM = $this->conexion->prepare($sqlM);
			$queryM->execute([':mes' => $mes_actual, ':anio' => $anio_actual]);
			$meta_res = $queryM->fetch(PDO::FETCH_ASSOC);

			// Si existe el resultado, meta ya viene como "950000.00" (string compatible con float)
			$meta = $meta_res ? $meta_res['meta'] : 50000.00;

			$actual = (float)$total_g + (float)$total_c;

			return json_encode([
				'actual' => $actual,
				'meta' => (float)$meta // Ahora sí lo convertirá a 950000.0
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

	public function get_clientes_sin_seguimiento($busqueda = null)
	{
		// Preparamos el término de búsqueda para SQL
		$filtro = $busqueda ? "%$busqueda%" : null;

		$sql = "SELECT 
                CONCAT(c.name, ' ', c.last_name) as cliente,
                u.email as agente_email,
                CONCAT(u.name, ' ', u.last_name) as agente_nombre,
                DATEDIFF(NOW(), COALESCE(MAX(n.fecha_creacion), t.date_created)) as dias_sin_accion
            FROM (
                SELECT id_gestion as id, user_id, client_id, date_created, 'gestion' as tipo FROM gestion
                UNION ALL
                SELECT id_compra as id, user_id, client_id, date_created, 'compra' as tipo FROM compras
            ) t
            INNER JOIN clients c ON t.client_id = c.client_id
            INNER JOIN users u ON t.user_id = u.user_id
            LEFT JOIN notas n ON t.id = n.gestion_id AND t.tipo = n.tipo_nota
            WHERE t.id IS NOT NULL";

		// Si hay búsqueda, filtramos por cliente, agente o email
		if ($filtro) {
			$sql .= " AND (c.name LIKE :f OR c.last_name LIKE :f OR u.name LIKE :f OR u.email LIKE :f)";
		}

		$sql .= " GROUP BY t.id, t.tipo
              HAVING dias_sin_accion > 7
              ORDER BY dias_sin_accion DESC";

		try {
			$resultado = $this->conexion->prepare($sql);
			if ($filtro) $resultado->bindParam(':f', $filtro);
			$resultado->execute();

			$labels = [];
			$data = [];

			foreach ($resultado->fetchAll(PDO::FETCH_ASSOC) as $fila) {
				// Creamos una etiqueta que incluya el nombre del cliente y el correo del agente debajo
				$labels[] = [$fila['cliente'], "Agente: " . $fila['agente_email']];
				$data[] = $fila['dias_sin_accion'];
			}

			return json_encode(['labels' => $labels, 'data' => $data]);
		} catch (PDOException $e) {
			return json_encode(["error" => $e->getMessage()]);
		}
	}
}
