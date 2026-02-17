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

    // public function set_inicio($cedula_usuario,$inicio_sesion){
    // 	$this->cedula_usuario=$cedula_usuario;
    // 	$this->inicio_sesion=$inicio_sesion;
    // }
    public function set_historial($id_gestion, $user_id, $accion, $tipo_accion, $tipo_gestion)
    {
        $this->id_gestion = $id_gestion;
        $this->user_id = $user_id;
        $this->accion = $accion;
        $this->tipo_accion = $tipo_accion;
        $this->tipo_gestion = $tipo_gestion;
    }



    // public function get_bitacora()
    // {
    //     $bitacora_result = [
    //         'codigo' => $this->codigo,
    //         'fecha' => $this->fecha,
    //         'cedula_usuario' => $this->cedula_usuario,
    //         'inicio_sesion' => $this->inicio_sesion,
    //         'acciones' => $this->acciones,
    //         'final_sesion' => $this->final_sesion

    //     ];
    //     return $bitacora_result;
    // }

    public function registrar()
    {
        $query = "INSERT INTO historial (id_gestion,user_id, accion, tipo_accion, tipo_gestion) VALUES ($this->id_gestion, $this->user_id, '$this->accion', '$this->tipo_accion', '$this->tipo_gestion')";
        try {
            $resultado = $this->conexion->prepare($query);
            $resultado->execute();
            return true;
        } catch (PDOException $e) {
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
            return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
        }
    }

    // public function get_bitacora_bd(){
    // 	$query="SELECT * FROM bitacora";
    // 	try {
    // 		$marcas=[];
    // 		$resultado = $this->conexion->prepare($query);
    // 		$resultado->execute();
    // 		$resultado->setFetchMode(PDO::FETCH_ASSOC);
    // 		foreach($resultado->fetchAll(PDO::FETCH_ASSOC) as $v){
    // 		 $marca=new brands_model();
    // 		 $marca->set_marca($v['nombre_marca_producto']);
    // 		 $marcas[]=$marca;
    // 		}
    // 		return $marcas;
    // 	} catch (PDOException $e) {
    // 		return "Ha ocurrido un error en la línea ".$e->getLine()." <br> Error: ".$e->getMessage();
    // 	}
    // }


    // public function editar($acciones, $codigo)
    // {
    //     $query = "UPDATE bitacora SET acciones='$this->acciones' WHERE codigo='$codigo'";
    //     try {
    //         $resultado = $this->conexion->prepare($query);
    //         $resultado->execute();
    //         return true;
    //     } catch (PDOException $e) {
    //         return "Ha ocurrido un error en la línea " . $e->getLine() . " <br> Error: " . $e->getMessage();
    //     }
    // }
}
