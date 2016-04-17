'use strict'
$(document).ready(function () {

    function checkSamePass(passwordField, confPassField ) {
        return (passwordField.localeCompare(confPassField));
    }

    function checkEmail(email){
        var mailPattern =/[0-9a-z_-]+@[0-9a-z_-]+\.[a-z]{2,5}/i;
        return mailPattern.test(email);
    }

    function getFormData() {
        var formData = 0;
        var objFormData = {};
        var name = 0;
        $('#sign-in input').each(function () {
            name = $(this).attr('name');
            objFormData[name] = $(this).val();
        });
        formData = JSON.stringify(objFormData);
        return formData;
    }

    function validForm(){
        var fail = false;
        var emailField = $('#email').val();
        var loginField = $('#login').val();
        var firstNameField = $('#firstName').val();
        var lastNameField = $('#lastName').val();
        var passwordField = $('#password').val();
        var confPassField = $('#confirm_pass').val();



        $('#sign-in input').each(function(){
            if($(this).val() == ''|| $(this).val() == ' '){
                $(this).addClass('invalid-input');
            } else {
                $(this).removeClass('invalid-input');
            }
        });

        if(checkSamePass(passwordField, confPassField)){
            $('#password').addClass('invalid-input');
            $('#confirm_pass').addClass('invalid-input');
        } else {
            $('#password').removeClass('invalid-input');
            $('#confirm_pass').removeClass('invalid-input');
        }

        //var isEmail = checkEmail(emailField);
        if(checkEmail(emailField)){
            $('#email').removeClass('invalid-input');
        } else {
            $('#email').addClass('invalid-input');
        }


    }



    $('#sign-btn').click(function () {
        event.preventDefault();
        $('#sign-btn').prop('disabled', true);
        $('.invalid-message').remove();
        validForm();




        var registerFormData = getFormData();
        //registerOfUser(registerFormData);

        //function registerOfUser(registerFormData){
        //    $.ajax({
        //        type: 'POST',
        //        url: 'https://sit-todo-test.appspot.com/api/v1/signup',
        //        data: registerFormData,
        //        contentType: 'application/json',
        //        success: function (data) {
        //            var totalPassRespond = {
        //                status: data.status,
        //                user_id: data.data.user_id,
        //                tokenKey: data.data.tokenKey,
        //                tokenExpired: data.data.tokenExpired,
        //                emailVerified: data.data.emailVerified
        //            };
        //            var tokenExpired = (data.data.tokenExpired) * 1000;
        //            tokenExpired = new Date(tokenExpired).toUTCString();
        //            document.cookie = 'token=' + data.data.tokenKey + '; path=/; expires=' + tokenExpired;
        //            window.location = 'confirm.html';
        //            $('#sign-btn').prop('disabled', false);
        //        },
        //        error: function (error) {
        //            var response = 0;
        //            var totalErrorResponse = 0;
        //            response = JSON.parse(error.responseText);
        //            totalErrorResponse = {
        //                status: response.status,
        //                errorMessage: response.errors[0].error_message
        //            };
        //            $('#sign-in button').before('<span class="invalid-message">' + totalErrorResponse.errorMessage + '</span>');
        //
        //
        //        }
        //
        //    });
        //}
        $('#sign-btn').prop('disabled', false);

    });


});


