<?php

class base_datos extends PDO
{
	public $host = "localhost";
	public $bd = "contigo_mortgage_admin_panel";
	public $password = "";
	public $usuario = "root";
	public $conexion;
	public $error;
	public $repconexion;

	public function __construct()
	{

		try {
			$this->conexion = parent::__construct("mysql:host=$this->host;dbname=$this->bd", $this->usuario, $this->password);
			$this->repconexion = true;
			//	$this->errorconexion="";
		} catch (PDOException $e) {
			$this->error = "Ha ocurrido un error en la linea :" . $e->getLine() . " <br><br> Error: " . $e->getMessage();
		}
	}

	public function encoding($string)
	{
		$codec = '';
		for ($i = 0; $i < strlen($string); $i++) {
			$codec = $codec . base64_encode($string[$i]) . "~";
		}
		$string = base64_encode(base64_encode($codec));
		$string = base64_encode($string);
		return $string;
	}


	// public function decoding($string)
	// {
	// 	$string  = base64_decode(base64_decode($string));
    //     $string  = base64_decode($string);
    //     $string  = explode("~", $string);

    //     foreach ($string as $str) {
    //         $decodec = $decodec . base64_decode($str);
    //     }
    //     return $decodec;
	// }




	public function getRepConexion()
	{
		return $this->repconexion;
	}


	public function getErrorConexion()
	{
		return $this->error;
	}
}
