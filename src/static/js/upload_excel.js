var excelModalType = -1;



function getBase64FullfilmentDetails() {
  var filesSelected;
  var fileName;
  if(excelModalType == 8){
    event.preventDefault();
    filesSelected = document.getElementById('filedisburse').files;
    fileName=filesSelected[0].name;
  }else{

    filesSelected = document.getElementById('fileUpload').files;
    fileName=filesSelected[0].name;
  }

  if (filesSelected.length > 0) {
    var reader = new FileReader();
    reader.onloadend = function (fileLoadedEvent) {
       var  image_blob = fileLoadedEvent.target.result;
       if(excelModalType == 1 || excelModalType == 2){
        callBase64(image_blob,fileName);
       }
       if(excelModalType == 3 || excelModalType == 4 || excelModalType == 5 || excelModalType == 6 || excelModalType == 7 || excelModalType == 9) {
        callBase64PaymentDetails(image_blob,fileName);
       }
       if(excelModalType == 8){
        UploadProductLoanDisbursalData(image_blob,fileName);
       }
      };
    reader.readAsDataURL(filesSelected[0]);
  }
   
}

function callBase64(image_blob,fileName) {
  var params = {'excel_type':excelModalType, 'document': image_blob,'title': fileName}
  var ajax_data = {
    'url': BASE_URL + 'api/loan-repayment/upload-excel/',
    'data': params,
    'request_type': 'POST',
     beforeSend: function (xhr, settings) {
      var access_token = get_cookie('appAccessToken');
      if (access_token != '') {
        xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
      }
      var csrf_token = get_cookie('csrftoken');
      if (csrf_token != '') {
        xhr.setRequestHeader('X-CSRFToken', csrf_token);
      }
    },
  };
  call_ajax(ajax_data, function (err, response) {
    $('#myModal-new').modal('hide');
    if (!err) {
      $(".success").show();
    } else {
      response = JSON.parse(response.responseText)
      alert(response.detail);    
    }
  });
}

function callBase64PaymentDetails(image_blob,fileName) {
  var params = {'excel_type':excelModalType, 'document': image_blob,'title': fileName}
  var ajax_data = {
    'url': BASE_URL + 'api/loan-repayment/payment-detail/',
    'data': params,
    'request_type': 'POST',
    beforeSend: function (xhr, settings) {
      var access_token = get_cookie('appAccessToken');
      if (access_token != '') {
        xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
      }
      var csrf_token = get_cookie('csrftoken');
      if (csrf_token != '') {
        xhr.setRequestHeader('X-CSRFToken', csrf_token);
      }
    },
  };
  call_ajax(ajax_data, function (err, response) {
    $('#myModal-new').modal('hide');
    if (!err) {
      $(".success").show();
    } 
    else {
      response = JSON.parse(response.responseText);
            alert(response.detail);
    }
  });
}

$( function() {
    $( "#id_update_date" ).datepicker();
  } );

$( function() {
    $( "#id_start_date" ).datepicker();
  } );
$( function() {
    $( "#id_end_date" ).datepicker();
  } );


function downloadexcel(id){
  var ajax_data = {
    'url': BASE_URL + 'api/loan-repayment/download_history_doc/',
    'data': {"doc_id":id},
    'request_type': 'GET',
    'extra_fields': {
        dataType: 'json'
    }
  };
  call_ajax(ajax_data,function(err,response){
    if (!err){
        response=response['response']
        var blob = base64toBlob(response.file, "data:application/vnd.ms-excel;")
        var objectUrl = URL.createObjectURL(blob);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = objectUrl;
        a.download = response.title;
        a.click();
      }
      else{
        alert(response.responseText);
      } 
  })
}







