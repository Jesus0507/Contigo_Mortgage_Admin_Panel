<?php

require_once "config/config.php";
require_once "config/direcciones.php";
require_once "modelo/conect.php";


$conexion=new base_datos();



if($conexion->getRepConexion()==false){

echo "<h3>".$conexion->getErrorConexion()."<h3>";

}


 else{


 if(isset($_GET['c'])){
 	$controlador = cargarControlador($_GET['c']);

	if(isset($_GET['a'])){
		if(isset($_GET['id'])){
			cargarAccion($controlador, $_GET['a'], $_GET['id']);
		} else {
			cargarAccion($controlador, $_GET['a']);
		}
	} else {
		cargarAccion($controlador, ACCION_PRINCIPAL);
	}

} else {

	$controlador = cargarControlador(CONTROLADOR_PRINCIPAL);
	$accionTmp = ACCION_PRINCIPAL;
	$controlador->$accionTmp();
}
}
?>