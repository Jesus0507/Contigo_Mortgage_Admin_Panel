document.addEventListener("DOMContentLoaded", function() {
    // Función para ver/ocultar contraseñas
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            if (input.type === "password") {
                input.type = "text";
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = "password";
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });

    // Envío del formulario
    const btnSave = document.getElementById("btn_save_perfil");
    if (btnSave) {
        btnSave.addEventListener("click", function() {
            const passNueva = document.getElementById("pass_nueva").value;
            const passConfirm = document.getElementById("pass_confirm").value;

            if (passNueva !== "" && passNueva !== passConfirm) {
                Swal.fire('Error', 'Las nuevas contraseñas no coinciden.', 'error');
                return;
            }

            const formData = new FormData(document.getElementById("formPerfil"));

            $.ajax({
                url: 'index.php?c=profile&a=update_security',
                type: 'POST',
                data: Object.fromEntries(formData),
                success: function(res) {
                    if (res == 1 || res == "success") {
                        Swal.fire('¡Éxito!', 'Perfil actualizado correctamente.', 'success')
                        .then(() => location.reload());
                    } else if (res == "error_password") {
                        Swal.fire('Error', 'La contraseña actual es incorrecta.', 'error');
                    } else if(res == "campos_seguridad_vacios"){
                        Swal.fire('Error', 'Llena los campos de seguridad (preguntas de seguridad).', 'error');
                    }
                    else if(res=="preguntas_seguridad"){
                        Swal.fire('Error', 'Alguna respuesta a las preguntas de seguridad fue incorrecta.', 'error');
                    }
                    else{
                         Swal.fire('Error', 'La respuesta a la pregunta personalizada es incorrecta.', 'error');
                    }
                }
            });
        });
    }
});