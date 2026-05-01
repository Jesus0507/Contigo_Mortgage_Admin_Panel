var user_email = document.getElementById("inputEmail");
var first_pet = document.getElementById("petAnswer");
var favorite_color = document.getElementById("colorAnswer");
var favorite_character = document.getElementById("charAnswer");
var custom_question = document.getElementById("customAnswer");
var new_psw = document.getElementById("newPassword");
var confirm_psw = document.getElementById("confirmPassword");
var btn_confirm = document.getElementById("recoveryBtn");

btn_confirm.onclick = function(e) {
    e.preventDefault(); // Evita que el formulario se recargue

    // 1. Validar que ningún campo esté vacío
    if (user_email.value == "" || first_pet.value == "" || favorite_color.value == "" || 
        favorite_character.value == "" || custom_question.value == "" || 
        new_psw.value == "" || confirm_psw.value == "") {
        
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, rellena todos los campos para continuar.'
        });
        return;
    }

    // 2. Validar que las contraseñas coincidan
    if (new_psw.value !== confirm_psw.value) {
        Swal.fire({
            icon: 'error',
            title: 'Error en contraseña',
            text: 'Las contraseñas no coinciden. Inténtalo de nuevo.'
        });
        return;
    }

    // 3. Preparar los datos para el envío
    var datos = {
        email: user_email.value.tolowerCase(),
        pet: first_pet.value.tolowerCase(),
        color: favorite_color.value.tolowerCase(),
        character: favorite_character.value.tolowerCase(),
        custom: custom_question.value.tolowerCase(),
        password: new_psw.value.tolowerCase()
    };

    // 4. Ejecutar AJAX
    $.ajax({
        url: "index.php?c=users&a=recovery_password", // Ajusta 'a' según el nombre de tu función en el controlador
        type: "POST",
        data: datos,
        beforeSend: function() {
            btn_confirm.innerText = "Procesando...";
            btn_confirm.classList.add("disabled");
        },
        success: function(response) {
            console.log(response);
            // Asumiendo que tu controlador devuelve un JSON o un string "1"
            if (response == 1 || response.trim() == "success") {
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Tu contraseña ha sido actualizada correctamente.',
                    confirmButtonText: 'Ir al Login'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = "index.php?c=login";
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de verificación',
                    text: 'Los datos de seguridad no coinciden con nuestros registros.'
                });
                btn_confirm.innerText = "Actualizar contraseña";
                btn_confirm.classList.remove("disabled");
            }
        },
        error: function() {
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor. Inténtalo más tarde.'
            });
            btn_confirm.innerText = "Actualizar contraseña";
            btn_confirm.classList.remove("disabled");
        }
    });
};