function getUploadDocHistory(id){
  var ajax_data = {
        'url': BASE_URL + 'api/loan-repayment/document-history/',
        'data': {"doc_type":id},
        'request_type': 'GET',
        'extra_fields': {
            dataType: 'json'
        }
    };

    call_ajax(ajax_data, function(err, response){
      if (!err){
          if (!response['response'].status){
            alert("No history")
          }
          else
            {
              var tr='';
              $("#restable").empty(); //clear for already fill table
              var tr_2 = $('<tr/>');
              tr_2.append("<th>" + "File Name" + "</th>");
              tr_2.append("<th>" + "Uploaded By" + "</th>");
              tr_2.append("<th>" + "Created at" + "</th>");
              tr_2.append("<th>" + "Download" + "</th>");
              $('#restable').append(tr_2);
              for (var i = 0; i < response['response']['data'].length; i++) {
                  tr = $('<tr/>');
                  tr.append("<td>" + response['response']['data'][i].name + "</td>");
                  tr.append("<td>" + response['response']['data'][i].uploaded_by + "</td>");
                  tr.append("<td>" + response['response']['data'][i].created_at + "</td>");
                  tr.append("<td>" + "<button class='btn btn-info btn-lg' onclick = downloadexcel(" + response['response']['data'][i].id +")>Download</button></td>");
                  $('#restable').append(tr);
              }
            $('#myModal-4').modal();
        }}
      else{
        alert(response.responseText);
      }
    });
}

function UploadProductLoanDisbursalData(image_blob,fileName) {
  var e = document.getElementById("select_doc_3");
  var inputDate = document.getElementById('id_update_date').value;
  var value = excelModalType;
  var params = {'excel_type':Number(value),'document': image_blob,'title': fileName,'update_date':inputDate};
  
  var ajax_data = {
    'url': BASE_URL + 'admin/status-to-disbursal/',
    'data': params,
    'request_type': 'POST',
    beforeSend: function (xhr, settings) {
      var access_token = get_cookie('appAccessToken');
      if (access_token != '') {
        xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
      }
      var csrf_token = get_cookie('csrftoken');
      if (csrf_token != '') {
        xhr.setRequestHeader('X-CSRFToken', csrf_token);
      }
    },
  };

   call_ajax(ajax_data, function (err, response) {
     if (!err) {
       $('#myModal-2').modal('hide');
     } 
    else {
      response = JSON.parse(response.responseText);
            alert(response.detail);
    }
  });
}

$('#myModal-2').on('shown.bs.modal', function() {

  $('#id_update_date').datepicker({ maxDate: 0 });

  });


function base64toBlob(b64Data, contentType, sliceSize) {
contentType = contentType || '';
sliceSize = sliceSize || 512;
var byteCharacters = atob(b64Data);
var byteArrays = [];
for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
var slice = byteCharacters.slice(offset, offset + sliceSize);
var byteNumbers = new Array(slice.length);
for (var i = 0; i < slice.length; i++) {
byteNumbers[i] = slice.charCodeAt(i);
}
var byteArray = new Uint8Array(byteNumbers);
byteArrays.push(byteArray);
}
var blob = new Blob(byteArrays, {
type: "application/vnd.ms-excel"
});
return blob;
}


function getNachExcel(){
  var start_date = document.getElementById('id_start_date').value;
  var end_date = document.getElementById('id_end_date').value;
  
  var ajax_data = {
        'url': BASE_URL + 'admin/get-nach-debit-excel/',
        'data': {"start_date": start_date,
                "end_date": end_date},
        'request_type': 'GET',
        'extra_fields': {
            dataType: 'json'
        }
    };

    call_ajax(ajax_data, function(err, response){
      if (!err){
        response=response['response']
        var blob = base64toBlob(response.file, "data:application/vnd.ms-excel;")
        var objectUrl = URL.createObjectURL(blob);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = objectUrl;
        a.download = "NACH_Debit_Request.xls";
        a.click();

        $('#myModal-3').modal('hide');
      }
      else{
        alert(response.responseText);
      }
    });
}


function getLavaSampleTemplates(id, fileName){
  
  var ajax_data = {
        'url': BASE_URL + 'admin/get-template/',
        'data': {excel_type:id},
        'request_type': 'GET',
        'extra_fields': {
            dataType: 'json'
        }
    };

    call_ajax(ajax_data, function(err, response){
      if (!err){
        response=response['response']
        var blob = base64toBlob(response.file, "data:application/vnd.ms-excel;")
        var objectUrl = URL.createObjectURL(blob);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = objectUrl;
        a.download = fileName + ".xls";
        a.click();

        $('#myModal-3').modal('hide');
      }
      else{
        alert(response.responseText);
      }
    });
}

