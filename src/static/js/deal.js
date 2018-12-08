$(document).ready(function () {

});
var formData = {},
    deal_id;

$('#deal_expired_date_close').datepicker();

function CloseDeal(id) {
    //Get the current form data
    loadFormData();
    var ajax_data = {
        'url': BASE_URL + 'api/deal-room/deal/close/',
        'data': JSON.stringify(formData),
        'request_type': 'PUT',
        'extra_fields': {
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            traditional: 'true'
        }
    };
    call_ajax(ajax_data, function (err, response) {
        //$.unblockUI();
        if (!err) {
            alert("successfully closed");
            $('#close-deal').modal('hide');
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

function loadFormData() {
    formData = {};
    var d1 = new Date($('#deal_expired_date_close').val());
    formData.deal = {
        "amount": $("#deal_amount_close").val(),
        "expire_date": d1.toISOString(),
        "id": $("#deal_id").val(),
        "minimum_amount_value_per_investor": $("#min_amount_per_investor_close").val()
    };
    if ($("#deal_type").val() == 'equity') {
        formData.deal["equity_dilution"] = $("#equity_dilution_close").val();
        formData.deal["equity_pre_money_valuation"] = $("#equity_pre_money_valuation_close").val();
        formData.deal["is_convertible_equity"] = $("#is_convertible_equity_close").val();
    }
    if ($("#deal_type").val() == 'debt') {
        debt_type = [];
        debt_type.push(parseInt($('input[name=debt_type_close]:radio:checked').val()));
        formData.deal["debt_type"] = debt_type;
        formData.deal["debt_tenure"] = $("#debt_tenure_close").val();
        formData.deal["debt_interest_rate"] = $("#debt_interest_rate_close").val();
    }
    formData.deal_participants = [];
    $('.close_deal_participants').each(function (index) {
        var participant = {
            "amount": $(this).find('.inv_amount').val(),
            "id": $(this).find('.participant_id').val()
        };
        if ($("#deal_type").val() == 'equity') {
            participant["equity_dilution"] = $(this).find(".eq_dilution").val();
            participant["is_convertible_equity"] = $(this).find(".is_convertible_equity_val").val();
        }
        if ($("#deal_type").val() == 'debt') {
            participant_debt_type = [];
            participant_debt_type.push(parseInt($(this).find(".debt_type_val").val()));
            participant["debt_type"] = participant_debt_type;
            participant["debt_tenure"] = $(this).find(".debt_tenure_val").val();
            participant["debt_interest_rate"] = $(this).find(".debt_interest_rate_val").val();
        }
        formData.deal_participants.push(participant);
    });
}

$('.closeDeal').click(function (e) {
    deal_id = $(this).data("content");
    $("#deal_id").val(deal_id);
    GetCloseDealDetails(deal_id);
    $('#close-deal').modal('show');
});
$('#closeDealButton').off("click");
$('#closeDealButton').on("click", function (e) {
    CloseDeal(deal_id);
});

$(".viewDeal").click(function (e) {
    deal_id = $(this).data("content");
    GetDealDetails(deal_id);
    $('#view-deal').modal('show');
});

function GetDealDetails(id) {
    var ajax_data = {
        'url': BASE_URL + 'admin/deal_details/',
        'data': {"deal_id": id},
        'request_type': 'GET',
        'extra_fields': {
            dataType: 'json'
        }
    };
    call_ajax(ajax_data, function (err, response) {
        //$.unblockUI();
        if (!err) {
            // populate pop up fields
            $("#deal_name").text(response['name']);
            $("#deal_purpose").text(response['purpose']);
            $("#deal_target_amount").text(response['target_amount']);
            $("#min_investment").text(response['min_investment']);
            $("#deal_expiry_date").text(response['expiry_date']);
            $("#deal_type").text(response['type']);
            $("#equity_dilution_div").hide();
            $("#equity_pre_money_valuation_div").hide();
            $("#is_convertible_equity_div").hide();
            $("#debt_type_div").hide();
            $("#debt_tenure_div").hide();
            $("#debt_interest_rate_div").hide();
            if (response['type'] == "equity") {
                $("#equity_dilution").text(response['equity_dilution'].toFixed(2));
                $("#equity_pre_money_valuation").text(response['equity_pre_money_valuation']);
                $("#is_convertible_equity").text(response['is_convertible_equity']);
                $("#equity_dilution_div").show();
                $("#equity_pre_money_valuation_div").show();
                $("#is_convertible_equity_div").show();
            }
            if (response['type'] == "debt") {
                $("#debt_type").text(response['debt_type_name']);
                $("#debt_tenure").text(response['debt_tenure']);
                $("#debt_interest_rate").text(response['debt_interest_rate']);
                $("#debt_type_div").show();
                $("#debt_tenure_div").show();
                $("#debt_interest_rate_div").show();
            }

            $("#participants").empty();

            for (var i = 0; i < response['participants'].length; i++) {
                if (response['type'] == "grant") {
                    element = "<div class='participants'><div><label class='field_label' style='display: inline-block;'>Name: </label><label style='display: inline-block;'>" + response['participants'][i]['name'] + "</label></div>" +
                        "<input type='hidden' class='participant_id' value='" + response['participants'][i]['id'] + "'/><div><label class='field_label' style='display: inline-block;'>Role: </label><label style='display: inline-block;'>" + response['participants'][i]['role'] + "</label></div>";
                    if (response['participants'][i]['role'] == "lead_investor" || response['participants'][i]['role'] == "investor") {
                        element += "<div class='amount_invested'><label class='field_label' style='display: inline-block;'>Amount Invested: </label><label class='inv_amount' style='display: inline-block;' >" + response['participants'][i]['amount'] + "</label></div></div>";
                    } else {
                        element += "</div>";
                    }
                } else if (response['type'] == "equity") {
                    element = "<div class='participants'><div><label class='field_label' style='display: inline-block;'>Name: </label><label style='display: inline-block;'>" + response['participants'][i]['name'] + "</label></div>" +
                        "<input type='hidden' class='participant_id' value='" + response['participants'][i]['id'] + "'/><div><label class='field_label' style='display: inline-block;'>Role: </label><label style='display: inline-block;'>" + response['participants'][i]['role'] + "</label></div>";

                    if (response['participants'][i]['role'] == "lead_investor" || response['participants'][i]['role'] == "investor") {
                        element += "<div class='amount_invested'><label class='field_label' style='display: inline-block;'>Amount Invested: </label><label class='inv_amount' style='display: inline-block;'>" + response['participants'][i]['amount'] + "</label></div>" +
                            "<div class='equity_dilution'><label class='field_label' style='display: inline-block;'>Equity Dilution: </label><label class='eq_dilution' style='display: inline-block;' >" + response['participants'][i]['equity_dilution'].toFixed(2) + "</label></div>" +
                            "<div class='is_convertible_equity'><label class='field_label' style='display: inline-block;'>Is Convertible Equity: </label><label class='is_convertible_equity_val' style='display: inline-block;' >" + response['participants'][i]['is_convertible_equity'] + "</label></div></div>";
                    } else {
                        element += "</div>";
                    }
                } else if (response['type'] == "debt") {
                    element = "<div class='participants'><div><label class='field_label' style='display: inline-block;'>Name: </label><label style='display: inline-block;'>" + response['participants'][i]['name'] + "</label></div>" +
                        "<input type='hidden' class='participant_id' value='" + response['participants'][i]['id'] + "'/>" + "<div><label class='field_label' style='display: inline-block;'>Role: </label><label style='display: inline-block;'>" + response['participants'][i]['role'] + "</label></div>";

                    if (response['participants'][i]['role'] == "lead_investor" || response['participants'][i]['role'] == "investor") {
                        element += "<div class='amount_invested'><label class='field_label' style='display: inline-block;'>Amount Invested: </label><label class='inv_amount' style='display: inline-block;' >" + response['participants'][i]['amount'] + "</label></div>" +
                            "<div class='debt_type'><label class='field_label' style='display: inline-block;'>Debt Type: </label><label class='debt_type_val' style='display: inline-block;' >" + response['participants'][i]['debt_type_name'] + "</label></div>" +
                            "<div class='debt_tenure'><label class='field_label' style='display: inline-block;'>Debt Tenure(years): </label><label class='debt_tenure_val' style='display: inline-block;' >" + response['participants'][i]['debt_tenure'] + "</label></div>" +
                            "<div class='debt_interest_rate'><label class='field_label' style='display: inline-block;'>Debt Interest Rate(%): </label><label class='debt_interest_rate_val' style='display: inline-block;' >" + response['participants'][i]['debt_interest_rate'] + "</label></div></div>";
                    } else {
                        element += "</div>";
                    }
                }
                $("#participants").append(element);
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

function GetCloseDealDetails(id) {
    var ajax_data = {
        'url': BASE_URL + 'admin/deal_details/',
        'data': {"deal_id": id},
        'request_type': 'GET',
        'extra_fields': {
            dataType: 'json'
        }
    };
    call_ajax(ajax_data, function (err, response) {
        //$.unblockUI();
        if (!err) {
            // populate pop up fields
            $("#deal_amount_close").val(response['target_amount']);
            $("#min_amount_per_investor_close").val(response['min_investment']);
            console.log(response['expiry_date']);
            $('#deal_expired_date_close').datepicker('setDate', new Date(response['expiry_date']));
            $("#deal_type").val(response['type']);
            $("#equity_dilution_div_close").hide();
            $("#equity_pre_money_valuation_div_close").hide();
            $("#is_convertible_equity_div_close").hide();
            $("#debt_type_div_close").hide();
            $("#debt_tenure_div_close").hide();
            $("#debt_interest_rate_div_close").hide();
            if (response['type'] == "equity") {
                $("#equity_dilution_close").val(response['equity_dilution']);
                $("#equity_pre_money_valuation_close").val(response['equity_pre_money_valuation']);
                $("#is_convertible_equity_close").val(response['is_convertible_equity']);
                $("#equity_dilution_div_close").show();
                $("#equity_pre_money_valuation_div_close").show();
                $("#is_convertible_equity_div_close").show();
            }
            if (response['type'] == "debt") {
                $('input:radio[name="debt_type_close"][value=' + response['debt_type'] + ']').attr('checked', 'checked');
                $.uniform.update('input:radio[name="debt_type_close"]');
                $("#debt_tenure_close").val(response['debt_tenure']);
                $("#debt_interest_rate_close").val(response['debt_interest_rate']);
                $("#debt_type_div_close").show();
                $("#debt_tenure_div_close").show();
                $("#debt_interest_rate_div_close").show();
            }
            participant_count = 0;
            $("#inv_participants").empty();
            for (var i = 0; i < response['participants'].length; i++) {
                if (response['participants'][i]['role'] == "lead_investor" || response['participants'][i]['role'] == "investor") {
                    participant_count++;
                    if (response['type'] == "grant") {
                        element = "<div class='close_deal_participants'><div><label class='field_label' style='display: inline-block;'>Name: </label><label style='display: inline-block;'>" + response['participants'][i]['name'] + "</label></div>" +
                            "<div class='close_deal_amount_invested'><label class='field_label' style='display: inline-block;'>Amount Invested: </label><input type='hidden' class='participant_id' value='" +
                            response['participants'][i]['id'] + "'/><input type='text' class='inv_amount' style='display: inline-block;' value='" + response['participants'][i]['amount'] + "'/></div>" +
                            "<div><label class='field_label' style='display: inline-block;'>Role: </label><label style='display: inline-block;'>" + response['participants'][i]['role'] + "</label></div></div>";
                    } else if (response['type'] == "equity") {
                        element = "<div class='close_deal_participants'><div><label class='field_label' style='display: inline-block;'>Name: </label><label style='display: inline-block;'>" + response['participants'][i]['name'] + "</label></div>" +
                            "<div class='close_deal_amount_invested'><label class='field_label' style='display: inline-block;'>Amount Invested: </label><input type='hidden' class='participant_id' value='" +
                            response['participants'][i]['id'] + "'/><input type='text' class='inv_amount' style='display: inline-block;' value='" + response['participants'][i]['amount'] + "'/></div>" +
                            "<div><label class='field_label' style='display: inline-block;'>Role: </label><label style='display: inline-block;'>" + response['participants'][i]['role'] + "</label></div>" +
                            "<div class='equity_dilution'><label class='field_label' style='display: inline-block;'>Equity Dilution: </label><input type='text' class='eq_dilution' style='display: inline-block;' value='" + response['participants'][i]['equity_dilution'] + "'/></div>" +
                            "<div class='is_convertible_equity'><label class='field_label' style='display: inline-block;'>Is Convertible Equity: </label><input type='text' class='is_convertible_equity_val' style='display: inline-block;' value='" + response['participants'][i]['is_convertible_equity'] + "'/></div></div>";
                    } else if (response['type'] == "debt") {
                        element = "<div class='close_deal_participants'><div><label class='field_label' style='display: inline-block;'>Name: </label><label style='display: inline-block;'>" + response['participants'][i]['name'] + "</label></div>" +
                            "<div class='close_deal_amount_invested'><label class='field_label' style='display: inline-block;'>Amount Invested: </label><input type='hidden' class='participant_id' value='" +
                            response['participants'][i]['id'] + "'/><input type='text' class='inv_amount' style='display: inline-block;' value='" + response['participants'][i]['amount'] + "'/></div>" +
                            "<div><label class='field_label' style='display: inline-block;'>Role: </label><label style='display: inline-block;'>" + response['participants'][i]['role'] + "</label></div>" +
                            "<div class='debt_type'><label class='field_label' style='display: inline-block;'>Debt Type: </label><input type='hidden' class='debt_type_val' value='" + response['participants'][i]['debt_type'] + "'/><label style='display: inline-block;'>" + response['participants'][i]['debt_type_name'] + "</label></div>" +
                            "<div class='debt_tenure'><label class='field_label' style='display: inline-block;'>Debt Tenure(years): </label><input type='text' class='debt_tenure_val' style='display: inline-block;' value='" + response['participants'][i]['debt_tenure'] + "'/></div>" +
                            "<div class='debt_interest_rate'><label class='field_label' style='display: inline-block;'>Debt Interest Rate(%): </label><input type='text' class='debt_interest_rate_val' style='display: inline-block;' value='" + response['participants'][i]['debt_interest_rate'] + "'/></div></div>";
                    }
                    $("#inv_participants").append(element);
                }
            }
            if (participant_count == 0) {
                $("#inv_participants").append("<label>No investors exist.</label>");
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



