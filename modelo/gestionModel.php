<?php

require_once "conect.php";

class gestion_model
{

    private $id_board;
    private $client_id;
    private $user_id;
    private $property_address;
    private $property_value;
    private $interes_actual;
    private $occupancy;
    private $mortgage;
    private $detalle_llamada;
    private $ltv;
    private $interes_estimado;
    private $prepayment_penalty;
    private $gastos_cierre;
    private $tipo_prestamo;
    private $condiciones_adicionales;
    private $loan_amount;
    private $cashout;
    private $conexion;

    public function __construct()
    {
        $this->conexion = new base_datos();
    }

    public function set_gestion($id_board, $client_id, $user_id, $property_address, $property_value, $interes_actual, $mortgage, $occupancy, $detalle_llamada, $ltv, $interes_estimado, $prepayment_penalty, $gastos_cierre, $tipo_prestamo, $condiciones_adicionales, $loan_amount, $cashout)
    {
        $this->id_board = $id_board;
        $this->client_id = $client_id;
        $this->user_id = $user_id;
        $this->property_address = $property_address;
        $this->occupancy = $occupancy;
        $this->property_value = $property_value;
        $this->interes_actual = $interes_actual;
        $this->mortgage = $mortgage;
        $this->detalle_llamada = $detalle_llamada;
        $this->ltv = $ltv;
        $this->interes_estimado = $interes_estimado;
        $this->prepayment_penalty = $prepayment_penalty;
        $this->gastos_cierre = $gastos_cierre;
        $this->tipo_prestamo = $tipo_prestamo;
        $this->condiciones_adicionales = $condiciones_adicionales;
        $this->loan_amount = $loan_amount;
        $this->cashout = $cashout;
    }


    public function registrar()
    {
        $query = "INSERT INTO gestion (id_board, client_id, user_id, property_address, property_value, interes_actual, mortgage, occupancy, detalle_llamada,ltv, interes_estimado, prepayment_penalty, gastos_cierre, tipo_prestamo, condiciones_adicionales, loan_amount, cash_out, etapa_actual) VALUES ('$this->id_board','$this->client_id', '$this->user_id', '$this->property_address', '$this->property_value', '$this->interes_actual', '$this->mortgage', '$this->occupancy', '$this->detalle_llamada','$this->ltv','$this->interes_estimado','$this->prepayment_penalty','$this->gastos_cierre','$this->tipo_prestamo','$this->condiciones_adicionales','$this->loan_amount','$this->cashout','prospecto')";
        try {
            $resultado = $this->conexion->prepare($query);
            $resultado->execute();
            return true;
        } catch (PDOException $e) {
            return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
        }
    }

    public function update_gestion($etapa, $id_gestion)
    {
        $date = date('Y-m-d H:i:s');
        $query = "UPDATE gestion SET etapa_actual = '$etapa', last_update = '$date'  WHERE id_gestion = $id_gestion";
        try {
            $resultado = $this->conexion->prepare($query);
            $resultado->execute();
            return true;
        } catch (PDOException $e) {
            return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
        }
    }

     public function update_gestion_info($id_gestion)
    {
        $query = "UPDATE gestion SET client_id = '$this->client_id', property_address = '$this->property_address', property_value = '$this->property_value', interes_actual = '$this->interes_actual', mortgage = '$this->mortgage', occupancy = '$this->occupancy', detalle_llamada = '$this->detalle_llamada',ltv = '$this->ltv', interes_estimado = '$this->interes_estimado', prepayment_penalty = '$this->prepayment_penalty', gastos_cierre = '$this->gastos_cierre', tipo_prestamo = '$this->tipo_prestamo', condiciones_adicionales = '$this->condiciones_adicionales', loan_amount = '$this->loan_amount', cash_out = '$this->cashout'  WHERE id_gestion = $id_gestion";
        try {
            $resultado = $this->conexion->prepare($query);
            $resultado->execute();
            return true;
        } catch (PDOException $e) {
            return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
        }
    }



    public function get_gestion_info($id_gestion)
    {
        $query = "SELECT g.*, c.*, u.name as user_name, u.last_name as user_last_name FROM gestion g, clients c, users u WHERE g.id_gestion = $id_gestion AND g.client_id = c.client_id AND g.user_id = u.user_id";
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

    public function get_gestion_notes($id_gestion)
    {
        $query = "SELECT n.*, u.name, u.last_name, u.user_id FROM notas n, users u WHERE n.gestion_id = $id_gestion AND tipo_nota = 'gestion' AND u.user_id = n.user_id";
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


    public function get_gestion_deudas($id_gestion)
    {
        $query = "SELECT * FROM deudas_adicionales WHERE id_gestion= $id_gestion";
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

    public function get_last_gestion()
    {
        $query = "SELECT * FROM gestion ORDER BY id_gestion DESC LIMIT 1";
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

    public function add_note($id_gestion, $id_user, $content)
    {
        $query = "INSERT INTO notas (gestion_id, user_id, contenido, tipo_nota) VALUES ($id_gestion,$id_user, '$content', 'gestion')";
        try {
            $resultado = $this->conexion->prepare($query);
            $resultado->execute();
            return true;
        } catch (PDOException $e) {
            return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
        }
    }

    public function add_deuda($id_gestion, $descripcion, $monto)
    {
        $query = "INSERT INTO deudas_adicionales (id_gestion, description, amount) VALUES ($id_gestion, '$descripcion', '$monto')";
        try {
            $resultado = $this->conexion->prepare($query);
            $resultado->execute();
            return true;
        } catch (PDOException $e) {
            return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
        }
    }

    public function get_last_deuda()
    {
        $query = "SELECT * FROM deudas_adicionales  ORDER BY id_deuda DESC LIMIT 1";
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


    public function delete_deuda($id_deuda)
    {
        $query = "DELETE FROM deudas_adicionales WHERE id_deuda = $id_deuda";
        try {
            $resultado = $this->conexion->prepare($query);
            $resultado->execute();
            return true;
        } catch (PDOException $e) {
            return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
        }
    }
}
