<?php

class usersController
{

    public function __construct()
    {
        require_once "modelo/usersModel.php";
        require_once "modelo/conect.php";
    }

    public function index()
    {

        session_start();
        if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
            require_once "vista/login.php";
            session_destroy();
        } else {
            $modelo = new users_model();
            $modelo_db = new base_datos();
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
        $modelo->set_user($_POST['name'], $_POST['last_name'], $_POST['role'], strtolower($_POST['email']), $_POST['psw'], 1);
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
        $modelo_db = new base_datos();
        echo $modelo->update_user($_POST['name'], $_POST['last_name'], strtolower($_POST['email']), strtolower($_POST['role']), $_POST['user_id'], $modelo_db->encoding($_POST['psw']));
    }

    public function update_security()
    {
        session_start();
        if (!isset($_SESSION['user_id'])) {
            echo "error_session";
            return;
        }

        $modelo = new users_model();
        $modelo_conect = new base_datos();
        $user_id = $_SESSION['user_id'];

        // 1. Verificar la contraseña actual primero
        $pass_actual = $modelo_conect->encoding($_POST['pass_actual']);

        // Asumiendo que usas password_hash() para guardar tus contraseñas
        if ($pass_actual != $_SESSION['psw']) {
            echo "error_password"; // Esto lo capturará el AJAX
            return;
        }

        // 2. Preparar los datos para el modelo


        $new_psw = $modelo_conect->encoding($_POST['pass_nueva']);
        $security_questions = strtolower($_POST['p_mascota']) . "/" . strtolower($_POST['p_color']) . "/" . strtolower($_POST['p_personaje']);
        $custom_questions = $_POST['p_custom'] . "/" . strtolower($_POST['r_custom']);

        // 3. Llamar al modelo
        $resultado = $modelo->update_user_security($new_psw, $modelo_conect->encoding($security_questions), $modelo_conect->encoding($custom_questions), $user_id);

        if ($resultado === true) {
            $_SESSION['first_login'] = 1;
            $_SESSION['security_questions'] = $modelo_conect->encoding($security_questions);
            $_SESSION['custom_questions'] = $modelo_conect->encoding($custom_questions);
            echo 1; // Éxito

        } else {
            echo $resultado; // Mensaje de error del modelo
        }
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
        $user_id = $_POST['user_id'];
        $new_agents_ids = $_POST['new_agents_ids']; // Esto ya es un array de IDs

        if (empty($new_agents_ids)) {
            echo "Error: Debe seleccionar al menos un agente para la redistribución.";
            return;
        }

        $modelo = new users_model();
        // Llamamos al nuevo método de redistribución
        echo $modelo->delete_user_with_redistribute($user_id, $new_agents_ids);
    }


    public function recovery_password()
    {
        $modelo_conect = new base_datos();
        $modelo = new users_model();
        $pet = $_POST['pet'];
        $color = $_POST['color'];
        $character = $_POST['character'];
        $security_questions = $modelo_conect->encoding($pet . "/" . $color . "/" . $character);
        $email = $_POST['email'];
        $user = $modelo -> search_user_email($email);
        $original_custom_question = explode("/",$modelo_conect -> decoding($user[0]['custom_security_question']))[1];
        $custom = $_POST['custom'] == $original_custom_question ? true : false;
        $password = $modelo_conect->encoding($_POST['password']);
        $valid_security_questions = $security_questions == $user[0]['security_questions'] ? true: false;
        if($custom && $valid_security_questions){
            echo $modelo -> update_user_psw($password, $user[0]['user_id']);
        }
        else{
            echo false;
        }
    }
}
