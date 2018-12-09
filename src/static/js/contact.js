function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

$(".deleteUser").click(function (e) {
        var csrftoken = getCookie('csrftoken');
        contact_details_id = $(this).data("content");
        $.ajax({
            url: BASE_URL,
            contentType:"application/json",
            dataType:"json",
            data: {"contact_details_id": contact_details_id},
            headers: {'X-CSRFToken': csrftoken},
            type: 'DELETE',
            success: function(response) {
                alert(response);
            }
        });
    });

