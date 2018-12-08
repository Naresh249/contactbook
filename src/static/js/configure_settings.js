$(document).ready(function () {

$(".global_setting").change(function (e) {

    var setting_name = $(this).val();
    var is_setting_enabled = $(this).is(":checked");
    var formData = {
        'setting_name': setting_name,
        'is_setting_enabled': is_setting_enabled
    };
    var ajax_data = {
        'url': BASE_URL + 'api/global-settings/',
        'data': formData,
        'request_type': 'PUT'
    };
    call_ajax(ajax_data, function (err, response) {
        if (!err) {

        } else {
            if (typeof(response['responseText']) !== 'undefined') {
                error_payload = JSON.parse(response['responseText']);
                alert(error_payload['detail']);
            } else {
                alert('Some error occurred.');
            }
        }
    });
});

});
var sectors = {
    show_modal: function () {
        $('#custom-modal-header').html('<button type="button" class="close" data-dismiss="modal">×</button><h3>ADD NEW SECTOR</h3>');
        $('#custom-modal-body').html('<table class="modal-table add-sector-modal-table"><tr><td class="popup-label">Sector Name:</td><td class="popup-value"><input type="text" id="sector-name" name="sector-name" /></td></tr><tr><td class="popup-label">Sector Logo:</td><td class="popup-value"><input type="file" id="sector-image" name="sector-image" accept="image/*" ></td></tr><tr><td class="popup-label"></td><td class="popup-value"><div id="sector-image-preview"></div></td></tr></table>');
        $('#custom-modal-footer').html('<span style="color:red;al" id="error-sector-text"></span><a id="add-sector-button" class="btn btn-primary" onclick="sectors.add();">save</a>');

        $("#sector-image").change(function (e) {
            e.preventDefault();
            var files = e.originalEvent.srcElement.files;
            if (!files.length) {
                return;
            }
            var file = files[0];
            var img = document.createElement("img");
            var reader = new FileReader();
            reader.onloadend = function (fileLoadedEvent) {
                var image_blob = fileLoadedEvent.target.result;
                img.src = reader.result;
                $('#add-sector-button').unbind('click').on('click', function () {
                    sectors.add(image_blob);
                });
            };
            reader.readAsDataURL(file);
            $("#sector-image-preview").empty();
            $("#sector-image-preview").append(img);

        });
        $('#custom-modal').modal("show");
    },
    add: function (image_blob) {
        $('#error-sector-text').text("");
        var name = $('#sector-name').val();
        if (!name || !image_blob) {
            $('#error-sector-text').text("Please provide both name and image.");
            return;
        }
        var formData = {'name': name, 'image_url': image_blob}
        var ajax_data = {
            'url': BASE_URL + 'api/sectors/',
            'data': formData,
            'request_type': 'POST',
            'extra_fields': {
                dataType: 'json'
            }
        };
        call_ajax(ajax_data, function (err, response) {
            //$.unblockUI();
            if (!err) {
                $('#custom-modal').modal('hide');
                location.reload(true);
            } else {
                if (typeof(response['responseText']) !== 'undefined') {
                    error_payload = JSON.parse(response['responseText']);
                    alert(error_payload['detail']);
                } else {
                    alert('Some error occurred.');
                }
            }
        });
    }
};

