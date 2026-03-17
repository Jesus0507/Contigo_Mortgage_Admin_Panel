function edit(btn) {
    // Buscamos la fila y las celdas
    const row = btn.closest('tr');
    const cells = row.getElementsByTagName('td');

    // Celda 0: Nombre, Celda 1: Apellido
    const nameCell = cells[0];
    const lastNameCell = cells[1];

    // El teléfono lo sacamos del data-phone que pusimos en el botón
    const phone = btn.getAttribute('data-phone');

    if (btn.classList.contains("edit-client")) {
        // --- TRANSICIÓN A MODO EDICIÓN ---
        btn.innerHTML = "<i class='fas fa-check'></i>";
        btn.classList.remove("edit-client");
        btn.classList.add("btn-success"); // Cambia a verde para indicar "guardar"

        // Obtenemos el texto actual
        const currentName = nameCell.innerText.trim();
        const currentLastName = lastNameCell.innerText.trim();

        // Inyectamos los inputs directamente al innerHTML
        nameCell.innerHTML = `<input type="text" class="form-control form-control-sm" value="${currentName}">`;
        lastNameCell.innerHTML = `<input type="text" class="form-control form-control-sm" value="${currentLastName}">`;

        // Forzamos el foco en el primer input recién creado
        nameCell.querySelector('input').focus();

    } else {
        // --- MODO GUARDAR ---
        const inputName = nameCell.querySelector('input').value;
        const inputLastName = lastNameCell.querySelector('input').value;

        if (inputName === "" || inputLastName === "") {
            Swal.fire('Atención', 'Nombre y Apellido son obligatorios', 'warning');
            return;
        }

        $.ajax({
            type: "POST",
            url: "index.php?c=clients&a=update",
            data: {
                "name": inputName,
                "last_name": inputLastName,
                "phone": phone
            }
        }).done(function (result) {
            // Si la respuesta es exitosa (asumiendo que devuelve 1 o true)
            // Volvemos a mostrar solo el texto plano
            nameCell.innerHTML = inputName.charAt(0).toUpperCase() + inputName.slice(1).toLowerCase();
            lastNameCell.innerHTML = inputLastName.charAt(0).toUpperCase() + inputLastName.slice(1).toLowerCase();

            // Restauramos el botón a su estado original
            btn.innerHTML = "<i class='fas fa-pencil-alt'></i>";
            btn.classList.remove("btn-success");
            btn.classList.add("edit-client");

            console.log("Cliente actualizado correctamente");
        });
    }
}

function delete_client(btn) {
    // 1. Obtenemos la fila más cercana
    const row = btn.closest('tr');

    // 2. Obtenemos todas las celdas (td) de esa fila
    const cells = row.getElementsByTagName('td');

    // 3. Extraemos los textos por posición de columna
    // Celda 0 es Nombre, Celda 1 es Apellido
    const firstName = cells[0].innerText.trim();
    const lastName = cells[1].innerText.trim();

    // 4. Obtenemos el teléfono desde el atributo data-phone
    const phone = btn.getAttribute('data-phone');

    Swal.fire({
        title: '¿Está seguro de eliminar este registro?',
        text: `Estás por eliminar al cliente ${firstName} ${lastName}. Si lo borras, se perderá la información de sus gestiones.`,
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
                url: "index.php?c=clients&a=delete",
                data: { "phone": phone }
            }).done(function (result) {
                // Verificamos que la respuesta sea exitosa
                if (result == 1 || result == true) {
                    Swal.fire('Eliminado', `El cliente ${firstName} ${lastName} ha sido eliminado.`, 'success');
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                } else {
                    Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
                }
            });
        }
    });
}