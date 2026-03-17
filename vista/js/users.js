function edit(btn) {
    // Buscamos la fila (tr) más cercana al botón
    const row = btn.closest('tr');

    // Identificamos las celdas por su índice (Nombre: 0, Apellido: 1, Correo: 2)
    const cells = row.getElementsByTagName('td');
    const nameCell = cells[0];
    const lastNameCell = cells[1];
    const emailCell = cells[2];

    // Obtenemos el ID del usuario desde la clase o data-id
    const userId = btn.getAttribute('data-id') || btn.classList[0];

    if (btn.classList.contains("edit-client")) {
        // --- MODO EDICIÓN ---
        // Cambiamos el icono y el estado del botón
        btn.innerHTML = "<i class='fas fa-check'></i>";
        btn.classList.remove("edit-client");
        btn.classList.add("btn-success"); // Cambio visual para indicar "Guardar"

        // Guardamos el valor actual y reemplazamos por un input
        const currentName = nameCell.innerText.trim();
        const currentLastName = lastNameCell.innerText.trim();
        const currentEmail = emailCell.innerText.trim();

        nameCell.innerHTML = `<input type="text" class="form-control form-control-sm" value="${currentName}">`;
        lastNameCell.innerHTML = `<input type="text" class="form-control form-control-sm" value="${currentLastName}">`;
        emailCell.innerHTML = `<input type="email" class="form-control form-control-sm" value="${currentEmail}">`;

        // Ponemos el foco en el primer input
        nameCell.querySelector('input').focus();

    } else {
        // --- MODO GUARDAR ---
        const inputName = nameCell.querySelector('input').value;
        const inputLastName = lastNameCell.querySelector('input').value;
        const inputEmail = emailCell.querySelector('input').value;

        if (inputName === "" || inputLastName === "" || inputEmail === "") {
            Swal.fire('Campos vacíos', 'Por favor completa todos los campos', 'warning');
            return;
        }

        $.ajax({
            type: "POST",
            url: "index.php?c=users&a=update",
            data: {
                "name": inputName,
                "last_name": inputLastName,
                "email": inputEmail,
                "user_id": userId
            }
        }).done(function (result) {
            if (result == 1) {
                // Si la actualización es exitosa, volvemos a texto plano
                nameCell.innerHTML = inputName.charAt(0).toUpperCase() + inputName.slice(1).toLowerCase();
                lastNameCell.innerHTML = inputLastName.charAt(0).toUpperCase() + inputLastName.slice(1).toLowerCase();
                emailCell.innerHTML = inputEmail.toLowerCase();

                btn.innerHTML = "<i class='fas fa-pencil-alt'></i>";
                btn.classList.add("edit-client");
                btn.classList.remove("btn-success");

                // Tip: Para que la búsqueda de la tabla se actualice con los nuevos datos
                // podrías llamar a la instancia de la tabla si necesitas que sea instantáneo.
            } else {
                Swal.fire('Error', 'No se pudo actualizar el usuario (posible correo duplicado)', 'error');
            }
        });
    }
}


function delete_client(btn) {
    // 1. Obtenemos la fila y las celdas de texto
    const row = btn.closest('tr');
    const cells = row.getElementsByTagName('td');

    // 2. Extraemos los valores del texto plano (ya no son inputs)
    const firstName = cells[0].innerText.trim();
    const lastName = cells[1].innerText.trim();

    // 3. Obtenemos el ID del usuario (recomendado usar data-id o la primera clase)
    const userId = btn.getAttribute('data-id') || btn.classList[0];

    Swal.fire({
        title: '¿Está seguro de eliminar este registro?',
        text: `Estás por eliminar al usuario ${firstName} ${lastName}. Si lo borras, se perderá la información de las pizarras y gestiones relacionadas.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "POST",
                url: "index.php?c=users&a=delete",
                data: {
                    "user_id": userId,
                }
            }).done(function (result) {
                if (result == 1 || result == true) {
                    Swal.fire(
                        'Eliminado',
                        `El usuario ${firstName} ${lastName} ha sido eliminado exitosamente.`,
                        'success'
                    );
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                } else {
                    console.error("Error en la respuesta del servidor:", result);
                    Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
                }
            });
        }
    });
}