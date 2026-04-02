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


async function delete_client(btn) {
    const row = btn.closest('tr');
    const firstName = row.getElementsByTagName('td')[0].innerText.trim();
    const lastName = row.getElementsByTagName('td')[1].innerText.trim();
    const userId = btn.getAttribute('data-id') || btn.classList[0];

    // 1. Obtener lista de agentes disponibles
    const response = await fetch(`index.php?c=users&a=get_available_agents&exclude_id=${userId}`);
    const agentes = await response.json();

    if (agentes.length === 0) {
        Swal.fire('Atención', 'No hay otros agentes activos para reasignar los tickets. Crea otro usuario antes de eliminar este.', 'warning');
        return;
    }

    // 2. Crear las opciones para el datalist
    let optionsHtml = agentes.map(a => `<option data-id="${a.user_id}" value="${a.name} ${a.last_name}"></option>`).join('');

    // 3. Modal de confirmación y reasignación
    Swal.fire({
        title: `Eliminar a ${firstName}`,
        html: `
            <p class="small text-muted">Todos los tickets de ${firstName} se reasignarán al agente que selecciones:</p>
            <input list="agentes_list" id="new_agent_input" class="form-control" placeholder="Escribe el nombre del agente receptor...">
            <datalist id="agentes_list">${optionsHtml}</datalist>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmar y Eliminar',
        preConfirm: () => {
            const val = document.getElementById('new_agent_input').value;
            const option = document.querySelector(`#agentes_list option[value="${val}"]`);
            if (!option) {
                Swal.showValidationMessage('Debes seleccionar un agente válido de la lista');
                return false;
            }
            return option.getAttribute('data-id'); // Retornamos el ID del agente seleccionado
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const newAgentId = result.value;

            $.ajax({
                type: "POST",
                url: "index.php?c=users&a=delete",
                data: {
                    "user_id": userId,
                    "new_agent_id": newAgentId
                }
            }).done(function (res) {
                if (res == 1 || res == true) {
                    Swal.fire('Éxito', 'Usuario eliminado y tickets reasignados.', 'success');
                    setTimeout(() => location.reload(), 1000);
                } else {
                    Swal.fire('Error', res, 'error');
                }
            });
        }
    });
}