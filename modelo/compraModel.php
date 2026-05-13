<?php

require_once "conect.php";

class compra_model
{
    private $id_board;
    private $client_id;
    private $user_id;
    private $tipo_proceso;
    private $primer_comprador;
    private $forma_pago;
    private $tiempo_pago_electronico;
    private $disponible_comprar;
    private $credito_cliente;
    private $estatus_legal;
    private $detalle_llamada;
    private $interes_ofrecido;
    private $gastos_cierre;
    private $down_payment;
    private $monto_max_aplicado;
    private $condiciones_notas;
    private $total_requerido;
    private $programa_aplica;
    private $realtor_name;
    private $realtor_tlf;
    private $realtor_email;
    private $prioridad;
    private $conexion;

    public function __construct()
    {
        $this->conexion = new base_datos();
    }

    public function set_compra($id_board, $client_id, $user_id, $tipo_proceso, $primer_comprador, $forma_pago, $tiempo_pago_electronico, $disponible_comprar, $credito_cliente, $estatus_legal, $interes_ofrecido, $gastos_cierre, $down_payment, $monto_max_aplicado, $condiciones_notas, $detalle_llamada, $total_requerido, $programa_aplica, $realtor_name, $realtor_tlf, $realtor_email, $prioridad)
    {
        $this->id_board = $id_board;
        $this->client_id = $client_id;
        $this->user_id = $user_id;
        $this->tipo_proceso = $tipo_proceso;
        $this->primer_comprador = $primer_comprador;
        $this->forma_pago = $forma_pago;
        $this->tiempo_pago_electronico = $tiempo_pago_electronico;
        $this->disponible_comprar = $disponible_comprar;
        $this->credito_cliente = $credito_cliente;
        $this->estatus_legal = $estatus_legal;
        $this->interes_ofrecido = $interes_ofrecido;
        $this->gastos_cierre = $gastos_cierre;
        $this->down_payment = $down_payment;
        $this->monto_max_aplicado = $monto_max_aplicado;
        $this->condiciones_notas = $condiciones_notas;
        $this->detalle_llamada = $detalle_llamada;
        $this->total_requerido = $total_requerido;
        $this->programa_aplica = $programa_aplica;
        $this->realtor_name = $realtor_name;
        $this->realtor_tlf = $realtor_tlf;
        $this->realtor_email = $realtor_email;
        $this->prioridad = $prioridad;
    }


    public function registrar()
    {

        $query = "INSERT INTO compras (
        id_board, client_id, user_id, tipo_proceso, primer_comprador, 
        forma_pago, tiempo_pago_electronico, disponible_comprar, credito_cliente, 
        estatus_legal, interes_ofrecido, gastos_cierre, down_payment, 
        monto_max_aplicado, programa_aplica, condiciones_notas, total_requerido, detalle_llamada, realtor_name, realtor_tlf, realtor_email, prioridad,etapa_actual
    ) VALUES (
        $this->id_board, $this->client_id, $this->user_id, '$this->tipo_proceso', '$this->primer_comprador', 
        '$this->forma_pago', '$this->tiempo_pago_electronico', '$this->disponible_comprar', '$this->credito_cliente', 
        '$this->estatus_legal', '$this->interes_ofrecido', '$this->gastos_cierre', '$this->down_payment', 
        '$this->monto_max_aplicado', '$this->programa_aplica', '$this->condiciones_notas', '$this->total_requerido', '$this->detalle_llamada', '$this->realtor_name','$this->realtor_tlf','$this->realtor_email',$this->prioridad,'prospecto'
    )";