var services = {
    show_modal: function () {
        $('#custom-modal-header').html('<button type="button" class="close" data-dismiss="modal">×</button><h3>ADD NEW SERVICE</h3>');
        $('#custom-modal-body').html('<table class="modal-table add-service-modal-table"><tr><td class="popup-label">Service Name:</td><td class="popup-value"><input type="text" id="service-name" name="service-name" /></td></tr><tr><td class="popup-label">Service Logo:</td><td class="popup-value"><input type="file" id="service-image" name="service-image" accept="image/*" ></td></tr><tr><td class="popup-label"></td><td class="popup-value"><div id="service-image-preview"></div></td></tr></table>');
        $('#custom-modal-footer').html('<span style="color:red" id="error-service-text"></span><a id="add-service-button" class="btn btn-primary" onclick = "services.add();">save</a>');
        $("#service-image").change(function (e) {
                e.preventDefault();
                var files = e.originalEvent.srcElement.files;
                if (!files.length) {
                    return;
                }
                var file = files[0]
                var img = document.createElement("img");
                var reader = new FileReader();
                reader.onloadend = function (fileLoadedEvent) {
                    var image_blob = fileLoadedEvent.target.result;
                    img.src = reader.result;
                    $('#add-service-button').unbind('click').on('click', function () {
                        services.add(image_blob);
                    });
                };
                reader.readAsDataURL(file);
                $("#service-image-preview").empty();
                $("#service-image-preview").append(img);
            }
        );
        $('#custom-modal').modal("show");
    },
    add: function (image_blob) {
        $('#error-service-text').text("");
        var name = $('#service-name').val();
        if (!name || !image_blob) {
            $('#error-service-text').text("Please provide both name and image.");
            return;
        }
        var formData = {'name': name, 'image_url': image_blob}
        var ajax_data = {
            'url': BASE_URL + 'api/services/',
            'data': formData,
            'request_type': 'POST',
            'extra_fields': {
                dataType: 'json'
            }
        };
        call_ajax(ajax_data, function (err, response) {
            //$.unblockUI();
            if (!err) {
                $('#custom-modal').modal('hide');
                location.reload(true);
            } else {
                if (typeof(response['responseText']) !== 'undefined') {
                    error_payload = JSON.parse(response['responseText']);
                    alert(error_payload['detail']);
                } else {
                    alert('Some error occurred.');
                }
            }
        });
    }
};
$(".add_banner_button").click(function (e) {
    $("#upload_banner").val('').clone(true);
    $("#banner-image-preview").empty();
    $('#add-banner').modal('show');
    $('#add-service-button').unbind('click')
});

$("#upload_banner").change(function (e) {
    e.preventDefault();
    var files = e.originalEvent.srcElement.files;
    if (!files.length) {
        return;
    }
    var file = files[0];
    var img = document.createElement("img");
    var reader = new FileReader();
    reader.onloadend = function (fileLoadedEvent) {
        var image_blob = fileLoadedEvent.target.result;
        img.src = reader.result;
        $('#add-banner-button').unbind('click').on('click', function () {
            add_banner(image_blob);
        });
    };
    reader.readAsDataURL(file);
    $("#banner-image-preview").empty();
    $("#banner-image-preview").append(img);

});

function add_banner(image_blob) {
    $('#error-banner-text').text("");
    if (!image_blob) {
        $('#error-banner-text').text("Please provide image.");
        return;
    }
    var formData = {'image_url': image_blob, 'type': 3};
    var ajax_data = {
        'url': BASE_URL + 'api/landing-page/',
        'data': formData,
        'request_type': 'POST',
        'extra_fields': {
            dataType: 'json'
        }
    };
    call_ajax(ajax_data, function (err, response) {
        //$.unblockUI();
        if (!err) {
            $('#add-banner').modal('hide');
            location.reload(true);
        } else {
            if (typeof(response['responseText']) !== 'undefined') {
                error_payload = JSON.parse(response['responseText']);
                alert(error_payload['detail']);
            } else {
                alert('Some error occurred.');
            }
        }
    });
}


function remove_banner(image_id) {
    var action = confirm("Are you sure you want to remove this banner?")
    if (!action) {
        return;
    }
    else {
        var ajax_data = {
            'url': BASE_URL + 'api/landing-page/',
            'data': {'image_id': image_id},
            'request_type': 'DELETE',
        }
    }
    call_ajax(ajax_data, function (err, response) {
        //$.unblockUI();
        if (!err) {
            $('#add-banner').modal('hide');
            location.reload(true);
        } else {
            if (typeof(response['responseText']) !== 'undefined') {
                error_payload = JSON.parse(response['responseText']);
                alert(error_payload['detail']);
            } else {
                alert('Some error occurred.');
            }
        }
    });
}


