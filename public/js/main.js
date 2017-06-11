$(document).ready(function(){
    $('.delete-article').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type : 'DELETE',
            url: '/articles/' + id,
            success: function(response){
                alert('Deleting article');
                
            },
            error: function(err){
                console.log(err);
            }
        });
        window.location.href= '/';
    });
});