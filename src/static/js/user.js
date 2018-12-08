$(document).ready(function () {
    counter = 0;
    initial_reload();
});
var formData = {},
    user_id;
function initial_reload() {
    counter++;
    var access_token = $('#access_token').val();
    console.log(access_token)
    if (access_token == undefined || access_token == null || access_token == '') {
        initPage();
        return;
    }
    else {
        set_access_token(access_token);
        window.location = BASE_URL + 'admin/users';
    }
}


function initPage() {
    $('#saveChanges').off("click");
    $('#saveChanges').on("click",function (e) {
        EditUserDetails(e);
    });

    function EditUserDetails(e) {
        e.preventDefault();
        //Get the current form data
        loadFormData(e);
        var ajax_data = {
            'url': BASE_URL + 'admin/user_edit/',
            'data': formData,
            'request_type': 'POST',
            'extra_fields': {
                dataType: 'json'
            }
        };
        call_ajax(ajax_data, function (err, response) {
            //$.unblockUI();
            if (!err) {
                alert("successfully saved");
                $('#view-user').modal('hide');
                location.reload(true);
            } else {
                response = $.parseJSON(response['responseText']);
                if (typeof(response['detail']) !== 'undefined') {
                    alert(response['detail']);
                } else if (typeof(response['email']) !== 'undefined') {
                    alert(response['email']);
                } else {
                    alert('Some error occurred.');
                }
            }
        });
    }
}

function loadFormData() {
    formData = {};
    formData.name = $("#name").val();
    formData.about = $("#about").val();
    formData.email = $("#email").val();
    formData.user_id = user_id;
    formData.social_links = JSON.stringify({
        "facebook_link": $("#facebook_url").val(),
        "google_link": $("#google_url").val(),
        "linkedin_link": $("#linkedin_url").val(),
        "twitter_link": $("#twitter_url").val()
    });
    formData.website = $("#website").val();
    formData.title = $("#title").val();
    if ($("#image_url").attr('src') == "") {
        formData.image_url = "";
    }
}

$(".viewUser").click(function (e) {
    user_id = $(this).data("content");
    GetUserDetails(user_id);
    $('#view-user').modal('show');
});

function GetUserDetails(id) {
    var ajax_data = {
        'url': BASE_URL + 'admin/user_details/',
        'data': {"user_id": id},
        'request_type': 'GET',
        'extra_fields': {
            dataType: 'json'
        }
    };
    call_ajax(ajax_data, function (err, response) {
        //$.unblockUI();
        if (!err) {
            // populate pop up fields
            $("#name").val(response['name']);
            $("#about").val(response['about']);
            $("#email").val(response['email']);
            $("#title").val(response['title']);
            $("#website").val(response['website']);
            $("#image_url").attr("src", response['image_url']);
            $("#removeUserImage").show();
            social_links = response['social_links'];
            if (social_links != null) {
                $("#facebook_url").val(social_links['facebook_link']);
                $("#linkedin_url").val(social_links['linkedin_link']);
                $("#google_url").val(social_links['google_link']);
                $("#twitter_url").val(social_links['twitter_link']);
            }
            else {
                $("#facebook_url").val("");
                $("#linkedin_url").val("");
                $("#google_url").val("");
                $("#twitter_url").val("");
            }
        } else {
            response = $.parseJSON(response['responseText']);
            if (typeof(response['detail']) !== 'undefined') {
                alert(response['detail']);
            } else {
                alert('Some error occurred.');
            }
        }
    });
}
var user_id = 0;
$(".deleteUser").click(function (e) {
    user_id = $(this).data("content");
    $('#delete-user').modal('show');
});

$(".deleteUserYes").click(function (e) {
    DeleteUser(user_id);
});

$(".activateUser").click(function (e) {
    user_id = $(this).data("content");
    ActivateUser(user_id);
});

$(".survey_form").change(function (e) {
    user_id = $(this).data("content");
    is_survey_form_enabled = $(this).is(":checked");
    ActivateSurvey(user_id,is_survey_form_enabled);
});

function ActivateSurvey(id,is_survey_form_enabled) {
    var ajax_data = {
        'url': BASE_URL + 'admin/api/user-survey/',
        'data': {"user_id": id,"is_survey_form_enabled":is_survey_form_enabled},
        'request_type': 'PUT',
        'extra_fields': {
            dataType: 'json'
        }
    };
    call_ajax(ajax_data, function (err, response) {
        //$.unblockUI();
        if (!err) {
        } else {
            response = $.parseJSON(response['responseText']);
            if (typeof(response['detail']) !== 'undefined') {
                alert(response['detail']);
            } else {
                alert('Some error occurred.');
            }
        }
    });
}
function DeleteUser(id) {
    var ajax_data = {
        'url': BASE_URL + 'admin/api/delete-user/',
        'data': {"user_id": id},
        'request_type': 'DELETE',
        'extra_fields': {
            dataType: 'json'
        }
    };
    call_ajax(ajax_data, function (err, response) {
        //$.unblockUI();
        if (!err) {
            // populate pop up fields
            alert("User deactivated.");
            $('#delete-user').modal('hide');
            location.reload(true);
        } else {
            response = $.parseJSON(response['responseText']);
            if (typeof(response['detail']) !== 'undefined') {
                alert(response['detail']);
            } else {
                alert('Some error occurred.');
            }
        }
    });
}

$("#removeUserImage").click(function (e) {
    $("#image_url").attr("src", "");
    $("#removeUserImage").hide();
});

function ActivateUser(id) {
    var ajax_data = {
        'url': BASE_URL + 'admin/api/active-user/',
        'data': {"user_id": id},
        'request_type': 'PUT',
        'extra_fields': {
            dataType: 'json'
        }
    };
    call_ajax(ajax_data, function (err, response) {
        //$.unblockUI();
        if (!err) {
            alert("User Activated.");
            location.reload(true);
        } else {
            response = $.parseJSON(response['responseText']);
            if (typeof(response['detail']) !== 'undefined') {
                alert(response['detail']);
            } else {
                alert('Some error occurred.');
            }
        }
    });
}