$('#myModal-3').on('shown.bs.modal',function(){
  $('#id_start_date').datepicker();
});

$('#myModal-3').on('shown.bs.modal',function(){
  $('#id_end_date').datepicker();
})

function openModel(type){
  $(".success").hide();
excelModalType = type; 
  if (type != 8) {
  $("#myModal-new").modal();
    
  }else{
    $("#myModal-2").modal();
  }
}


/*for tab and lava functionality*/
$(document).ready(function(){
    $(".nav-tabs a").click(function(){
        $(this).tab('show');
    });
    document.getElementById('lava').onclick = function() {
       getLavaDetails();
    }
    document.getElementById('lavaReta').onclick = function() {
       getRetalierListData();
    }
    document.getElementById('mis').onclick = function() {
       getMisReportDetails();
     }
});


/*lava scheme table show on click*/

function getLavaDetails(){
var ajax_data = {
        'url': BASE_URL + 'admin/manage_lava_model_scheme/',
        'request_type': 'GET'
    };

    call_ajax(ajax_data, function(err, response){
      if (!err){
          if (!response['response'].status){
            alert("No history")
          }
          else
            {
              var tr='';
             $("#lavaTable").empty(); //clear for already fill table
              var tr_2 = $('<tr/>');
              tr_2.append("<th>" + "Model Name" + "</th>");
              tr_2.append("<th>" + "Model Number" + "</th>");
              tr_2.append("<th>" + "Effective Date" + "</th>");
              tr_2.append("<th>" + "Expire date" + "</th>");
              tr_2.append("<th>" + "Finane Price" + "</th>");
              tr_2.append("<th>" + "Down Payment" + "</th>");
              tr_2.append("<th>" + "Tenure" + "</th>");
              tr_2.append("<th>" + "Edit" + "</th>");
              tr_2.append("<th>" + "Delete" + "</th>");
              $('#lavaTable').append(tr_2);
              for (var i = 0; i < response['response']['data'].length; i++) {
                var params=response['response']['data'][i];
                  tr = $('<tr/>');
                  tr.append("<td>" + response['response']['data'][i].manufacturer_model.name + "</td>");
                  tr.append("<td>" + response['response']['data'][i].manufacturer_model.model_number + "</td>");
                  tr.append("<td>" + response['response']['data'][i].scheme.effective_date + "</td>");
                  tr.append("<td>" + response['response']['data'][i].scheme.expire_date + "</td>");
                  tr.append("<td>" + response['response']['data'][i].scheme.finance_price + "</td>");
                  tr.append("<td>" + response['response']['data'][i].scheme.max_down_payment + "</td>");
                  tr.append("<td>" + response['response']['data'][i].scheme.max_repayment_tenure + "</td>");
                  tr.append("<td>" + "<a href='#' onclick= 'getEditTable(" + JSON.stringify(params) + ")'><i class='material-icons'>&#xe254;</i></a> </td>");
                  //tr.append("<td>" + "<a href='#' onclick='getAddTable()'><i class='material-icons'>&#xe145;</i></a></td>");
                  tr.append("<td>" + "<a href='#' onclick='getDeletetable(" + JSON.stringify(params) + ")'><i class='material-icons'>&#xe872;</i></a></td>");
                  $('#lavaTable').append(tr);
              }
        }}
      else{
        alert(response.responseText);
      }
    });
}

/*fot scheme edit*/

