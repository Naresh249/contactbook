$(".viewDebtInvestorOnline").click(function (e) {
    tribe_id = $(this).data("content");
    GetInvestorEquityDebtOnlineDeals(tribe_id,0);
    $('#view-deals').modal('show');
});

$(".viewEquityInvestorOnline").click(function (e) {
    tribe_id = $(this).data("content");
    GetInvestorEquityDebtOnlineDeals(tribe_id,1);
    $('#view-deals').modal('show');
});

$(".viewLoanInvestorOnline").click(function (e) {
    tribe_id = $(this).data("content");
    GetInvestorLoanOnlineDeals(tribe_id,2);
    $('#view-deals').modal('show');
});


$(".viewDebtInvestorOffline").click(function (e) {
    tribe_id = $(this).data("content");
    GetInvestorEquityDebtOfflineDeals(tribe_id,0);
    $('#view-deals').modal('show');
});

$(".viewEquityInvestorOffline").click(function (e) {
    tribe_id = $(this).data("content");
    GetInvestorEquityDebtOfflineDeals(tribe_id,1);
    $('#view-deals').modal('show');
});

$(".viewLoanInvestorOffline").click(function (e) {
    tribe_id = $(this).data("content");
    GetInvestorLoanOfflineDeals(tribe_id,2);
    $('#view-deals').modal('show');
});



function GetInvestorEquityDebtOnlineDeals(id,type)
{
    var ajax_data = {
        'url': BASE_URL + 'admin/investor_equity_debt_online_deals/',
        'data': {"tribe_id": id,"deal_type": type},
        'request_type': 'GET',
        'extra_fields': {
            dataType: 'json'
        }
    };

    call_ajax(ajax_data, function (err, response) {
        //$.unblockUI();
        deals(err,response,type);
    });
}


function GetInvestorEquityDebtOfflineDeals(id,type)
{
    var ajax_data = {
        'url': BASE_URL + 'admin/investor_equity_debt_offline_deals/',
        'data': {"tribe_id": id,"deal_type": type},
        'request_type': 'GET',
        'extra_fields': {
            dataType: 'json'
        }
    };

    call_ajax(ajax_data, function (err, response) {
        //$.unblockUI();
        deals(err,response,type);
    });
}

function GetInvestorLoanOnlineDeals(id,type)
{
    var ajax_data = {
        'url': BASE_URL + 'admin/investor_loan_online_deals/',
        'data': {"tribe_id": id},
        'request_type': 'GET',
        'extra_fields': {
            dataType: 'json'
        }
    };

    call_ajax(ajax_data, function (err, response) {
        //$.unblockUI();
        deals(err,response,type);
    });
}

function GetInvestorLoanOfflineDeals(id,type)
{
    var ajax_data = {
        'url': BASE_URL + 'admin/investor_loan_offline_deals/',
        'data': {"tribe_id": id},
        'request_type': 'GET',
        'extra_fields': {
            dataType: 'json'
        }
    };

    call_ajax(ajax_data, function (err, response) {
        //$.unblockUI();
        deals(err,response,type);
    });
}


function deals(err,response,type)
{
        if (!err) {
            var htmlText = '';
            if(type!=2)
                var table_heading= '<thead><tr><th style="padding:15px;border: 1px solid black;border-collapse: collapse;">Deal Name</th><th style="padding:25px;border: 1px solid black;border-collapse: collapse;">Deal Type</th><th style="padding:25px;border: 1px solid black;border-collapse: collapse;">Deal Amount</th><th style="padding:25px;border: 1px solid black;border-collapse: collapse;">Deal Purpose</th><th style="padding:25px;border: 1px solid black;border-collapse: collapse;">Min. Amount Per Investor</th></tr></thead>';
            else
                var table_heading= '<thead><tr><th style="padding:15px;border: 1px solid black;border-collapse: collapse;">Company Name</th><th style="padding:25px;border: 1px solid black;border-collapse: collapse;">Deal Type</th><th style="padding:25px;border: 1px solid black;border-collapse: collapse;">Loan Amount</th><th style="padding:25px;border: 1px solid black;border-collapse: collapse;">Loan Tenure</th><th style="padding:25px;border: 1px solid black;border-collapse: collapse;">Loan Status</th></tr></thead>';
            var tr_start = '<tr>';
            var tr_end = '</tr>';
            var td_start = '<td style="padding:15px;border: 1px solid black;border-collapse: collapse;">';
            var td_end = '</td>';
            if(response['response'].length>0)
            {
                if(type!=2)
                {
                    for (var i=0;i < response['response'].length;++i){
                        htmlText+= tr_start+
                        td_start+response['response'][i]['name']+td_end+
                        td_start+response['response'][i]['deal_type']+td_end+
                        td_start+response['response'][i]['amount']+td_end+
                        td_start+response['response'][i]['purpose']+td_end+
                        td_start+response['response'][i]['minimum_amount_value_per_investor']+td_end+
                        tr_end;
                    }
                }
                else
                {
                    for (var i=0;i < response['response'].length;++i){
                        htmlText+= tr_start+
                        td_start+response['response'][i]['tribe_name']+td_end+
                        td_start+"Loan"+td_end+
                        td_start+response['response'][i]['loan_amount']+td_end+
                        td_start+response['response'][i]['loan_tenure']+td_end+
                        td_start+response['response'][i]['status']+td_end+
                        tr_end;
                    }
                }
            }
            else
            {
                htmlText = "<td><p>No deals exist</p></td>";
            }
            $('#temp-table').html(table_heading+htmlText);

        } else {
            response = $.parseJSON(response['responseText']);
            if (typeof(response['detail']) !== 'undefined') {
                alert(response['detail']);
            } else {
                alert('Some error occurred.');
            }
        }
}