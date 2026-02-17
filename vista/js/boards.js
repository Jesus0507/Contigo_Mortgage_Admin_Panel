setTimeout(()=>{
    var all_boards = document.querySelectorAll(".hidden-id");
    for (var i = 0; i < all_boards.length; i++){
        all_boards[i].parentElement.parentElement.onclick=function(ev){
            var board_id = ev.target.parentElement.querySelector(".hidden-id");
            location.href="index.php?c=boards&a=detail&info="+board_id.innerHTML;
        }
    }
},1000);
