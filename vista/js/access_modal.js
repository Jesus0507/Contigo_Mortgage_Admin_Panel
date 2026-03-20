var modal_btn_access = document.getElementById("access_modal_btn");
var close_btn_access = document.getElementById("close_access_modal_btn");
var btn_crear_access = document.getElementById("btn_crear_access");
var selected_users_access = Array.from(document.querySelectorAll(".check-user-access"));
var search_users_access = document.getElementById("search_modal_user_access");
var cant_checked_access = parseInt(document.getElementById("cant_users_span_access").innerHTML);
var users_boards_access = JSON.parse(document.getElementById("users_boards_info_access").innerHTML);
var board_name_access = document.getElementById("board_name_access");

function open_modal(id) {
    if (id == null) {
        $(".access-custom-modal").fadeIn();
        document.getElementById("layoutSidenav").classList.add("opacity-body");
    }
    else {
        $.ajax({
            type: "POST",
            url: "index.php?c=boards&a=get_board_info_modal",
            data: { "board_id": id }
        }).done(function (result) {
            var info = JSON.parse(result);
            board_name_access.value = info['board_info'][0]['name'];
            document.getElementById("cant_users_span_access").innerHTML = info['board_users'].length;
            document.getElementById("users_boards_info_access").innerHTML = JSON.stringify(info['board_users']);
            document.querySelector(".input-enabled-access").checked = info['board_info'][0]['enabled'] == 1? true : false;
            Array.from(document.querySelectorAll(".check-user-access")).forEach((el)=>{
                var user_id = el.id.split("_")[0];
                info['board_users'].includes(parseInt(user_id)) ? el.checked = true : el.checked = false;
            })


            $(".access-custom-modal").fadeIn();
            document.getElementById("layoutSidenav").classList.add("opacity-body");
            btn_crear_access.setAttribute("data-id", id);
        })
    }
}

close_btn_access.onclick = function () {
    var all_users = Array.from(document.querySelectorAll(".access-custom-modal .users-modal-item"));
    $(".access-custom-modal").fadeOut();
    var all_inputs = document.querySelector(".access-custom-modal").querySelectorAll("input");
    Array.from(all_inputs).forEach((input_content) => {
        input_content.value = "";
        input_content.style.border = "none";
    })

    selected_users_access.forEach((item) => {
        var realId = parseInt(item.id.replace('_access', ''));
        if (users_boards_access.includes(realId)) {
            item.checked = true;
        } else {
            item.checked = false;
        }
    })

    document.getElementById("cant_users_span_access").innerHTML = users_boards_access.length;
    cant_checked_access = users_boards_access.length;
    search_users_access.value = "";

    // Mantenemos tu lógica de board_name_title si existe
    if (document.getElementById("board_name_title")) {
        board_name_access.value = document.getElementById("board_name_title").innerHTML;
    }

    all_users.forEach((user_item) => user_item.classList.remove("d-none"));
    setTimeout(() => { document.getElementById("layoutSidenav").classList.remove("opacity-body"); }, 600)
}

search_users_access.onkeyup = function () {
    var all_users = Array.from(document.querySelectorAll(".access-custom-modal .users-modal-item"));
    if (search_users_access.value == "" || search_users_access.value == null) {
        all_users.forEach((user_item) => user_item.classList.remove("d-none"));
    } else {
        all_users.forEach((user_item) => {
            var fields = Array.from(user_item.querySelectorAll(".w-25"));
            if (!fields[0].innerHTML.toLowerCase().includes(search_users_access.value.toLowerCase()) && 
                !fields[1].innerHTML.toLowerCase().includes(search_users_access.value.toLowerCase()) && 
                !fields[2].innerHTML.toLowerCase().includes(search_users_access.value.toLowerCase())) {
                user_item.classList.add("d-none");
            } else {
                user_item.classList.remove("d-none");
            }
        })
    }
}

selected_users_access.forEach((item) => {
    item.onchange = function (ev) {
        ev.target.checked ? cant_checked_access++ : cant_checked_access--;
        document.getElementById("cant_users_span_access").innerHTML = cant_checked_access;
    }
})

btn_crear_access.onclick = function () {
    if (board_name_access.value == "" || board_name_access.value == null) {
        board_name_access.focus();
        board_name_access.style.border = "1px red solid";
    } else {
        board_name_access.style.border = "none";
        var selected = [];
        selected_users_access.forEach((s_user) => {
            if (s_user.checked) {
                selected.push(s_user.id.replace('_access', ''));
            }
        })

        $.ajax({
            type: "POST",
            url: "index.php?c=boards&a=update_board_access",
            data: {
                "board_id": btn_crear_access.getAttribute("data-id") || document.getElementById("board_id").innerHTML,
                "name": board_name_access.value,
                "users_selected": selected,
                "board_enabled" : document.querySelector(".input-enabled-access").checked
            }
        }).done(function (result) {
            Swal.fire({
                title: 'Éxito', text: 'Los cambios se guardaron correctamente', icon: 'success', timer: 3000, showConfirmButton: false
            });
            setTimeout(() => { location.reload(); }, 2500);
        })
    }
}