var scheme_id = 0;
  function getEditTable(data){
     $("#myModal-edit").modal();
     $('#form-edit').empty();
    scheme_id = data.scheme.id;
    var model_name = $('<label>Model Name</label><input id = "model_name" type = text name = "model_name" value = ' + JSON.stringify(data.manufacturer_model.name)+' "/><br>');
    var model_number= $('<label>Model Number</label><input id = "model_number" type = text name = "model_number" value = ' + JSON.stringify(data.manufacturer_model.model_number)+' "/>');
    var effective_date = $('<label>Effective Date</label><input id = "effective_date" type = text name = "effective_date" value = ' + JSON.stringify(data.scheme.effective_date)+' "/>');
    var expire_date = $('<label>Expire Date</label><input id = "expire_date" type = text name = "expire_date" value = ' + JSON.stringify(data.scheme.expire_date)+' "/>');
    var finance_price = $('<label>Finance Price</label><input id = "finance_price" type = text name = "finance_price" value = ' + JSON.stringify(data.scheme.finance_price)+' "/>');
    var down_payment = $('<label>Down Payment</label><input id = "down_payment" type = text name = "down_payment" value = ' + JSON.stringify(data.scheme.max_down_payment)+' "/>');
    var tenure = $('<label>Tenure</label><input id = "tenure" type = text name = "tenure" value = ' + JSON.stringify(data.scheme.max_repayment_tenure)+' "/>');

    $('#form-edit').append(model_name);
    $('#form-edit').append(model_number);
    $('#form-edit').append(effective_date);
    $('#form-edit').append(expire_date);
    $('#form-edit').append(finance_price);
    $('#form-edit').append(down_payment);
    $('#form-edit').append(tenure);
  }


  function getLavaModelUpdate(){
    var params={};
    var queryString = $('#form-edit').serializeArray();
    for(var i=0; i<queryString.length;i++){
      key = queryString[i].name;
      params[key] = queryString[i].value;
    }
    params['scheme'] = scheme_id;

    if(params){
      var ajax_data = {
      'url': BASE_URL + 'admin/manage_lava_model_scheme/',
      'data': params,
      'request_type': 'PUT',
      beforeSend: function (xhr, settings) {
        var access_token = get_cookie('appAccessToken');
        if (access_token != '') {
          xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
        }
        var csrf_token = get_cookie('csrftoken');
        if (csrf_token != '') {
          xhr.setRequestHeader('X-CSRFToken', csrf_token);
        }
      },
    };

     call_ajax(ajax_data, function (err, response) {
       if (!err) {
         $('#myModal-edit').modal('hide');
         alert(response.response.messege);
         scheme_id=0;
         getLavaDetails();
       } 
      else {
        response = JSON.parse(response.responseText);
              alert(response.detail);
      }
    });

    }

  }

/*for delete lava scheme*/
function getDeletetable(data){
   $("#myModal-delet").modal();
    document.getElementById('yesDelete').onclick = function() {
      var params={};
      params['scheme']=data.scheme.id;
      params['is_deleted']=true;
      var ajax_data = {
      'url': BASE_URL + 'admin/manage_lava_model_scheme/',
      'data': params,
      'request_type': 'PUT',
      beforeSend: function (xhr, settings) {
        var access_token = get_cookie('appAccessToken');
        if (access_token != '') {
          xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
        }
        var csrf_token = get_cookie('csrftoken');
        if (csrf_token != '') {
          xhr.setRequestHeader('X-CSRFToken', csrf_token);
        }
      },
    };
     call_ajax(ajax_data, function (err, response) {
       if (!err) {
         $('#myModal-delet').modal('hide');
           alert(response.response.messege);
           getLavaDetails();
       } 
      else {
        response = JSON.parse(response.responseText);
              alert(response.detail);
      }
    });

    };

}
/*till here*/


/*for add new scheme*/
function getAddTable(){
    $("#myModal-addNew").modal();
   $('#addLavaModelScheme').empty();
    var model_name = $('<label>Model Name</label><input id = "model_name" type = text name = "model_name"/><br>');
    var model_number= $('<label>Model Number</label><input id = "model_number" type = text name = "model_number"/>');
    var expire_date = $('<label>Expire Date</label><input id = "expire_date" type = text name = "expire_date" required id="expire_date"/>');
    var finance_price = $('<label>Finance Price</label><input id = "finance_price" type = text name = "finance_price"/>');
    var down_payment = $('<label>Down Payment</label><input id = "down_payment" type = text name = "down_payment" />');
    var tenure = $('<label>Tenure</label><input id = "tenure" type = text name = "tenure"/>');

    $('#addLavaModelScheme').append(model_name);
    $('#addLavaModelScheme').append(model_number);
    $('#addLavaModelScheme').append(expire_date);
    $('#addLavaModelScheme').append(finance_price);
    $('#addLavaModelScheme').append(down_payment);
    $('#addLavaModelScheme').append(tenure);
}
$('#myModal-addNew').on('shown.bs.modal',function(){

$.datepicker.setDefaults({
  dateFormat: 'yy-mm-dd'
});
  
});
/*$('#myModal-addNew').on('shown.bs.modal',function(){
  $('#effective_date').datepicker({minDate: 0});
});*/

