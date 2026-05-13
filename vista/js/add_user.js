var form_inputs = document.querySelector(".card-body").querySelectorAll('input');
var form_btn = document.getElementById("btn_registro");
var input_eye_btn = document.getElementById("input_eye_btn");
form_inputs[3].maxLength = 20;



form_btn.onclick = function () {
    if (form_inputs[0].value == "" || form_inputs[0].value == null) {
        form_inputs[0].focus();
        form_inputs[0].style.border = "2px solid red";
    }
    else {
        form_inputs[0].style.border = "none";
        if (form_inputs[1].value == "" || form_inputs[1].value == null) {
            form_inputs[1].focus();
            form_inputs[1].style.border = "2px solid red";
        }
        else {
            form_inputs[1].style.border = "none";
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (form_inputs[2].value == "" || form_inputs[2].value == null || !regex.test(form_inputs[2].value)) {
                form_inputs[2].focus();
                form_inputs[2].style.border = "2px solid red";
            }
            else {
                form_inputs[2].style.border = "none";
                if (form_inputs[3].value == "" || form_inputs[0].value == null) {
                    form_inputs[3].focus();
                    form_inputs[3].style.border = "2px solid red";
                }
                else {
                    form_inputs[3].style.border = "";
                    registrar_usuario();
                }
            }
        }
    }
}

input_eye_btn.onclick = function () {
    if (form_inputs[3].type == "password") {

        input_eye_btn.innerHTML = "<i class='fas fa-eye-slash'> </i>"
        form_inputs[3].type = "text";
    }
    else {
        input_eye_btn.innerHTML = "<i class='fas fa-eye'> </i>"
        form_inputs[3].type = "password";
    }
}

// ... (mismo código de variables y eventos onclick)

function registrar_usuario() {
    // --- LÍNEA DE DEFENSA: Bloqueo de botón y feedback ---
    const originalText = form_btn.innerHTML;
    form_btn.disabled = true;
    form_btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
    // ----------------------------------------------------

    $.ajax({
        type: "POST",
        url: "index.php?c=users&a=add_user",
        data: {
            "name": form_inputs[0].value,
            "last_name": form_inputs[1].value,
            "email": form_inputs[2].value,
            "psw": form_inputs[3].value,
            "role": document.getElementById("user_role_select").value
        },
        error: function () {
            // Restaurar en caso de fallo crítico de red o error 500
            form_btn.disabled = false;
            form_btn.innerHTML = originalText;
        }
    }).done(function (result) {
        switch (result) {
            case 'already registered':
                // Restaurar botón para que el usuario corrija el correo
                form_btn.disabled = false;
                form_btn.innerHTML = originalText;

                document.getElementById("label_warnings").innerHTML = "<b>Ya existe un usuario registrado con este correo.</b>";
                document.getElementById("label_warnings").classList.remove("d-none");
                setTimeout(() => {
                    document.getElementById("label_warnings").classList.add("d-none")
                }, 3000)
                break;

            case 'registered successfully':
                document.getElementById("label_warnings").innerHTML = "<b>Usuario registrado exitosamente.</b>";
                document.getElementById("label_warnings").style.color = "green";
                document.getElementById("label_warnings").classList.remove("d-none");
                setTimeout(() => {
                    document.getElementById("label_warnings").classList.add("d-none");
                    location.href = "index.php?c=users&a=index";
                }, 3000)
                break;

            default:
                // Restaurar en cualquier otro caso no contemplado para no bloquear la UI
                form_btn.disabled = false;
                form_btn.innerHTML = originalText;
                console.log(result);
                break;
        }
    })
}


