function doComment(articleId, body, resultid) {
    $.post("/admin/article/comment",
        {
            article: articleId,
            body: $(body).val()
        },
        function (result) {
            if (result.success) {
                $(resultid).html('Comment Added');
                var cl = '#commentslist' + articleId;
                $(cl).prepend('<li class="list-group-item comment-block"><span class="comment-header">' + 
                    result.comment.username + ' : just now' + '</span><p>'+result.comment.body+'</p></li>');

            } else {
                console.log('failed badly: ' + result.err);
            }
        });
}