$('#myModal-addNew').on('shown.bs.modal',function(){
  $('#expire_date').datepicker({minDate: 1});
})

function addLavaData(){
  var params={};
    var queryString = $('#addLavaModelScheme').serializeArray();
    for(var i=0; i<queryString.length;i++){
      key = queryString[i].name;
      params[key] = queryString[i].value;
    }
    if(params){
      var ajax_data = {
        'url': BASE_URL + 'admin/manage_lava_model_scheme/',
        'data': params,
        'request_type': 'POST',
        beforeSend: function (xhr, settings) {
          var access_token = get_cookie('appAccessToken');
          if (access_token != '') {
            xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
          }
          var csrf_token = get_cookie('csrftoken');
          if (csrf_token != '') {
            xhr.setRequestHeader('X-CSRFToken', csrf_token);
          }
        }
      };

     call_ajax(ajax_data, function (err, response) {
       if (!err) {
         $('#myModal-addNew').modal('hide');
         alert(response.response.messege);
         getLavaDetails();
       } 
      else {
        response = JSON.parse(response.responseText);
        alert(response.detail);
         $('#myModal-addNew').modal('hide');
      }
      });

  }
}

/*for MIS report*/

function getMisReportDetails() {
  // body...
  var method='GET';
   misReportApiCall(method);
}

function misReportApiCall(method,params) {
  if (method == 'GET'){
    var ajax_data = {
        'url': BASE_URL + 'admin/mis_report_recvr_email/',
        'request_type': method
    };
  }else{
    var ajax_data = {
        'url': BASE_URL + 'admin/mis_report_recvr_email/',
        'request_type': method,
        'data':params
    };
  }
    call_ajax(ajax_data, function(err, response){
      if (!err){
          if (!response['response'].status){
            alert("No history")
          }else {
            if(method == 'GET'){
              console.log(response['response']['data']);
              getDisplayMisTable(response['response']['data']);

            }else if(method == 'PUT'){
                alert(response['response'].message);
                getMisReportDetails();
            }else if(method == 'POST'){
               alert(response['response'].message);
                getMisReportDetails();
            }else{
               }
          }
      }else{
        alert(response.responseText);
      }
    });
  }


function getDisplayMisTable(data) {
  var tr='';
    $("#misTable").empty(); //clear for already fill table
      var tr_2 = $('<tr/>');
      tr_2.append("<th>" + "Email Id" + "</th>");
      tr_2.append("<th>" + "Status" + "</th>");
      tr_2.append("<th>" + "Edit" + "</th>");
      tr_2.append("<th>" + "Action" + "</th>");
      tr_2.append("<th>" + "Select" + "</th>");
      $('#misTable').append(tr_2);
        for (var i = 0; i < data.length; i++) {
          var params=data[i];
          var status = '';
          if(data[i].is_deleted){
            status = "Deactive";
          }else{
            status = "Active";
          }
          tr = $('<tr/>');
          tr.append("<td>" + data[i].email + "</td>");
          tr.append("<td>" + status + "</td>");
          tr.append("<td>" + "<a href='#' onclick= 'getEditMisReport(" + JSON.stringify(params) + ")'><i class='material-icons'>&#xe254;</i></a> </td>");
          tr.append("<td>" + "<button type='btn' onclick='getMisReportDeactivate(" + JSON.stringify(params) + ")'>Active/Deactive</button></td>");
          tr.append("<td>" + " <input class='checkMisId' type='checkbox' value='"+params.id+"'></td>");
          $('#misTable').append(tr);
       }
}

