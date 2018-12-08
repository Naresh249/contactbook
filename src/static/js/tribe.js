$(document).ready(function () {
    initPage();
});
var check_type;
check_type=0;
var formData = {},
    tribe_id;
var tribe_type;
var sub_product = {};
    function click1(){
   if(tribe_type==4||tribe_type==5)
    $("#manufacturer").show();
}
function click2() {
        $('#manufacturer').hide();

}
function click3() {
       if( $('#products').is(":visible")==true) {
           $('#products').hide();
           $('#manufacturer').hide();
       }
       else{
           $('#products').show();
       }
}
function initPage() {

    $('#saveTribe').off("click");
    $('#saveTribe').on("click",function (e) {
        EditTribeDetails(e);
    });

    function EditTribeDetails(e) {
        e.preventDefault();
        //Get the current form data
        loadFormData(e);
        console.log(formData);
        var ajax_data = {
            'url': BASE_URL + 'admin/tribe_edit/',
            'data': formData,
            'request_type': 'POST',
            contentType: 'application/json',
            'extra_fields': {
                dataType: 'json'
            }
        };
        call_ajax(ajax_data, function (err, response) {
            //$.unblockUI();
            if (!err) {
                alert("successfully saved");
                $('#view-tribe').modal('hide');
               location.reload(true);
            } else {
                if (typeof(response['detail']) !== 'undefined') {
                    alert(response['detail']);
                } else {

                          if(response['promise']!=null)
                          {
                    alert("Phone number is not valid");
                    }
                    else
                    {
                    alert('Some error occurred.');
                }
                }

            }
        });
    }
}

function loadFormData(){
    var flag = false;
    var product = null;
    var manufacturer_id=0;
    manufacturer_id = $('select[name=manufact]').val()
    var radioValue = $("input[name='product']:checked").val();
    if(radioValue=="mobile")
        product = 2;
    else if(radioValue=="business")
        product =1;
    if($("#tribe_type").val() == 1&&document.getElementById("tribe_is_fin").checked==true)
        flag = true;
    formData = {};
    sub_product={};
    formData.about = $("#tribe_about").val();
    formData.tribe_id = tribe_id;
    formData.social_links = JSON.stringify({
        "facebook_link": $("#tribe_facebook_url").val(),
        "google_link": $("#tribe_google_url").val(),
        "linkedin_link": $("#tribe_linkedin_url").val(),
        "is_financial_institution": flag,
        "twitter_link": $("#tribe_twitter_url").val()
    });

    formData.website = $("#tribe_website").val();
    if($("#tribe_type").val() == 2) {
        formData.elevator_pitch = JSON.stringify({
            "text": $("#elevator_pitch").val(),
            "ppt": $("#elevator_pitch_ppt").val()
        });
    }
    if($("#logo_url").attr('src') == "") {
        formData.logo_url = "";
    }
    formData.retailer_code = $('#retailer_code').val();
    formData.owner_id = $("#owner_id").val();
    formData.owner_name = $("#owner_name").val();
    formData.owner_address = $("#owner_address").val();
    if($("#owner_phone_number").val()!="")
    {
    formData.owner_phone_number = $("#owner_phone_number").val();
    }
    formData.manufacturer_id = manufacturer_id;
    //sub_product.tribe_id = tribe_id;
    formData.sub_product = product;
    //tribeData.tribe = formData;
//    tribeData.mapping = sub_product;
}

$(".viewTribe").click(function(e) {
    tribe_id=$(this).data("content");
    GetTribeDetails(tribe_id);
    $('#view-tribe').modal('show');
});