        try {
            $resultado = $this->conexion->prepare($query);
            $resultado->execute();
            return true;
        } catch (PDOException $e) {
            $this->conexion->escribir_log("Error en Registro: " . $e->getMessage()." Query:".$query, 'debug_registro.txt');
            return "Error: " . $e->getMessage();
        }
    }

    public function update_gestion($etapa, $id_compra)
    {
        $date = date('Y-m-d H:i:s');
        $query = "UPDATE compras SET etapa_actual = '$etapa', last_update = '$date'  WHERE id_compra = $id_compra";
        try {
            $resultado = $this->conexion->prepare($query);
            $resultado->execute();
            return true;
        } catch (PDOException $e) {
            $this->conexion->escribir_log("Error en Registro: " . $e->getMessage()." Query:".$query, 'debug_registro.txt');
            return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
        }
    }


    public function get_full_gestion_info($id_compra)
    {
        $query = "SELECT co.*, c.*, u.name as user_name, u.last_name as user_last_name , u.email as user_email
              FROM compras co 
              JOIN clients c ON co.client_id = c.client_id 
              JOIN users u ON co.user_id = u.user_id 
              WHERE co.id_compra = $id_compra";

        try {
            $stmt = $this->conexion->prepare($query);
            $stmt->execute();
            $gestion = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$gestion) return null;

            $query_ingresos = "SELECT * FROM compra_clientes_income WHERE id_compra = $id_compra";
            $stmt_ing = $this->conexion->prepare($query_ingresos);
            $stmt_ing->execute();
            $clientes_income = $stmt_ing->fetchAll(PDO::FETCH_ASSOC);


            foreach ($clientes_income as &$cliente) {
                $id_cli = $cliente['id_cliente_income'];
                $query_trabajos = "SELECT * FROM cliente_trabajos WHERE id_cliente_income = $id_cli";
                $stmt_trab = $this->conexion->prepare($query_trabajos);
                $stmt_trab->execute();
                $trabajos = $stmt_trab->fetchAll(PDO::FETCH_ASSOC);


                foreach ($trabajos as &$trabajo) {
                    $id_trab = $trabajo['id_trabajo'];
                    $query_taxes = "SELECT id_tax_detalle, anio, monto 
                                FROM trabajo_taxes_detalle 
                                WHERE id_trabajo = $id_trab 
                                ORDER BY anio DESC";
                    $stmt_tax = $this->conexion->prepare($query_taxes);
                    $stmt_tax->execute();
                    $trabajo['taxes'] = $stmt_tax->fetchAll(PDO::FETCH_ASSOC);
                }

                $cliente['trabajos'] = $trabajos;
            }

            return [
                "base" => [$gestion],
                "ingresos" => $clientes_income
            ];
        } catch (PDOException $e) {
            $this->conexion->escribir_log("Error en Registro: " . $e->getMessage()." Query:".$query, 'debug_registro.txt');
            return "Error: " . $e->getMessage();
        }
    }

    public function update_compra_info($id_compra)
    {
        $query = "UPDATE compras SET 
                id_board = $this->id_board,
                user_id = $this->user_id,
                client_id = $this->client_id,
                tipo_proceso = '$this->tipo_proceso',
                primer_comprador = '$this->primer_comprador',
                forma_pago = '$this->forma_pago',
                tiempo_pago_electronico = '$this->tiempo_pago_electronico',
                disponible_comprar = '$this->disponible_comprar',
                credito_cliente = '$this->credito_cliente',
                estatus_legal = '$this->estatus_legal',
                interes_ofrecido = '$this->interes_ofrecido',
                gastos_cierre = '$this->gastos_cierre',
                down_payment = '$this->down_payment',
                monto_max_aplicado = '$this->monto_max_aplicado',
                condiciones_notas = '$this->condiciones_notas',
                detalle_llamada = '$this->detalle_llamada',
                programa_aplica = '$this->programa_aplica',
                realtor_name = '$this->realtor_name',
                realtor_tlf = '$this->realtor_tlf',
                realtor_email = '$this->realtor_email',
                total_requerido = '$this->total_requerido',
                prioridad = $this->prioridad
              WHERE id_compra = $id_compra";

        try {
            $resultado = $this->conexion->prepare($query);
            $resultado->execute();
            return true;
        } catch (PDOException $e) {
            $this->conexion->escribir_log("Error en Registro: " . $e->getMessage()." Query:".$query, 'debug_registro.txt');
            return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
        }
    }


    public function get_gestion_info($id_compra)
    {
        $query = "SELECT co.*, c.*,  u.name as user_name, u.last_name as user_last_name FROM compras co, clients c, users u WHERE co.id_compra = $id_compra AND co.client_id = c.client_id AND co.user_id = u.user_id";
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

    public function get_gestion_notes($id_compra)
    {
        $query = "SELECT n.*, u.name, u.last_name, u.user_id FROM notas n, users u WHERE n.gestion_id = $id_compra AND tipo_nota = 'compra' AND u.user_id = n.user_id";
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



    public function get_last_compra()
    {
        $query = "SELECT * FROM compras ORDER BY id_compra DESC LIMIT 1";
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

    public function add_note($id_gestion, $id_user, $content)
    {
        $query = "INSERT INTO notas (gestion_id, user_id, contenido, tipo_nota) VALUES ($id_gestion,$id_user, '$content', 'compra')";
        try {
            $resultado = $this->conexion->prepare($query);
            $resultado->execute();
            return true;
        } catch (PDOException $e) {
            $this->conexion->escribir_log("Error en Registro: " . $e->getMessage()." Query:".$query, 'debug_registro.txt');
            return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
        }
    }


    public function add_cliente_income($id_compra, $name, $last_name, $fico = null, $deuda = 0, $estatus = null)
    {
        // Manejo de valores nulos para SQL
        $fico_val = $fico ? (int)$fico : "NULL";
        $deuda_val = $deuda ?: 0;
        $estatus_val = $estatus ? "'$estatus'" : "NULL";

        $query = "INSERT INTO compra_clientes_income (id_compra, client_name, client_last_name, fico, deuda_total, estatus_legal, created) 
              VALUES ($id_compra, '$name', '$last_name', $fico_val, $deuda_val, $estatus_val, NOW())";
        try {
            $resultado = $this->conexion->prepare($query);
            $resultado->execute();
            return $this->conexion->lastInsertId();
        } catch (PDOException $e) {
            $this->conexion->escribir_log("Error en Registro: " . $e->getMessage()." Query:".$query, 'debug_registro.txt');
            return "Error en línea " . $e->getLine() . ": " . $e->getMessage();
        }
    }
    public function add_cliente_trabajo($id_cliente, $tipo, $empresa, $modo, $v_hora, $horas, $freq, $anual)
    {
        // Limpieza de valores opcionales
        $v_hora = $v_hora ?: "NULL";
        $horas = $horas ?: "NULL";
        $freq = $freq ?: "NULL";

        $query = "INSERT INTO cliente_trabajos (
                id_cliente_income, tipo, empresa, modo, 
                valor_hora, horas_semanales, frecuencia_anual, 
                income_anual
            ) VALUES (
                $id_cliente, '$tipo', '$empresa', '$modo', 
                $v_hora, $horas, $freq, $anual
            )";
        try {
            $resultado = $this->conexion->prepare($query);
            $resultado->execute();
            return $this->conexion->lastInsertId();
        } catch (PDOException $e) {
            $this->conexion->escribir_log("Error en Registro: " . $e->getMessage()." Query:".$query, 'debug_registro.txt');
            return "Error en línea " . $e->getLine() . ": " . $e->getMessage();
        }
    }



    public function delete_cliente_compra($id_compra)
    {
        $query = "DELETE FROM compra_clientes_income WHERE id_compra = $id_compra";
        try {
            $resultado = $this->conexion->prepare($query);
            $resultado->execute();
            return true;
        } catch (PDOException $e) {
            $this->conexion->escribir_log("Error en Registro: " . $e->getMessage()." Query:".$query, 'debug_registro.txt');
            return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
        }
    }

    public function add_trabajo_tax_detalle($id_trabajo, $anio, $monto)
    {
        $query = "INSERT INTO trabajo_taxes_detalle (id_trabajo, anio, monto) 
              VALUES ($id_trabajo, $anio, $monto)";
        try {
            $resultado = $this->conexion->prepare($query);
            $resultado->execute();
            return true;
        } catch (PDOException $e) {
            $this->conexion->escribir_log("Error en Registro: " . $e->getMessage()." Query:".$query, 'debug_registro.txt');
            return "Error en línea " . $e->getLine() . ": " . $e->getMessage();
        }
    }


    public function get_conexion()
    {
        return $this->conexion;
    }
}
