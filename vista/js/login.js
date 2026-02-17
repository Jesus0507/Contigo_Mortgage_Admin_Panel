var input_email = document.getElementById("inputEmail");
var input_psw = document.getElementById("inputPassword");
var email_label = document.getElementById("emailLabel");
var psw_label = document.getElementById("pswLabel");
var login_btn = document.getElementById("loginBtn");
setTimeout(()=>{input_email.focus()}, 1500);



login_btn.onclick = function () {
    validation();
}

$(document).keyup(function (event) {
    if (event.which === 13) {
        validation();
    }
});

function validation() {
    if (input_email.value == "" || input_email.value == null) {
        email_label.style.color = "red";
        email_label.style.fontWeight = "bold";
        input_email.focus()
    }
    else {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(input_email.value)) {
            email_label.style.color = "red";
            email_label.style.fontWeight = "bold";
            email_label.innerText = "Formato de correo no válido";
            input_email.focus()
        }
        else {
            email_label.style.color = "black";
            email_label.style.fontWeight = "400";
            email_label.innerText = "Correo electrónico";

            if (input_psw.value == "" || input_psw.value == null) {
                psw_label.style.color = "red";
                psw_label.style.fontWeight = "bold";
                input_psw.focus()
            }
            else {
                search_user()
            }
        }
    }
}

function search_user() {
    $.ajax({
        type: "POST",
        url: "index.php?c=main&a=index&init=1",
        data: {
            "usuario": input_email.value,
            "clave": input_psw.value
        }
    }).done(function (result) {
        console.log(result);
        if (result == 1) {
            location.href = "index.php?c=main&a=main_view";
        }
        else {
            email_label.style.color = "red";
            email_label.style.fontWeight = "bold";
            email_label.innerText = "Correo o contraseña incorrectos, intenta nuevamente";

            setTimeout(() => {
                email_label.style.color = "black";
                email_label.style.fontWeight = "400";
                email_label.innerText = "Correo electrónico";
            }, 5000)
        }
    })
}
