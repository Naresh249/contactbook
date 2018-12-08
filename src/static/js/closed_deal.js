$(document).ready(function () {
});
var formData = {},
    deal_id;

$(".viewClosedDeal").click(function (e) {
        deal_id = $(this).data("content");
        GetCloseDealDetails(deal_id);
        $('#view-closed-deal').modal('show');
});

function GetCloseDealDetails(id) {
        var ajax_data = {
            'url': BASE_URL + 'admin/closed_deal_details/',
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
                $("#deal_amount").text(response['target_amount']);
                $("#min_amount_per_investor").text(response['min_investtment']);
                $("#deal_expired_date").text(response['expiry_date']);
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
                    $("#debt_type").text(response['debt_type']);
                    $("#debt_tenure").text(response['debt_tenure']);
                    $("#debt_interest_rate").text(response['debt_interest_rate']);
                    $("#debt_type_div").show();
                    $("#debt_tenure_div").show();
                    $("#debt_interest_rate_div").show();
                }
                $("#inv_participants").empty();
                for (var i = 0; i < response['participants'].length; i++) {
                        if (response['type'] == "grant") {
                            element = "<div class='participants'><div><label class='field_label' style='display: inline-block;'>Name: </label><label style='display: inline-block;'>" + response['participants'][i]['name'] + "</label></div>" +
                                "<input type='hidden' class='participant_id' value='" + response['participants'][i]['id'] + "'/>" + "<div><label class='field_label' style='display: inline-block;'>Role: </label><label style='display: inline-block;'>" + response['participants'][i]['role'] + "</label></div>";
                            if (response['participants'][i]['role'] == "lead_investor" || response['participants'][i]['role'] == "investor") {
                                element += "<div class='amount_invested'><label class='field_label' style='display: inline-block;'>Amount Invested: </label><label class='inv_amount' style='display: inline-block;'>" + response['participants'][i]['amount'] + "</label></div></div>";
                            }else{
                                element += "</div>";
                            }
                        } else if (response['type'] == "equity") {
                            element = "<div class='participants'><div><label class='field_label' style='display: inline-block;'>Name: </label><label style='display: inline-block;'>" + response['participants'][i]['name'] + "</label></div>" +
                                "<input type='hidden' class='participant_id' value='" + response['participants'][i]['id'] + "'/>" + "<div><label class='field_label' style='display: inline-block;'>Role: </label><label style='display: inline-block;'>" + response['participants'][i]['role'] + "</label></div>" ;
                            if (response['participants'][i]['role'] == "lead_investor" || response['participants'][i]['role'] == "investor") {
                                element += "<div class='amount_invested'><label class='field_label' style='display: inline-block;'>Amount Invested: </label><label class='inv_amount' style='display: inline-block;'>" + response['participants'][i]['amount'] + "</label></div>" +
                                "<div class='equity_dilution'><label class='field_label' style='display: inline-block;'>Equity Dilution: </label><label class='eq_dilution' style='display: inline-block;'>" + response['participants'][i]['equity_dilution'].toFixed(2) + "</label></div>" +
                                "<div class='is_convertible_equity'><label class='field_label' style='display: inline-block;'>Is Convertible Equity: </label><label class='is_convertible_equity_val' style='display: inline-block;'>" + response['participants'][i]['is_convertible_equity'] + "</label></div></div>";
                            }else{
                                element += "</div>";
                            }
                        } else if (response['type'] == "debt") {
                            element = "<div class='participants'><div><label class='field_label' style='display: inline-block;'>Name: </label><label style='display: inline-block;'>" + response['participants'][i]['name'] + "</label></div>" +
                                "<input type='hidden' class='participant_id' value='" + response['participants'][i]['id'] + "'/>" +  "<div><label class='field_label' style='display: inline-block;'>Role: </label><label style='display: inline-block;'>" + response['participants'][i]['role'] + "</label></div>" ;

                            if (response['participants'][i]['role'] == "lead_investor" || response['participants'][i]['role'] == "investor") {
                                element += "<div class='amount_invested'><label class='field_label' style='display: inline-block;'>Amount Invested: </label><label class='inv_amount' style='display: inline-block;'>" + response['participants'][i]['amount'] + "</label></div>" +"<div class='debt_type'><label class='field_label' style='display: inline-block;'>Debt Type: </label><label class='debt_type_val' style='display: inline-block;'>" + response['participants'][i]['debt_type_name'] + "</label></div>" +
                                "<div class='debt_tenure'><label class='field_label' style='display: inline-block;'>Debt Tenure(years): </label><label class='debt_tenure_val' style='display: inline-block;'>" + response['participants'][i]['debt_tenure'] + "</label></div>" +
                                "<div class='debt_interest_rate'><label class='field_label' style='display: inline-block;'>Debt Interest Rate(%): </label><label class='debt_interest_rate_val' style='display: inline-block;'>" + response['participants'][i]['debt_interest_rate'] + "</label></div></div>";
                            }else{
                                element += "</div>";
                            }
                        }
                        $("#inv_participants").append(element);
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