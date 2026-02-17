function edit(btn) {
    var allInputs = btn.parentElement.parentElement.parentElement.querySelectorAll("input");
    var phone = Array.from(btn.parentElement.parentElement.parentElement.querySelectorAll("td"))[2].innerHTML;
    if (btn.classList.contains("edit-client")) {
        btn.innerHTML = "<i class='fas fa-check'></i>";
        btn.classList.remove("edit-client");
        var i = 0;
        Array.from(allInputs).forEach((inpt) => {
            inpt.classList.remove("input-table");
            inpt.readOnly = false;
            i == 0 ? inpt.focus() : '';
            i++;
        })
    }
    else {
        var isvalid = true;
        Array.from(allInputs).forEach((inpt) => {
            if (inpt.value == "" || inpt.value == null) {
                inpt.style.border = "solid 2px red";
                isvalid = false;
            }
            else {
                inpt.style.border = "none";
            }
            // inpt.classList.add("input-table");
            // inpt.readOnly = true;
        })

        if (isvalid) {
            $.ajax({
                type: "POST",
                url: "index.php?c=users&a=update",
                data: {
                    "name": Array.from(allInputs)[0].value,
                    "last_name": Array.from(allInputs)[1].value,
                    "email": Array.from(allInputs)[2].value,
                    "user_id": btn.classList[0]
                }
            }).done(function (result) {
                if (result != 1) {
                    console.log(result);
                    Swal.fire({
                        title: 'Error',
                        text: 'El correo electrónico que intentas usar ya se encuentra registrado',
                        icon: 'error',
                        timer: 3000,
                        showConfirmButton: false
                    });
                }
                else {
                    btn.innerHTML = "<i class='fas fa-pencil-alt'></i>";
                    btn.classList.add("edit-client");
                    Array.from(allInputs)[2].value = Array.from(allInputs)[2].value.toLowerCase();
                }
            })
        }
    }

}


function delete_client(btn) {
    var allInputs = Array.from(btn.parentElement.parentElement.parentElement.querySelectorAll("input"));
    var phone = Array.from(btn.parentElement.parentElement.parentElement.querySelectorAll("td"))[2].innerHTML;
    Swal.fire({
        title: '¿Está seguro de eliminar este registro?',
        text: 'Estás por eliminar al usuario ' + allInputs[0].value + ' ' + allInputs[1].value + ' ,si lo borras, se perderá la información de las pizarras y gestiones que tuvieran relación con dicho usuario.',
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
                    "user_id": btn.classList[0],
                }
            }).done(function (result) {
                console.log(result);
                if (result) {
                    Swal.fire('Eliminado', 'El usuario ' + allInputs[0].value + ' ' + allInputs[1].value + ' ha sido eliminado exitosamente.', 'success');
                    setTimeout(() => {
                        location.reload();
                    }, 1000)
                }
                else {
                    console.log(result);
                }
            });
        }
    });
}