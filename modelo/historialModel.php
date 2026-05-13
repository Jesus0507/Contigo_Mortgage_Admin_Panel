<?php

require_once "conect.php";

class historial_model
{

    private $id_gestion;
    private $user_id;
    private $accion;
    private $tipo_accion;
    private $tipo_gestion;
    private $conexion;

    public function __construct()
    {
        $this->conexion = new base_datos();
    }

    public function set_historial($id_gestion, $user_id, $accion, $tipo_accion, $tipo_gestion)
    {
        $this->id_gestion = $id_gestion;
        $this->user_id = $user_id;
        $this->accion = $accion;
        $this->tipo_accion = $tipo_accion;
        $this->tipo_gestion = $tipo_gestion;
    }

    public function registrar()
    {
        $query = "INSERT INTO historial (id_gestion,user_id, accion, tipo_accion, tipo_gestion) VALUES ($this->id_gestion, $this->user_id, '$this->accion', '$this->tipo_accion', '$this->tipo_gestion')";
        try {
            $resultado = $this->conexion->prepare($query);
            $resultado->execute();
            return true;
        } catch (PDOException $e) {
            $this->conexion->escribir_log("Error en Registro: " . $e->getMessage()." Query:".$query, 'debug_registro.txt');
            return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
        }
    }


    public function get_historial_gestion($id_gestion, $tipo_gestion)
    {
        $query = "SELECT h.*, u.name, u.last_name FROM historial h, users u where h.id_gestion = $id_gestion and h.tipo_gestion = '$tipo_gestion' AND u.user_id = h.user_id";
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
}
