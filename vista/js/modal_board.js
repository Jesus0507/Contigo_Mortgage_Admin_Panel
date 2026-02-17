var btn_crear = document.getElementById("btn_crear");
var board_name = document.getElementById("board_name");
var board_type = document.getElementById("board_type");
var selected_users = Array.from(document.querySelector(".users-list").querySelectorAll("input"));
var search_users = document.getElementById("search_modal_user");
var close_btn = document.getElementById("close_modal_btn");
var cant_checked = 0;


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
            url: "index.php?c=boards&a=add_board",
            data: {
                "name": board_name.value,
                "type": board_type.value,
                "users_selected": selected
            }
        }).done(function (result) {
            console.log(result);
            location.href = "index.php?c=boards&a=detail&info=" + result;
        })
    }
}

close_btn.onclick = function () {
    var all_users = Array.from(document.querySelectorAll(".users-modal-item"));
    $(".custom-modal").fadeOut();
    var all_inputs = document.querySelector(".custom-modal").querySelectorAll("input");
    Array.from(all_inputs).forEach((input_content) => {
        input_content.value = "";
        input_content.style.border = "none";
    })

    selected_users.forEach((item) => {
        item.checked = false;
    })

    document.getElementById("cant_users_span").innerHTML = 0;

    search_users.value = "";

    all_users.forEach((user_item) => user_item.classList.remove("d-none"));
    setTimeout(() => { document.getElementById("layoutSidenav").classList.remove("opacity-body"); }, 600)
}