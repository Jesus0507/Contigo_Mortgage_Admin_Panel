<?php

class profileController
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
            $modelo = new base_datos();
            $custom_question = explode("/", $modelo->decoding($_SESSION['custom_questions']))[0];
            require_once "vista/profile.php";
        }
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

        // 1. Validar que la información de seguridad no venga vacía
        if (empty($_POST['p_mascota']) || empty($_POST['p_color']) || empty($_POST['p_personaje']) || empty($_POST['r_custom'])) {
            echo "campos_seguridad_vacios";
            return;
        }

        // 2. Verificar la contraseña actual
        $pass_actual = $modelo_conect->encoding($_POST['pass_actual']);
        if ($pass_actual != $_SESSION['psw']) {
            echo "error_password";
            return;
        }

        // 3. Preparar datos de Usuario
        $nombre = $_POST['nombre'];
        $apellido = $_POST['apellido'];
        $correo = strtolower($_POST['email']);

        // 4. Preparar datos de Seguridad
        // Si la pass nueva está vacía, enviamos la actual de la sesión para no cambiarla
        $new_psw = !empty($_POST['pass_nueva']) ? $modelo_conect->encoding($_POST['pass_nueva']) : $_SESSION['psw'];

        $security_questions = strtolower($_POST['p_mascota']) . "/" . strtolower($_POST['p_color']) . "/" . strtolower($_POST['p_personaje']);
        $custom_questions = strtolower($_POST['r_custom']);

        if($modelo_conect->encoding($security_questions) != $_SESSION['security_questions']){
            echo "preguntas_seguridad";
            return;
        }

        if($custom_questions != explode("/",$modelo_conect->decoding($_SESSION['custom_questions']))[1]){
            echo "custom_pregunta";
            return;
        }



        // 5. Llamar al modelo (Asegúrate de que el modelo reciba estos nuevos parámetros)
        $resultado = $modelo->update_user_profile(
            $nombre,
            $apellido,
            $correo,
            $new_psw,
            $_SESSION['security_questions'],
            $_SESSION['custom_questions'],
            $user_id
        );

        if ($resultado === true) {
            // Actualizamos la sesión con los nuevos datos para que se vean reflejados en el sistema

            $_SESSION['username'] = $nombre . " " . $apellido;
            $_SESSION['email'] = $correo;
            $_SESSION['psw'] = $new_psw;
            $_SESSION['first_login'] = 1; // Marcamos que ya configuró seguridad

            echo 1;
        } else {
            echo $resultado;
        }
    }
}
