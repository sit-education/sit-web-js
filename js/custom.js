'use strict';
$(document).ready(function () {

    function checkSamePass(passwordField, confPassField) {
        return (passwordField.localeCompare(confPassField));
    }

    function checkEmail(email) {
        var mailPattern = /[0-9a-z_-]+@[0-9a-z_-]+\.[a-z]{2,5}/i;
        return mailPattern.test(email);
    }

    function identifyErrorAnswer(error){
        var response = 0;
        var totalErrorResponse = 0;
        response = JSON.parse(error.responseText);
        totalErrorResponse = {
            status: response.status,
            errorMessage: response.errors[0].error_message
        };
        $('form button').before('<span id="invalid-message">' + totalErrorResponse.errorMessage + '</span>');
    }

    function authOfUser(userFormData){
        $.ajax({
            type: 'POST',
            url: 'https://sit-todo-test.appspot.com/api/v1/login',
            data: userFormData,
            contentType: 'application/json',
            success: function(data){
                if(data.status){
                    var tokenExpired = (data.data.tokenExpired) * 1000;
                    var userId = data.data.user_id;
                    tokenExpired = new Date(tokenExpired).toUTCString();
                    //document.cookie = 'token=' + data.data.tokenKey + '; path=/; expires=' + tokenExpired;
                    window.localStorage.setItem('access-token', data.data.tokenKey);
                    window.location.href = 'tickets.html';
                }else{
                    $('form button').before('<span id="invalid-message">Something was wrong. Please try again</span>');
                }




            },
            error: function(error){
                identifyErrorAnswer(error);
            }
        });
        setTimeout(function(){
            $('form button').prop('disabled', false);
        },2000);
    }

    function registerOfUser(registerFormData) {
        $.ajax({
            type: 'POST',
            url: 'https://sit-todo-test.appspot.com/api/v1/signup',
            data: registerFormData,
            contentType: 'application/json',
            success: function (data) {
                if(data.status){
                    window.location.href = 'confirm.html';
                }else{
                    $('form button').before('<span id="invalid-message">Something was wrong. Please try again</span>');
                }
            },
            error: function (error) {
                identifyErrorAnswer(error);
            }

        });
        setTimeout(function(){
            $('form button').prop('disabled', false);
        },2000);
    }




    $('form').on('submit', function (event) {
        event.preventDefault();
        $(this).find('button').prop('disabled', true);
        $('#invalid-message').remove();

        var fail = false;
        var formData = 0;
        var objFormData = {};

        var name = 0;
        $(this).find('input').each(function () {
            name = $(this).attr('name');
            objFormData[name] = $(this).val();
        });
        formData = JSON.stringify(objFormData);


        if ($(this).find('button').attr('name') == 'sign-up'){
            registerOfUser(formData);
        }

        if ($(this).find('button').attr('name') == 'sign-in'){
            authOfUser(formData);
        }







        //$(this).find('input[required]').each(function () {
        //    if ($(this).val().trim().length === 0) {
        //        fail = 'Inputs can not be empty';
        //        $(this).addClass('invalid-input');
        //    } else {
        //        $(this).removeClass('invalid-input');
        //        fail = false;
        //    }
        //
        //});


        //if (fail) {
        //    $(this).find('button').before('<span class="invalid-message">' + fail + '</span>');
        //} else {
        //    var emailField = $(this).find('.email').val();
        //
        //    if (checkEmail(emailField)) {
        //        fail = false;
        //        $('.email').removeClass('invalid-input');
        //    } else {
        //        fail = 'Please enter the correct email';
        //        $('.email').addClass('invalid-input');
        //    }
        //
        //    if (fail) {
        //        $(this).find('button').before('<span class="invalid-message">' + fail + '</span>');
        //    } else {
        //        var passwordField = $(this).find('#password').val();
        //        var confPassField = $(this).find('#confirm_pass').val();
        //
        //        if (checkSamePass(passwordField, confPassField)) {
        //            fail = 'The passwords aren\'t the same';
        //            $('.password').addClass('invalid-input');
        //            $('.confirm_pass').addClass('invalid-input');
        //        } else {
        //            fail = false;
        //            $('.password').removeClass('invalid-input');
        //            $('.confirm_pass').removeClass('invalid-input');
        //        }
        //
        //        if (fail) {
        //            $(this).find('button').before('<span class="invalid-message">' + fail + '</span>');
        //        } else {
        //            var registerFormData = getFormData();
        //            registerOfUser(registerFormData);
        //        }
        //    }
        //}

    });

    $('#logout-btn').on('click', function(){
        var accessToken = localStorage.getItem('access-token');
        $.ajax({
            type: 'POST',
            url: 'https://sit-todo-test.appspot.com/api/v1/logout',
            headers: {
                'Token-Key': accessToken,
                'Content-Type':'application/json'
            },
            success: function(data){
                if(data.status){
                    localStorage.removeItem('access-token');
                    window.location.href = 'index.html';
                }else{
                    alert('Sorry an error occurred on server');
                    console.log(data);
                }
            },
            error: function (error){
                alert('Sorry an error occurred on server');
                console.log(error);
            }


        });
    });






});


