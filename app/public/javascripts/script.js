
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-hover="tooltip"]').tooltip();

    if (window.location.hash) {
        $(window.location.hash).collapse('show');
    }

});

function toggleTreeItem(item){
    if($(item.parentNode).hasClass("hideme")){
        
        $(item.parentNode).removeClass("hideme");
    } else {
    $(item.parentNode).addClass("hideme");    
    }
}