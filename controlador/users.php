<?php

class usersController
{

    public function __construct()
    {
        require_once "modelo/usersModel.php";
    }

    public function index()
    {

        session_start();
        if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
            require_once "vista/login.php";
            session_destroy();
        } else {
            $modelo = new users_model();
            $usuarios = $modelo->get_users();
            require_once "vista/users.php";
        }
    }


    public function register()
    {

        session_start();
        if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
            require_once "vista/login.php";
            session_destroy();
        } else {
            $modelo = new users_model();
            $usuarios = $modelo->get_users();
            require_once "vista/add_user.php";
        }
    }


    public function add_user()
    {
        $modelo = new users_model();
        $modelo->set_user($_POST['name'], $_POST['last_name'], 'user', strtolower($_POST['email']), $_POST['psw'], 1);
        $registros = $modelo->search_user();

        if (count($registros) > 0) {
            echo "already registered";
        } else {

            $resultado = $modelo->registrar();
            if ($resultado) {
                echo "registered successfully";
            } else {
                echo $resultado;
            }
        }
    }

    public function update()
    {
        $modelo = new users_model();
        echo $modelo->update_user($_POST['name'], $_POST['last_name'], strtolower($_POST['email']), $_POST['user_id']);
    }

    // public function delete()
    // {
    //     $modelo = new users_model();
    //     echo $modelo->delete_user($_POST['user_id']);
    // }

    public function get_available_agents()
    {
        $modelo = new users_model();
        echo json_encode($modelo->get_agents_except($_GET['exclude_id']));
    }

    public function delete()
    {
        $modelo = new users_model();
        // Recibimos ambos IDs por POST
        echo $modelo->delete_user_with_reassign($_POST['user_id'], $_POST['new_agent_id']);
    }
}
