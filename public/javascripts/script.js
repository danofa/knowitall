
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-hover="tooltip"]').tooltip();

    if (window.location.hash) {
        $(window.location.hash).collapse('show');
    }

});
