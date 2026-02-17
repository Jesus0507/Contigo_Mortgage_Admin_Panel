var boton=document.getElementById("updateButton");
var input=document.getElementById('inputBs');
var vista=document.getElementById('vistaBs');
var formulario=document.getElementById('form');


boton.onclick=function(){
	if(input.style.display=='none'){
        input.style.display='';
        input.focus();
		boton.innerHTML="<i class='fas fa-check fa-sm text-white-50' ></i> Listo"
		vista.style.display='none';
		boton.style.background='green';
	}
	else{

		if(input.value=='' || input.value==vista.innerHTML){
			input.style.display='none';
			boton.innerHTML="<i class='fas fa-edit fa-sm text-white-50' ></i> Modificar"
			vista.style.display='';
			boton.style.background='';
		}
		else{
			formulario.submit();
		}
	}
}