function GetTribeDetails(id) {
    var ajax_data = {
            'url': BASE_URL + 'admin/tribe_detail/',
            'data': {"tribe_id":id},
            'request_type': 'GET',
            'extra_fields': {
                dataType: 'json'
            }
        };
        call_ajax(ajax_data, function (err, response) {
            //$.unblockUI();
            if (!err)
            {
                response=response['response'];
                // populate pop up fields

                $("#tribe_name").val(response['name']);
                $("#tribe_about").val(response['about']);
                $("#tribe_website").val(response['website']);
                $("#logo_url").attr("src", response['logo_url']);
                $("#removeImage").show();
                if(response['elevator_pitch'] != null) {
                    $("#elevator_pitch").val(response['elevator_pitch']['text']);
                    $("#elevator_pitch_ppt").val(response['elevator_pitch']['ppt']);
                }
                tribe_type = response['tribe_type'];
                $("#tribe_type").val(tribe_type);
                if(tribe_type != 2){
                    $("#elevator_pitch_tr").hide();
                }else{
                    $("#elevator_pitch_tr").show();
                }
                 $("#owner_id").val(response['tribe_owners'][0]['user']['id']);
                 $("#owner_name").val(response['tribe_owners'][0]['user']['name']);
                $("#owner_address").val(response['tribe_owners'][0]['user']['address']);
                $("#owner_phone_number").val(response['tribe_owners'][0]['user']['phone_number']);
                social_links = response['social_links'];

                $("#is_fin").html("");
                $("#products").hide();
                $("#manufacturer").hide();
                $("#retailer").hide();
                tribe_type = response['tribe_type']
                if(response['tribe_type']== 1)
                {

                    var flag = "";
                    if(response['social_links']!=null&&
                       response['social_links']['is_financial_institution'] ==true) {
                        flag = "checked";

                    }
                    var data = "";
                    data = data + "<td class=\"popup-label\">Is NBFC</td><td class=\"popup-value\"><" +
                        "input type=\"checkbox\" onclick='click3()' id=\"tribe_is_fin\" name=\"name\""+flag+"></td>";

                    $("#is_fin").html(data);
                }
                if((response['tribe_type']==1&&response['social_links']!=null&&
                       response['social_links']['is_financial_institution'] ==true)||
                response['tribe_type']==4||response['tribe_type']==5)
                {


                    $("#retailer_code").val(response['retailer_code']);

                    var drop_down="";
                    for(i=0;i<response['enterprises'].length;i++) {
                        drop_down = drop_down + "<option value="+response["enterprises"][i]['tribe']+">"+response['enterprises'][i]['tribe__name']
                            +"</option>"
                    }
                    $("#man_drop").html(drop_down);
                    if(response['sub_products'].length!=0)
                    {

                        if(response['sub_products'][0]['credit_sub_product']['id']!=null&&
                        response['sub_products'][0]['credit_sub_product']['id']==2)
                        $('#Mobile').prop("checked", true).trigger("click");
                    else
                         $('#Business').prop("checked", true).trigger("click");
                    }
                    $("#products").show();
                    $('#retailer').show();
                }
                if(social_links!=null){
                $("#tribe_facebook_url").val(social_links['facebook_link']);
                $("#tribe_linkedin_url").val(social_links['linkedin_link']);
                $("#tribe_google_url").val(social_links['google_link']);
                $("#tribe_twitter_url").val(social_links['twitter_link']);}
                else{
                    $("#tribe_facebook_url").val("");
                    $("#tribe_linkedin_url").val("");
                    $("#tribe_google_url").val("");
                    $("#tribe_twitter_url").val("");
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
$(".viewOfflineTribe").click(function(e) {

    tribe_id=$(this).data("content");
    GetOfflineTribeDetails(tribe_id);
    $('#view-offline-tribe').modal('show');
});

function GetOfflineTribeDetails(id) {
    var ajax_data = {
            'url': BASE_URL + 'admin/offline_tribe_details/',
            'data': {"tribe_id":id},
            'request_type': 'GET',
            'extra_fields': {
                dataType: 'json'
            }
        };
        call_ajax(ajax_data, function (err, response) {
            //$.unblockUI();
            if (!err) {
                // populate pop up fields
                response=response['response'];
                $("#offline_tribe_name").val(response['name']);
                $("#offline_tribe_about").val(response['about']);
                $("#offline_tribe_website").val(response['website']);
                $("#offline_logo_url").attr("src", response['logo_url']);
                $("#offline_removeImage").show();
                if(response['elevator_pitch'] != null) {
                    $("#offline_elevator_pitch").val(response['elevator_pitch']['text']);
                    $("#offline_elevator_pitch_ppt").val(response['elevator_pitch']['ppt']);
                }
                tribe_type = response['tribe_type'];
                $("#offline_tribe_type").val(tribe_type);
                if(tribe_type != 2){
                    $("#offline_elevator_pitch_tr").hide();
                }else{
                    $("#offline_elevator_pitch_tr").show();
                }
                social_links = response['social_links'];
                if(social_links!=null){
                $("#offline_tribe_facebook_url").val(social_links['facebook_link']);
                $("#offline_tribe_linkedin_url").val(social_links['linkedin_link']);
                $("#offline_tribe_google_url").val(social_links['google_link']);
                $("#offline_tribe_twitter_url").val(social_links['twitter_link']);}
                else{
                    $("#offline_tribe_facebook_url").val("");
                    $("#offline_tribe_linkedin_url").val("");
                    $("#offline_tribe_google_url").val("");
                    $("#offline_tribe_twitter_url").val("");
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


$("#removeImage").click(function(e) {
    $("#logo_url").attr("src", "");
    $("#removeImage").hide();
});
