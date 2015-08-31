
var articleCommentWindow = null;
function doComment() {
    
    if (articleCommentWindow && articleCommentWindow.closed) {
        articleCommentWindow = null;
    }

    if (articleCommentWindow == null) {
        articleCommentWindow = window.open("/admin/article/comment", "comment", "height=600,width=900,scrollbars=yes");

    } else {
        articleCommentWindow.document.getElementById('contentdiv').innerHTML = marked(document.getElementById('articleBody').value);
        articleCommentWindow.focus();
    }
}
