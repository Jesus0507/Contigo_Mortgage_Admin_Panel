document.addEventListener("DOMContentLoaded", function() {
    const modalElement = document.getElementById('modalSeguridad');
    if (!modalElement) return;

    const bsModal = new bootstrap.Modal(modalElement, { backdrop: 'static', keyboard: false });
    const btnGuardar = document.getElementById("btnGuardarSeguridad");
    const form = document.getElementById("formSeguridad");

    // 1. Mostrar modal automáticamente
    bsModal.show();

    // 2. Lógica para ver/ocultar contraseñas (Ojitos)
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === "password") {
                input.type = "text";
                icon?.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = "password";
                icon?.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });

    // 3. Validación de coincidencia de contraseñas en tiempo real
    const passNueva = document.getElementById("pass_nueva");
    const passConfirm = document.getElementById("pass_confirm");
    const errorMsg = document.getElementById("msg-error-pass");

    function validarPass() {
        if (passConfirm.value !== "" && passNueva.value !== passConfirm.value) {
            passConfirm.classList.add("is-invalid");
            errorMsg.classList.remove("d-none");
            return false;
        } else {
            passConfirm.classList.remove("is-invalid");
            passConfirm.classList.add("is-valid");
            errorMsg.classList.add("d-none");
            return true;
        }
    }

    passNueva.addEventListener("keyup", validarPass);
    passConfirm.addEventListener("keyup", validarPass);

    // 4. Guardar cambios con validación completa
    btnGuardar.addEventListener("click", function() {
        // Validar que el formulario esté lleno (HTML5 Validation)
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            Swal.fire('Atención', 'Por favor, completa todos los campos obligatorios.', 'warning');
            return;
        }

        // Validar coincidencia de contraseñas una última vez
        if (!validarPass()) {
            Swal.fire('Error', 'Las nuevas contraseñas no coinciden.', 'error');
            return;
        }

        const formData = new FormData(form);

        Swal.fire({
            title: '¿Confirmar cambios?',
            text: "Tu configuración de seguridad será actualizada.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Sí, guardar',
            confirmButtonColor: '#212529'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: 'index.php?c=users&a=update_security',
                    type: 'POST',
                    data: Object.fromEntries(formData),
                    success: function(res) {
                        if (res == 1 || res == "success") {
                            Swal.fire('¡Éxito!', 'Seguridad configurada.', 'success');
                            bsModal.hide();
                        } else {
                            Swal.fire('Error', 'La contraseña actual no es válida.', 'error');
                        }
                    }
                });
            }
        });
    });
});