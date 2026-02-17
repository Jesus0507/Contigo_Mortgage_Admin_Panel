<?php

class historialController
{

    public function __construct()
    {
        require_once "modelo/historialModel.php";
    }


    public function get_historial($id_gestion){
        $modelo = new historial_model();
        $historial = $modelo->get_historial_gestion($id_gestion);
    }

    public function add_historial(){
        session_start();
        $accion = $_POST['accion'];
        $tipo_accion = $_POST['tipo_accion'];
        $id_gestion = $_POST['id_gestion'];
        $modelo = new historial_model();
        echo $modelo->registrar($id_gestion,$_SESSION['user_id'],$accion, $tipo_accion);
    }
    // public function index()
    // {

    //     session_start();
    //     if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
    //         require_once "vista/login.php";
    //         session_destroy();
    //     } else {
    //         $modelo = new clients_model();
    //         $clients = $modelo->get_clients();
    //         require_once "vista/clients.php";
    //     }
    // }


    // public function update(){
    //     $modelo = new clients_model();
    //     echo $modelo->update_client($_POST['name'], $_POST['last_name'],$_POST['phone']);
    // }

    // public function delete(){
    //     $modelo = new clients_model();
    //     echo $modelo->delete_client($_POST['phone']);
    // }



}
