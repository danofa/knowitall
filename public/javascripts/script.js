
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-hover="tooltip"]').tooltip();

    if (window.location.hash) {
        $(window.location.hash).collapse('show');
    }

});

var articlePreviewWindow = null;
function pApup() {
    
    if (articlePreviewWindow && articlePreviewWindow.closed) {
        articlePreviewWindow = null;
    }

    if (articlePreviewWindow == null) {
        articlePreviewWindow = window.open("/admin/article/preview", "preview", "height=600,width=900");
        articlePreviewWindow.onload = function () {
            articlePreviewWindow.document.getElementById('contentdiv').innerHTML = marked(document.getElementById('articleBody').value);
        };

    } else {
        articlePreviewWindow.document.getElementById('contentdiv').innerHTML = marked(document.getElementById('articleBody').value);
        articlePreviewWindow.focus();
    }
}

function hideTreeItem(item){
	item.className += "hidden";
}

function showTreeItem(item){
	item.style.display = 'block';
}