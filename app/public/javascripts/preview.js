
var articlePreviewWindow = null;
function pApup() {
    
    if (articlePreviewWindow && articlePreviewWindow.closed) {
        articlePreviewWindow = null;
    }

    if (articlePreviewWindow == null) {
        articlePreviewWindow = window.open("/admin/article/preview", "preview", "height=600,width=900,scrollbars=yes");
        articlePreviewWindow.onload = function () {
            articlePreviewWindow.document.getElementById('contentdiv').innerHTML = marked(document.getElementById('articleBody').value);
        };

    } else {
        articlePreviewWindow.document.getElementById('contentdiv').innerHTML = marked(document.getElementById('articleBody').value);
        articlePreviewWindow.focus();
    }
}
