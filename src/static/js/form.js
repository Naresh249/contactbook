$(document).ready(function(){
    $('.screen2').addClass('hide');
    $('.screen3').addClass('hide');

    $('.continue-btn').on('click', function(e) {
      e.preventDefault();
      var retFunc = true;

      $('.form-control1').each(function(){
        var err = $(this).closest('.field-wrap').find('.err');
        err.addClass('hide');
      });

      $('.form-control1').each(function(){
        if(!$(this).val()) {
          var err = $(this).closest('.field-wrap').find('.err');
          err.removeClass('hide');
          retFunc = false;
        }
      });


      if(retFunc==false) {
        return retFunc;
      }
if($('#source').val() == "amazon" && $('#is_referral').val() == "False")
{
  alert("You were not referred");
  return false;
}
      $('.screen2').removeClass('hide');
      $('.screen1').addClass('hide');
      $('.screen3').addClass('hide');
    });

    $('#c1').change(function() {
      if($(this).is(":checked")) {
        $('.submit-btn').removeClass('hide');
      } else {
        $('.submit-btn').addClass('hide');
      }
              
    });

    function validateForm()
{
    var formData={email:$('#email').val(), name:$('#fullname').val(),company_name:$('#companyname').val(),
    pancard_data:pan_url,aadhaar_data:aadhar_url,bank_document_data:bank_url};
    var ajax_data = {
        'url':  window.location.protocol +'api/fin/',
        'data': formData,
        'request_type': 'POST',
        'extra_fields': {
            dataType: 'json'
        }
    };
    call_ajax(ajax_data, function (err, response) {
        //$.unblockUI();
        if (!err) {
        $('.screen1').addClass('hide');
        $('.screen3').removeClass('hide');
        $('.top-section').addClass('hide');
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

    $('.submit-btn').on('click', function(e) {
      e.preventDefault();
      var retFunc;

      $('.form-control1').each(function(){
        var err = $(this).closest('.field-wrap').find('.err');
        err.addClass('hide');
      });

      $('.form-control1').each(function(){
      console.log($(this).val());
        if(!$(this).val()) {

          var err = $(this).closest('.field-wrap').find('.err');
          err.removeClass('hide');
          retFunc = false;
        }
      });

      if(retFunc==false)
      {
        return retFunc;
      }

      validateForm()
    });
});


$('#pan_card_url').on('change',function(e){
    var logo_url = '';
    var imageFileName = '';
          var imgFile = e.target.files;
          if(!imgFile.length) {
            return;
          }
          var fileToLoad = imgFile[0];
          var fileReader = new FileReader();

          fileReader.onload = function(fileLoadedEvent) {
              var base64ImageData = fileLoadedEvent.target.result; // <--- Got the data as base64
              logo_url = base64ImageData;
              pan_url = logo_url;
              imageFileName = fileToLoad.name;
              console.log(base64ImageData);
          }
          fileReader.readAsDataURL(fileToLoad);
});



$('#aadhar_license_url').on('change',function(e){
    var logo_url = '';
    var imageFileName = '';
          var imgFile = e.target.files;
          if(!imgFile.length) {
            return;
          }
          var fileToLoad = imgFile[0];
          var fileReader = new FileReader();



          fileReader.onload = function(fileLoadedEvent) {
              var base64ImageData = fileLoadedEvent.target.result; // <--- Got the data as base64
              logo_url = base64ImageData;
              imageFileName = fileToLoad.name;
              aadhar_url = logo_url;
          }
          fileReader.readAsDataURL(fileToLoad);
});

    var pan_url = '';
    var aadhar_url = '',bank_url ='';

$('#bank_statement_url').on('change',function(e){
    var logo_url = '';
    var imageFileName = '';
          var imgFile = e.target.files;
          if(!imgFile.length) {
            return;
          }
          var fileToLoad = imgFile[0];
          var fileReader = new FileReader();
          fileReader.onload = function(fileLoadedEvent) {
              var base64ImageData = fileLoadedEvent.target.result; // <--- Got the data as base64
              logo_url = base64ImageData;
              imageFileName = fileToLoad.name;
              console.log(base64ImageData);
              bank_url = logo_url;
          }
          fileReader.readAsDataURL(fileToLoad);
});

$('#pan_card_url').fileupload({
        dataType: 'json',
        replaceFileInput: false,
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .bar').css(
                'width',
                progress + '%'
            );
            $('#pan_card_url').closest('.field-wrap').find('.prog-status').html(progress +'%');
            var fileUrl = $('#pan_card_url').val();
            var fileNameArr = fileUrl.split("\\");
            var fileName = fileNameArr[fileNameArr.length - 1];
            var elem = $('#pan_card_url').closest('.field-wrap').find('.append-text');
            elem.html(fileName);
            //$('#pan_card_url').closest('.field-wrap').append("<p class='append-text' style='margin-top:5px' >" + fileName + "</p>");

        },
        done: function (e, data) {

        }

    });


    $('#aadhar_license_url').fileupload({
        dataType: 'json',
        replaceFileInput: false,
        done: function (e, data) {
            $.each(data.result.files, function (index, file) {
                $('<p/>').text(file.name).appendTo(document.body);
            });
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress2 .bar').css(
                'width',
                progress + '%'
            );
            $('#aadhar_license_url').closest('.field-wrap').find('.prog-status').html(progress +'%');
            var fileUrl = $('#aadhar_license_url').val();
            var fileNameArr = fileUrl.split("\\");
            var fileName = fileNameArr[fileNameArr.length - 1];
            var elem = $('#aadhar_license_url').closest('.field-wrap').find('.append-text');
            elem.html(fileName);
            //$('#aadhar_license_url').closest('.field-wrap').append("<p class='append-text' style='margin-top:5px'>" + fileName + "</p>");
        }

    });

    $('#bank_statement_url').fileupload({
        dataType: 'json',
        replaceFileInput: false,
        done: function (e, data) {

        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress3 .bar').css(
                'width',
                progress + '%'
            );
            $('#bank_statement_url').closest('.field-wrap').find('.prog-status').html(progress +'%');
            var fileUrl = $('#bank_statement_url').val();
            var fileNameArr = fileUrl.split("\\");
            var fileName = fileNameArr[fileNameArr.length - 1];

            var elem = $('#bank_statement_url').closest('.field-wrap').find('.append-text');
            elem.html(fileName);
            //$('#bank_statement_url').closest('.field-wrap').append("<p class='append-text' style='margin-top:5px'>" + fileName + "</p>");
        }

    });

    $('.pincode-inp').on('input', function(e) {
      e.preventDefault();

        if($(this).val().length === 6) {
          var pincode = {
            'pincode': $(this).val()
          };

          var ajax_data = {
            'url':  window.location.protocol + 'admin/city-state/',
            'data': pincode,
            'request_type': 'GET',
            'extra_fields': {
                dataType: 'json'
            }
          };
          call_ajax(ajax_data, function (err, response) {
              //$.unblockUI();
              if (!err) {
                $('#pincode').closest('.form-group').find('.err-pin').addClass('hide');
                $('.city').val(response.response.city);
                $('.state').val(response.response.state);
                $('.city').prop("disabled", true);
                $('.state').prop("disabled", true);
              } else {
                //$('#pincode').closest('.form-group').find('.err-pin').removeClass('hide');
                $('.city').val('');
                $('.state').val('');
		$('.city').prop("disabled", false);
                $('.state').prop("disabled", false);
              }
          });

        }
    });


