const inputElement = document.getElementById("meta_mensual_input");
var monto_max_btn = document.getElementById("monto_max_btn");

inputElement.oninput = function() {
    // 1. Eliminamos cualquier carácter que no sea número o punto
    let value = this.value.replace(/[^0-9.]/g, '');

    // 2. Evitamos que haya más de un punto decimal
    const parts = value.split('.');
    if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
    }

    // 3. Actualizamos el valor del input con el filtro aplicado
    this.value = value;
};

// Mantenemos tu función de formato para cuando pierda el foco
inputElement.onblur = function() {
    this.value = money_format(this.value);
};

function money_format(num) {
    const value = parseFloat(num);
    if (isNaN(value)) return "0,00"; 
    
    return value.toLocaleString('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

monto_max_btn.onclick = function(){
    if(inputElement.disabled == true){
        inputElement.disabled = false;
        monto_max_btn.innerHTML = "<i class='fas fa-check-circle'></i>";
    }
    else{
        inputElement.disabled = true;
        console.log(inputElement.value);
        monto_max_btn.innerHTML = "<i class='fas fa-pencil-alt'></i>";
         $.ajax({
            type: "POST",
            url: "index.php?c=main&a=change_monto_max",
            data: {
                "new_monto": inputElement.value
            }
        }).done(function (result) {
            console.log(result);
        })
    }
}