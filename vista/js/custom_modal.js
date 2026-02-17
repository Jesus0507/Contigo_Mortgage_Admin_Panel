var modal_btn = document.getElementById("modal_btn");
var close_btn = document.getElementById("close_modal_btn");

modal_btn.onclick = function () {
    $(".custom-modal").fadeIn();
    document.getElementById("layoutSidenav").classList.add("opacity-body");
}


close_btn.onclick = function () {
    $(".custom-modal").fadeOut();
    var all_inputs = document.querySelector(".custom-modal").querySelectorAll("input");
    Array.from(all_inputs).forEach((input_content) => {
        input_content.value = "";
        input_content.style.border = "none";
    })
    setTimeout(() => { document.getElementById("layoutSidenav").classList.remove("opacity-body"); }, 600)
}