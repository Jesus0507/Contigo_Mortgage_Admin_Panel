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
            btn.innerHTML = "<i class='fas fa-pencil-alt'></i>";
            btn.classList.add("edit-client");
            $.ajax({
                type: "POST",
                url: "index.php?c=clients&a=update",
                data: {
                    "name": Array.from(allInputs)[0].value,
                    "last_name": Array.from(allInputs)[1].value,
                    "phone": phone
                }
            }).done(function (result) {
                console.log(result);
            })
        }
    }

}


function delete_client(btn) {
    var allInputs = Array.from(btn.parentElement.parentElement.parentElement.querySelectorAll("input"));
    var phone = Array.from(btn.parentElement.parentElement.parentElement.querySelectorAll("td"))[2].innerHTML;
    Swal.fire({
        title: '¿Está seguro de eliminar este registro?',
        text: 'Estás por eliminar al cliente '+allInputs[0].value+ ' '+ allInputs[1].value+ ' ,si lo borras, se perderá la información de las gestiones que tuvieran relación con dicho cliente.',
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
                data: {
                    "phone": phone,
                }
            }).done(function (result) {
                console.log(result);
                if (result) {
                    Swal.fire('Eliminado', 'El cliente ' +allInputs[0].value+ ' '+ allInputs[1].value+' ha sido eliminado exitosamente.', 'success');
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