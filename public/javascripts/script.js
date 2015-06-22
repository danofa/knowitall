
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-hover="tooltip"]').tooltip();

    if (window.location.hash) {
        $(window.location.hash).collapse('show');
    }

});
var pop;
function pApup() {
    var pop = window.open("/admin/article/preview", "preview", "height=600,width=900");
    pop.onload = function () {
        pop.document.getElementById('contentdiv').innerHTML = marked(document.getElementById('articleBody').value);
    };
    pop.reload();
}