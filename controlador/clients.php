<?php

class clientsController
{

    public function __construct()
    {
        require_once "modelo/clientsModel.php";
    }

    public function index()
    {

        session_start();
        if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
            require_once "vista/login.php";
            session_destroy();
        } else {
            $modelo = new clients_model();
            $clients = $modelo->get_clients();
            require_once "vista/clients.php";
        }
    }


    public function update(){
        $modelo = new clients_model();
        echo $modelo->update_client($_POST['name'], $_POST['last_name'],$_POST['phone']);
    }

    public function delete(){
        $modelo = new clients_model();
        echo $modelo->delete_client($_POST['phone']);
    }



}