function getEditMisReport(data) {
   $("#myModalMis-editmis").modal();
     $('#mis-edit-form').empty();
    var email = $('<label>Email</label><input id = "email" type = text name = "email" value = ' + JSON.stringify(data.email)+' "/><br>');
    $('#mis-edit-form').append(email);
    document.getElementById('misUpdate').onclick = function() {
      var method='PUT';
      var params={};
      var queryString = $('#mis-edit-form').serializeArray();
      params[queryString[0].name] = queryString[0].value;
      params.id_email= data.id;
      params.is_deleted=data.is_deleted;
      if(validateEmail(params.email)){
        misReportApiCall(method,params);
       $("#myModalMis-editmis").modal('hide');

      }else{
       alert("this is not valid email");
       $("#myModalMis-editmis").modal('hide');
      }
         //misReportApiCall();
     }
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function getMisReportDeactivate(data) {
  $("#misactivation").modal();
  if(data.is_deleted){
    var text = "Do you want to active the user?"
    $("#question").empty();
      $("#question").append(text);
  }else{
    var text = "Do you want to deactive the user?"
    $("#question").empty();
      $("#question").append(text);
  }
  document.getElementById('misactivation').onclick = function() {
    var params={};
    params.is_deleted = !data.is_deleted;
    params.id_email = data.id;
    params.email =data.email;
    var method="PUT";
     misReportApiCall(method,params);
       $("#misactivation").modal('hide');
    }
  // body...
}

function getMisEmailAddId() {
  $("#addMisEmailOpen").modal();
     $('#addMisEmailform').empty();
    var email = $('<label>Email</label><input id = "email" type = text name = "email"/><br>');
    $('#addMisEmailform').append(email);
    document.getElementById('addMisEmail').onclick = function() {
      var method='POST';
      var params={};
      var queryString = $('#addMisEmailform').serializeArray();
      params[queryString[0].name] = queryString[0].value;
      if(validateEmail(params.email)){
        misReportApiCall(method,params); 
       $("#addMisEmailOpen").modal('hide');

      }else{
       alert("this is not valid email");
       $("#addMisEmailOpen").modal('hide');
      }
     }
}


// for Retailer List
function getRetalierListData() {
  var method ='GET';
  getApiCallForRetailerList(method);
}
function getApiCallForRetailerList(method,params) {
 if (method == 'GET'){
    var ajax_data = {
        'url': BASE_URL + 'admin/lava_retailers/',
        'request_type': method
    };
  }else{
    var ajax_data = {
        'url': BASE_URL + 'admin/lava_retailers/',
        'request_type': method,
        'data':params
    };
    
  }

  call_ajax(ajax_data, function(err, response){
    if (!err){
      if (!response['response'].status){
        alert("No history")
      }else {
        if(method == 'GET'){
          getDisplatRetaliorListTable(response['response']['data']);
       }else if(method == 'PUT'){
         alert(response['response'].message);
          getRetalierListData();
        }
      }
      }else{
        alert(response.responseText);
      }
    });
  // body...
}
function getDisplatRetaliorListTable(data) {
    var tr='';
   $("#lavaReatilerLTable").empty(); //clear for already fill table
      var tr_2 = $('<tr/>');
      tr_2.append("<th>" + "Name" + "</th>");
      tr_2.append("<th>" + "Owner Name" + "</th>");
      tr_2.append("<th>" + "Phone Number" + "</th>");
      tr_2.append("<th>" + "Retailer Code" + "</th>");
      tr_2.append("<th>" + "Monthly Limit" + "</th>");
      tr_2.append("<th>" + "Address" + "</th>");
      tr_2.append("<th>" + "Tribe" + "</th>");
      tr_2.append("<th>" + "Status" + "</th>");
      tr_2.append("<th>" + "Edit" + "</th>");
      $('#lavaReatilerLTable').append(tr_2);
        for (var i = 0; i < data.length; i++) {
          var params=data[i];
          var status = '';
          if(data[i].is_active){
            status = "Active";
          }else{
            status = "Deactive";
          }
          tr = $('<tr/>');
          tr.append("<td>" + data[i].name + "</td>");
          tr.append("<td>" + data[i].owner_name + "</td>");
          tr.append("<td>" + data[i].phone_number + "</td>");
          tr.append("<td>" + data[i].retailer_code + "</td>");
          tr.append("<td>" + data[i].monthly_limit + "</td>"); 
          tr.append("<td>" + data[i].address + "</td>");
          tr.append("<td>" + data[i].tribe + "</td>");
          tr.append("<td>" + status + "</td>");
          tr.append("<td>" + "<a href='#' onclick= 'getRetailerListEdit(" + JSON.stringify(params) + ")'><i class='material-icons'>&#xe254;</i></a> </td>");
          $('#lavaReatilerLTable').append(tr);
       }
}

function getRetailerListEdit(data) {
  $("#retailerList-edit").modal();
  $('#retailerListEditForm').empty();
  var current_status = JSON.stringify(data.is_active);
  if(current_status == "true"){
    var option = $('<option selected = '+ true +' id="active" value=' +true+'>Active</option><option id="deactive" value='+false+'>Deactive</option>');
  }else{
    var option = $('<option id="active" value=' +true+'>Active</option><option selected = '+ true +' id="deactive" value='+false+'>Deactive</option>');
  }
   var name = $('<label>Name</label><input id = "name" type = text name = "name" value = ' + JSON.stringify(data.name)+' "/><br>');
   var owner_name = $('<label>Owner Name</label><input id = "owner_name" type = text name = "owner_name" value = ' + JSON.stringify(data.owner_name)+' "/><br>');
   var phone_number = $('<label>Phone Number</label><input id = "phone_number" type = text name = "phone_number" value = ' + JSON.stringify(data.phone_number)+' "/><br>');
   var retailer_code = $('<label>Retailer Code</label><input id = "retailer_code" type = text name = "retailer_code" value = ' + JSON.stringify(data.retailer_code)+' "/><br>');
   var monthly_limit = $('<label>Monthly Limit</label><input id = "monthly_limit" type = text name = "monthly_limit" value = ' + JSON.stringify(data.monthly_limit)+' "/><br>');
   var address = $('<label>Address</label><input id = "address" type = text name = "address" value = ' + JSON.stringify(data.address)+' "/><br>');
   var tribe = $('<label>Tribe</label><input readonly id = "tribe" type = text name = "tribe" value = ' + JSON.stringify(data.tribe)+' "/><br>');
   var is_active = $('<label>Status</label><select name="is_active" id="dropdown"></select>');
    $('#retailerListEditForm').append(name);
    $('#retailerListEditForm').append(owner_name);
    $('#retailerListEditForm').append(phone_number);
    $('#retailerListEditForm').append(retailer_code);
    $('#retailerListEditForm').append(monthly_limit);
    $('#retailerListEditForm').append(address);
    $('#retailerListEditForm').append(tribe);
    $('#retailerListEditForm').append(is_active);
    $('#dropdown').append(option);
    document.getElementById('retailerListUpdate').onclick=function(){
      var method='PUT';
      var params={};
      var queryString = $('#retailerListEditForm').serializeArray();
      for(var i=0; i<queryString.length;i++){
      key = queryString[i].name;
      params[key] = queryString[i].value;
     }
     console.log(params);
      getApiCallForRetailerList(method,params);
      $("#retailerList-edit").modal('hide');
     }
}

function getCheckbox() {
  var val = [];
        $('.checkMisId:checked').each(function(i){
          val[i] = $(this).val();
        });
  if(val.length >0){
    var params={};
    params.ids=val.toString();
     var ajax_data = {
        'url': BASE_URL + 'admin/send_mis_report_manually/',
        'data': params,
        'request_type': 'GET',
        beforeSend: function (xhr, settings) {
          var access_token = get_cookie('appAccessToken');
          if (access_token != '') {
            xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
          }
          var csrf_token = get_cookie('csrftoken');
          if (csrf_token != '') {
            xhr.setRequestHeader('X-CSRFToken', csrf_token);
          }
        }
      };

     call_ajax(ajax_data, function (err, response) {
       if (!err) {
         alert(response.response.message);
         getMisReportDetails();
        } 
      else {
        response = JSON.parse(response.responseText);
        alert(response.detail);
      }
      });
  }else{
    alert("Please select Email-ids");
  }
  // body...
}