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

    // public function addUsers(){
    //        require_once "vista/addUsers.php";
    // }

    // public function editUsers(){
    // 	$modelo=new users_model();
    // 	$usuarios=$modelo->get_users();
    // 	$usuario="";
    // 	foreach($usuarios as $u){
    // 		if($u->get_cedula_usuario()==$_GET['id']){
    // 			$usuario=$u;
    // 		}
    // 	}

    //        require_once "vista/editUsers.php";
    // }

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

    public function delete()
    {
        $modelo = new users_model();
        echo $modelo->delete_user($_POST['user_id']);
    }

    // public function delete(){
    // 	$modelo=new users_model();
    // 	if($modelo->eliminar($_GET['id'])){
    // 		echo "<script>alert('Se ha eliminado al usuario');setTimeout(function(){location.href='index.php?c=users&a=index'},100);</script>";
    // 	}
    // 	else{
    // 		echo $modelo->eliminar($_GET['id']);
    // 	}
    // }

    // public function update_user(){
    // 	$modelo=new users_model();
    // 	$modelo->set_usuario($_POST['cedula'],$_POST['nombre'],$_POST['apellido'],$_POST['telefono'],$_POST['correo'],$_POST['contrasenia'],$_POST['cargo'],$_POST['userName'],$_POST['tipoUsuario']);
    //     $resultado=$modelo->editar();
    // 	if($resultado){
    // 		echo "<script>alert('Se ha modificado con éxito');setTimeout(function(){location.href='index.php?c=users&a=index'},100);</script>";
    // 	}
    // 	else{
    // 		echo $resultado;
    // 	}
    // }

}