var feature_ent = {
    show_modal: function () {
        $('#custom-modal-header').html('<button type="button" class="close" data-dismiss="modal">×</button><h3>ADD NEW FEATURED ENTERPRISE</h3>');
        $('#custom-modal-body').html('<table class="modal-table add-feature-ent-modal-table"><tr><td class="popup-label">Select Enterprise:</td><td class="popup-value"><input type="search" id="feature-ent-search"/></td></tr><tr><input type="hidden" id="tribe_id"></tr></table><div id="tribe-image-preview"></div>');
        $('#custom-modal-footer').html('<span style="color:red;" id="error-feature-ent-text"></span><a id="add-feature-ent-button" class="btn btn-primary" onclick="feature_ent.add();">save</a>');

        //Autocomplete plugin for enterprise
        $('#feature-ent-search').on('input', function () {
            var searchText = $(this).val();
            if (!searchText.length) {
                return;
            }
            getSearchResults(searchText).done(function (response) {
                var companyNames = getCompanyNames(response, 1);
                $('#feature-ent-search').autocomplete({
                    source: companyNames,
                    minLength: 1,
                    closeOnSelect: true,
                    select: function (event, ui) {
                        var company = companyNameDataMap[ui.item.value];
                        $(this).val(ui.item.label);
                        $("#tribe_id").val(company.id);
                        $("#tribe-image-preview").html("<img style='display: block;margin-left: auto;margin-right: auto;' src='" + company.logo_url + "'></img>")
                    }
                });
            });
        });
        $('#custom-modal').modal("show");
    },
    add: function () {
        $('#error-feature-ent-text').text("");
        var id = $('#tribe_id').val();
        if (!id) {
            $('#error-feature-ent-text').text("Please select a tribe.");
            return;
        }
        var formData = {'type': 2, "tribe_id": id};
        var ajax_data = {
            'url': BASE_URL + 'api/landing-page/',
            'data': formData,
            'request_type': 'PUT',
            'extra_fields': {
                dataType: 'json'
            }
        };
        call_ajax(ajax_data, function (err, response) {
            //$.unblockUI();
            if (!err) {
                $('#custom-modal').modal('hide');
                location.reload(true);
            } else {
                if (typeof(response['responseText']) !== 'undefined') {
                    error_payload = JSON.parse(response['responseText']);
                    alert(error_payload['detail']);
                } else {
                    alert('Some error occurred.');
                }
            }
        });
    }
};


var feature_inv = {
    show_modal: function () {
        $('#custom-modal-header').html('<button type="button" class="close" data-dismiss="modal">×</button><h3>ADD NEW FEATURED INVESTOR</h3>');
        $('#custom-modal-body').html('<table class="modal-table add-feature-inv-modal-table"><tr><td class="popup-label">Select Investor:</td><td class="popup-value"><input type="search" id="feature-inv-search"/></td></tr><tr><input type="hidden" id="tribe_id"></tr></table><div id="tribe-image-preview"></div>');
        $('#custom-modal-footer').html('<span style="color:red;" id="error-feature-inv-text"></span><a id="add-feature-inv-button" class="btn btn-primary" onclick="feature_inv.add();">save</a>');

        //Autocomplete plugin for enterprise
        $('#feature-inv-search').on('input', function () {
            var searchText = $(this).val();
            if (!searchText.length) {
                return;
            }
            getSearchResults(searchText).done(function (response) {
                var companyNames = getCompanyNames(response, 2);
                $('#feature-inv-search').autocomplete({
                    source: companyNames,
                    minLength: 1,
                    closeOnSelect: true,
                    select: function (event, ui) {
                        var company = companyNameDataMap[ui.item.value];
                        $(this).val(ui.item.label);
                        $("#tribe_id").val(company.id);
                        $("#tribe-image-preview").html("<img style='display: block;margin-left: auto;margin-right: auto;' src='" + company.logo_url + "'></img>")
                    }
                });
            });
        });
        $('#custom-modal').modal("show");
    },
    add: function () {
        $('#error-feature-inv-text').text("");
        var id = $('#tribe_id').val();
        if (!id) {
            $('#error-feature-inv-text').text("Please select a tribe.");
            return;
        }
        var formData = {'type': 1, "tribe_id": id};
        var params = JSON.stringify(formData);
        var ajax_data = {
            'url': BASE_URL + 'api/landing-page/',
            'data': formData,
            'request_type': 'PUT',
            'extra_fields': {
                dataType: 'json'
            }
        };
        call_ajax(ajax_data, function (err, response) {
            //$.unblockUI();
            if (!err) {
                $('#custom-modal').modal('hide');
                location.reload(true);
            } else {
                if (typeof(response['responseText']) !== 'undefined') {
                    error_payload = JSON.parse(response['responseText']);
                    alert(error_payload['detail']);
                } else {
                    alert('Some error occurred.');
                }
            }
        });
    }
};

