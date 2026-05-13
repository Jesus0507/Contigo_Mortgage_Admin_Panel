function edit(btn) {
    // Buscamos la fila (tr) más cercana al botón
    const row = btn.closest('tr');

    // Identificamos las celdas por su índice (Nombre: 0, Apellido: 1, Correo: 2)
    const cells = row.getElementsByTagName('td');
    const nameCell = cells[0];
    const lastNameCell = cells[1];
    const emailCell = cells[2];
    const user_type = cells[3];

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
        const currentTypeUser = user_type.innerText.trim() == "agente" ? "selected" : "";
        const currentTypeConsultor = user_type.innerText.trim() == "consultor" ? "selected" : "";

        nameCell.innerHTML = `<input type="text" class="form-control form-control-sm" value="${currentName}">`;
        lastNameCell.innerHTML = `<input type="text" class="form-control form-control-sm" value="${currentLastName}">`;
        emailCell.innerHTML = `<input type="email" class="form-control form-control-sm" value="${currentEmail}">`;
        user_type.innerHTML =  `<select class="form-select form-select-sm"><option value="user" ${currentTypeUser}>Agente</option><option value="consultor" ${currentTypeConsultor}>Consultor</option> </select>`;

        // Ponemos el foco en el primer input
        nameCell.querySelector('input').focus();

    } else {
        // --- MODO GUARDAR ---
        const inputName = nameCell.querySelector('input').value;
        const inputLastName = lastNameCell.querySelector('input').value;
        const inputEmail = emailCell.querySelector('input').value;
         const selectType = user_type.querySelector('select').value;

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
                "role": selectType,
                "user_id": userId
            }
        }).done(function (result) {
            if (result == 1) {
                // Si la actualización es exitosa, volvemos a texto plano
                nameCell.innerHTML = inputName.charAt(0).toUpperCase() + inputName.slice(1).toLowerCase();
                lastNameCell.innerHTML = inputLastName.charAt(0).toUpperCase() + inputLastName.slice(1).toLowerCase();
                emailCell.innerHTML = inputEmail.toLowerCase();
                user_type.innerHTML = selectType.toLowerCase() == "user" ? "agente" : "consultor";

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
    const userId = btn.getAttribute('data-id');

    // 1. Obtener agentes disponibles
    const response = await fetch(`index.php?c=users&a=get_available_agents&exclude_id=${userId}`);
    const agentes = await response.json();

    if (agentes.length === 0) {
        Swal.fire('Atención', 'No hay otros agentes activos.', 'warning');
        return;
    }

    // 2. Construir el HTML con el Buscador y la Lista
    let listHtml = `
        <p class="small text-muted">Selecciona los agentes receptores para redistribución equitativa:</p>
        
        <input type="text" id="searchAgentModal" class="form-control mb-3" 
               placeholder="🔍 Buscar por nombre o correo..." 
               oninput="filterAgentsInModal()">

        <div id="agentes-container" style="max-height: 200px; overflow-y: auto; text-align: left; border: 1px solid #eee; padding: 10px; border-radius: 5px;">
    `;

    agentes.forEach(a => {
        console.log(a);
        // Guardamos nombre y correo en un atributo data para facilitar la búsqueda
        const searchTerms = `${a.name} ${a.last_name} ${a.email}`.toLowerCase();
        listHtml += `
            <div class="form-check mb-2 agent-item" data-search="${searchTerms}">
                <input class="form-check-input agent-checkbox" type="checkbox" value="${a.user_id}" id="agent_${a.user_id}">
                <label class="form-check-label" for="agent_${a.user_id}">
                    <strong>${a.name} ${a.last_name}</strong><br>
                    <span class="text-muted small">${a.email}</span>
                </label>
            </div>
        `;
    });
    listHtml += `</div>`;

    // 3. Lanzar SweetAlert
    Swal.fire({
        title: `Redistribuir clientes de ${firstName}`,
        html: listHtml,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmar y Repartir',
        preConfirm: () => {
            const selected = Array.from(document.querySelectorAll('.agent-checkbox:checked')).map(cb => cb.value);
            if (selected.length === 0) {
                Swal.showValidationMessage('Debes seleccionar al menos un agente');
                return false;
            }
            return selected;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "POST",
                url: "index.php?c=users&a=delete",
                data: { "user_id": userId, "new_agents_ids": result.value }
            }).done(res => {
                if (res == 1 || res == true) {
                    Swal.fire('Éxito', 'Clientes repartidos correctamente.', 'success');
                    setTimeout(() => location.reload(), 1000);
                } else {
                    Swal.fire('Error', res, 'error');
                }
            });
        }
    });
}

// 4. Función de filtrado (puedes ponerla global o dentro del script)
function filterAgentsInModal() {
    const searchText = document.getElementById('searchAgentModal').value.toLowerCase();
    const items = document.querySelectorAll('.agent-item');

    items.forEach(item => {
        const text = item.getAttribute('data-search');
        if (text.includes(searchText)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}