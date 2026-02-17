<?php
require_once "config.php";
	
	function cargarControlador($controlador){
		
 		$nombreControlador = ucwords($controlador)."Controller";
 		$archivoControlador = 'controlador/'.ucwords($controlador).'.php';
 		
 		$file_find = !is_file($archivoControlador) ? "no existe" : "existe";
 		if($file_find == "no existe"){
 		    $nombreControlador = $controlador."Controller";
 		    $archivoControlador = 'controlador/'.$controlador.'.php';
 		    $file_find = !is_file($archivoControlador) ? "no existe" : "existe";
 		}

       // echo "archivo ".$archivoControlador." encontrado: ". $file_find;
		
		if(!is_file($archivoControlador)){
			
			$archivoControlador= 'controlador/'.CONTROLADOR_PRINCIPAL.'.php';
			
		}
		require_once $archivoControlador;
		$control = new $nombreControlador();
		return $control;
	}
	
	function cargarAccion($controller, $accion, $id = null){
		
		if(isset($accion) && method_exists($controller, $accion)){
			if($id == null){
				$controller->$accion();
				} else {
				$controller->$accion($id);
			}
			} else {
			$controller->ACCION_PRINCIPAL();
		}	
	}
?>