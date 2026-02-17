var modal_btn = document.getElementById("access_modal_btn");
var close_btn = document.getElementById("close_access_modal_btn");
var btn_crear = document.getElementById("btn_crear");
var selected_users = Array.from(document.querySelector(".users-list").querySelectorAll("input"));
var search_users = document.getElementById("search_modal_user");
var cant_checked = parseInt(document.getElementById("cant_users_span").innerHTML);
var users_boards = JSON.parse(document.getElementById("users_boards_info").innerHTML);

if(modal_btn){
modal_btn.onclick = function () {
    $(".access-custom-modal").fadeIn();
    document.getElementById("layoutSidenav").classList.add("opacity-body");
}
}


close_btn.onclick = function () {
    var all_users = Array.from(document.querySelectorAll(".users-modal-item"));
    $(".access-custom-modal").fadeOut();
    var all_inputs = document.querySelector(".access-custom-modal").querySelectorAll("input");
    Array.from(all_inputs).forEach((input_content) => {
        input_content.value = "";
        input_content.style.border = "none";
    })

    selected_users.forEach((item) => {
        if (users_boards.includes(parseInt(item.id))) {
            item.checked = true;
        }
        else {
            item.checked = false;
        }
    })

    document.getElementById("cant_users_span").innerHTML = users_boards.length;
    cant_checked = users_boards.length;
    search_users.value = "";
    board_name.value = document.getElementById("board_name_title").innerHTML;


    all_users.forEach((user_item) => user_item.classList.remove("d-none"));
    setTimeout(() => { document.getElementById("layoutSidenav").classList.remove("opacity-body"); }, 600)
}

search_users.onkeyup = function () {
    var all_users = Array.from(document.querySelectorAll(".users-modal-item"));
    if (search_users.value == "" || search_users.value == null) {
        all_users.forEach((user_item) => user_item.classList.remove("d-none"));
    }
    else {
        all_users.forEach((user_item) => {
            var fields = Array.from(user_item.querySelectorAll(".w-25"));
            if (!fields[0].innerHTML.toLowerCase().includes(search_users.value.toLowerCase()) && !fields[1].innerHTML.toLowerCase().includes(search_users.value.toLowerCase()) && !fields[2].innerHTML.toLowerCase().includes(search_users.value.toLowerCase())) {
                user_item.classList.add("d-none");
            }
            else {
                user_item.classList.remove("d-none");
            }
        })
    }
}

selected_users.forEach((item) => {
    item.onchange = function (ev) {
        ev.target.checked ? cant_checked++ : cant_checked--;
        document.getElementById("cant_users_span").innerHTML = cant_checked;

    }
})



btn_crear.onclick = function () {
    if (board_name.value == "" || board_name.value == null) {
        board_name.focus()
        board_name.style.border = "1px red solid";
    }
    else {
        board_name.style.border = "none";
        var is_user_selected = false;
        var selected = [];
        selected_users.forEach((s_user) => {
            if (s_user.checked) {
                is_user_selected = true;
                selected.push(s_user.id);
            }
        })
        // if (!is_user_selected) {
        //     Swal.fire({
        //         title: 'Error',
        //         text: 'Debe seleccionar al menos un usuario que tenga acceso a la pizarra',
        //         icon: 'error',
        //         timer: 3000,
        //         showConfirmButton: false
        //     });
        //     return;

        // }


        $.ajax({
            type: "POST",
            url: "index.php?c=boards&a=update_board_access",
            data: {
                "board_id": document.getElementById("board_id").innerHTML,
                "name": board_name.value,
                "users_selected": selected
            }
        }).done(function (result) {
                Swal.fire({
                    title: 'Éxito',
                    text: 'Los cambios se guardaron correctamente',
                    icon: 'success',
                    timer: 3000,
                    showConfirmButton: false
                });
                setTimeout(()=>{location.reload();}, 2500);
        })
    }
}