function remove_tribe(tribe_id) {
    var action = confirm("Are you sure you want to remove featured tribe?");
    if (!action) {
        return;
    }
    else {
        var ajax_data = {
            'url': BASE_URL + 'api/landing-page/',
            'data': {'tribe_id': tribe_id},
            'request_type': 'DELETE',
            'extra_fields': {
                dataType: 'json'
            }
        };
        call_ajax(ajax_data, function (err, response) {
            //$.unblockUI();
            if (!err) {
                $('#custom-modal').modal('hide');
                location.reload(true);
            } else {
                if (typeof(response['responseText']) !== 'undefined') {
                    error_payload = JSON.parse(response['responseText']);
                    alert(error_payload['detail']);
                } else {
                    alert('Some error occurred.');
                }
            }
        });
    }
}

function getSearchResults(searchText) {
    var data = {};
    data.search_name = searchText;
    data.is_text_search = true;
    data.search_payload = {};
    data.search_payload["role"] = 5;
    var params = JSON.stringify(data);
    var ajax_data = {
            'url': BASE_URL + 'api/search-profiles/users-tribes/',
            'data': params,
            'request_type': 'POST',
            'extra_fields': {
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                traditional: 'true'
            }
        },
        deferred = $.Deferred();

    call_ajax(ajax_data, function (err, data) {
        if (!err) {
            deferred.resolve(data.response);
        } else {
            deferred.resolve([]);
        }
    });

    return deferred.promise();
}

var companyNameDataMap = {};
function getCompanyNames(tribes, type) {
    var data;
    if (type == 1) {
        data = tribes.enterprise;
    } else {
        data = tribes.investor;
    }
    var companyNames = [];
    companyNameDataMap = {};
    for (var i = 0; i < data.length; i++) {
        companyNames.push(data[i].name);
        companyNameDataMap[data[i].name] = data[i];
    }
    return companyNames;
}

function getBothCompanyNames(tribes) {
    var companyNames = [];
    companyNameDataMap = {};
    for (var i = 0; i < tribes.enterprise.length; i++) {
        companyNames.push(tribes.enterprise[i].name);
        companyNameDataMap[tribes.enterprise[i].name] = tribes.enterprise[i];
    }
    for (var j = 0; j < tribes.investor.length; j++) {
        companyNames.push(tribes.investor[j].name);
        companyNameDataMap[tribes.investor[j].name] = tribes.investor[j];
    }
    return companyNames;
}


