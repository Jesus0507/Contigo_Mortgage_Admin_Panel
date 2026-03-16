<?php

class historialController
{

    public function __construct()
    {
        require_once "modelo/historialModel.php";
    }


    public function get_historial($id_gestion, $tipo_gestion){
        $modelo = new historial_model();
        $historial = $modelo->get_historial_gestion($id_gestion, $tipo_gestion);
    }

    public function add_historial(){
        session_start();
        $accion = $_POST['accion'];
        $tipo_accion = $_POST['tipo_accion'];
        $id_gestion = $_POST['id_gestion'];
        $modelo = new historial_model();
        echo $modelo->registrar($id_gestion,$_SESSION['user_id'],$accion, $tipo_accion);
    }



}