var feature_tribe = {
    show_modal: function () {
        $('#custom-modal-header').html('<button type="button" class="close" data-dismiss="modal">×</button><h3>EDIT FEATURE TRIBE</h3>');
        $('#custom-modal-body').html('<table class="modal-table edit-feature-tribe-modal-table"><tr><td class="popup-label">Select Tribe:</td><td class="popup-value"><input type="search" id="feature-tribe-search"/></td></tr><tr><td><input type="hidden" id="tribe_id"><input type="hidden" id="image_id"/></td></tr><tr id="tribe_title_tr" hidden><td class="popup-label">Title:</td><td class="popup-value"><input type="text" id="tribe_title"/></td></tr><tr id="tribe_banner_tr" hidden><td class="popup-label">Tribe Banner:</td><td class="popup-value"><input type="file" id="tribe-banner" name="tribe-banner" accept="image/*" ></td></tr></table><div id="tribe-image-preview"></div>');
        $('#custom-modal-footer').html('<span style="color:red;" id="error-feature-tribe-text"></span><a id="add-feature-tribe-button" class="btn btn-primary" onclick="feature_tribe.add();">save</a>');

        //Autocomplete plugin for enterprise
        $('#feature-tribe-search').on('input', function () {
            $("#tribe_title_tr").hide();
            $("#tribe_banner_tr").hide();
            var searchText = $(this).val();
            if (!searchText.length) {
                return;
            }
            getSearchResults(searchText).done(function (response) {
                var companyNames = getBothCompanyNames(response, 1);
                $('#feature-tribe-search').autocomplete({
                    source: companyNames,
                    minLength: 1,
                    closeOnSelect: true,
                    select: function (event, ui) {
                        var company = companyNameDataMap[ui.item.value];
                        $(this).val(ui.item.label);
                        $("#tribe_id").val(company.id);
                        $("#tribe_title_tr").show();
                        $("#tribe_banner_tr").show();
                        //$("#tribe-image-preview").append("<img style='display: block;margin-left: auto;margin-right: auto;' src='"+company.logo_url+"'></img>")
                    }
                });
            });
        });

        $("#tribe-banner").change(function (e) {
                e.preventDefault();
                var files = e.originalEvent.srcElement.files;
                if (!files.length) {
                    return;
                }
                var file = files[0];
                var img = document.createElement("img");
                img.style.width = '200px';
                img.style.height = '200px';
                var reader = new FileReader();
                reader.onloadend = function (fileLoadedEvent) {
                    var image_blob = fileLoadedEvent.target.result;
                    img.src = reader.result;
                    $('#add-feature-tribe-button').unbind('click').on('click', function () {
                        feature_tribe.add(image_blob);
                    });
                };
                reader.readAsDataURL(file);
                $("#tribe-image-preview").empty();
                $("#tribe-image-preview").append(img);
            }
        );
        $('#custom-modal').modal("show");
    },
    add: function (image_blob) {
        $('#error-feature-tribe-text').text("");
        var id = $('#tribe_id').val();
        var title = $('#tribe_title').val();
        var image_id = $('.feature_tribe_id').val();
        if (!id || !image_blob || !title) {
            $('#error-feature-tribe-text').text("Please provide all the information.");
            return;
        }
        var formData = {'type':4,'banner_tribe':id, 'image_url': image_blob, 'title': title, 'image_id':image_id};
        var params = JSON.stringify(formData);
        var ajax_data = {
            'url': BASE_URL + 'api/landing-page/',
            'data': formData,
            'request_type': 'PUT',
            'extra_fields': {
                dataType: 'json'
            }
        };
        call_ajax(ajax_data, function (err, response) {
            //$.unblockUI();
            if (!err) {
                $('#custom-modal').modal('hide');
                location.reload(true);
            } else {
                if (typeof(response['responseText']) !== 'undefined') {
                    error_payload = JSON.parse(response['responseText']);
                    alert(error_payload['detail']);
                } else {
                    alert('Some error occurred.');
                }
            }
        });
    }
};
//$('[name="templates"]').on('change', function () {
//    alert($('[name=templates] :selected').val());
//});

function change_template(flow_name) {
    var template_name = $('[name=' + flow_name + '] :selected').text();
    if (!flow_name || !template_name) {
        alert("something went wrong!!");
        return;
    }
    var formData = {
        'template_name': template_name,
        'flow_name': flow_name
    };
    var ajax_data = {
        'url': BASE_URL + 'api/email-template/',
        'data': formData,
        'request_type': 'PUT',
        'extra_fields': {
            dataType: 'json'
        }
    };
    call_ajax(ajax_data, function (err, response) {
        if (!err) {
            //alert("successfully removed");
        } else {
            if (typeof(response['responseText']) !== 'undefined') {
                error_payload = JSON.parse(response['responseText']);
                alert(error_payload['detail']);
            } else {
                alert('Some error occurred.');
            }
        }
    });
}
