'use strict';
$(document).ready(function () {

    var URI = 'https://sit-todo-test.appspot.com/api/v1/';
    var TOKEN_NAME = 'access-token';
    var SOME_ERROR = 'Sorry, unexpected error';
    var jsonTaskData = 0;
    var taskId = 0;

    $('form button').prop('disabled', false);

    var currentPage = getCurrentPage();

    if (currentPage == 'tickets.html') {
        var accessToken = getValueFromCookie(TOKEN_NAME);

        if (!(accessToken)) {
            window.location.href = 'index.html';
        }

        getTask();
        //setInterval(getTask, 10000);
    }

    function getCurrentPage(){
        var arrPagePath = [];

        var currentPage = window.location.pathname;
        arrPagePath = currentPage.split('/');
        currentPage = arrPagePath[arrPagePath.length - 1];
        return currentPage;
    }

    function getValueFromCookie(nameOfCookie) {
        var arrCookies = [];
        var dictionaryCookies = {};
        var oneCookie = [];

        var cookie = document.cookie;
        arrCookies = document.cookie.split('; ');

        if (!(document.cookie)) {
            return false;
        }

        for (var i = 0; i < arrCookies.length; i++) {
            oneCookie = arrCookies[i].split('=');
            dictionaryCookies[oneCookie[0]] = oneCookie[1];
        }

        if (dictionaryCookies[nameOfCookie]) {
            return dictionaryCookies[nameOfCookie];
        } else {
            return false;
        }

    }

    function identifyErrorAnswer(error) {
        var INVALID_TOKEN = 'invalid_token';
        if(error.status == 500){
            alert(SOME_ERROR);
            window.location.href = 'index.html'
        }else{
            if (error.status) {
                var totalErrorResponse = {};
                var response = {};
                response = JSON.parse(error.responseText);
                totalErrorResponse = {
                    status: response.status,
                    errorMessage: response.errors[0].error_message
                };
                if(response.errors[0].error_key === INVALID_TOKEN) {
                    //$('form button').before('<span class="invalid-message">' + SOME_ERROR + '</span>');
                    alert('You have been disconnected');
                    window.location.href = 'index.html';
                }else{
                    $('form button').before('<span class="invalid-message">' + totalErrorResponse.errorMessage + '</span>');
                }
            }
        }
    }

    function authOfUser(userFormData) {
        $.ajax({
            type: 'POST',
            url: URI + 'login',
            data: userFormData,
            contentType: 'application/json',
            success: function (data) {
                if (data.status) {
                    var accessToken = data.data.tokenKey;
                    var tokenExpired = (data.data.tokenExpired) * 1000;
                    tokenExpired = new Date(tokenExpired).toUTCString();
                    //document.cookie = TOKEN_NAME + '=' + accessToken + '; path=/; expires=' + tokenExpired;
                    document.cookie = TOKEN_NAME + '=' + accessToken + '; path=/';
                    window.location.href = 'tickets.html';
                } else {
                    $('form button').before('<span class="invalid-message">' + SOME_ERROR + '</span>');
                }
            },
            error: function (error) {
                identifyErrorAnswer(error);
            }
        });
        setTimeout(function () {
            $('form button').prop('disabled', false);
        }, 2000);

    }

    function registerOfUser(registerFormData) {
        $.ajax({
            type: 'POST',
            url: URI + 'signup',
            data: registerFormData,
            contentType: 'application/json',
            beforeSend: function(){
                $('body').append('<div id="loader"></div>');
            },
            success: function (data) {
                if (data.status) {
                    $('form').fadeOut(500, function () {
                        $('.after-action').fadeIn(500);
                    });

                } else {
                    $('form button').before('<span class="invalid-message">' + SOME_ERROR + '</span>');
                }
            },
            error: function (error) {
                identifyErrorAnswer(error);
            },
            complete: function () {
                $('#loader').remove();
            }

        });
    }

    function recoverPass(recoverFormData) {
        $.ajax({
            type: 'POST',
            url: URI + 'restorePassword',
            data: recoverFormData,
            headers: {
                'Content-Type': 'application/json'
            },
            beforeSend: function(){
                $('body').append('<div id="loader"></div>');
            },
            success: function (data) {
                if (data.status) {
                    $('form').fadeOut(500, function () {
                        $('.after-action').fadeIn(500);
                    });
                } else {
                    $('form button').before('<span class="invalid-message">' + SOME_ERROR + '</span>');
                }
            },
            error: function (error) {
                identifyErrorAnswer(error);
            },
            complete: function () {
                $('#loader').remove();
            }
        });
    }

    function addTask(addTaskFormData) {
        $.ajax({
            type: 'POST',
            url: URI + 'item',
            headers: {
                'Content-Type': 'application/json',
                'Token-Key': accessToken
            },
            data: addTaskFormData,
            success: function (data) {
                if (data.status) {
                    window.location.href = 'tickets.html';
                } else {
                    $('form button').before('<span class="invalid-message">' + SOME_ERROR + '</span>');
                    console.log(data);
                }
            },
            error: function (error) {
                identifyErrorAnswer(error);
            }
        });
    }

    function getTask() {
        $.ajax({
            type: 'GET',
            url: URI + 'items',
            headers: {
                'Content-Type': 'application/json',
                'Token-Key': accessToken
            },
            beforeSend: function(){
                $('body').append('<div id="loader"></div>');
            },
            success: function (data) {
                if (data.status) {
                    $('.task').remove();
                    var arrOfTasks = data.data.todoData;
                    if (!(arrOfTasks.length)) {
                        addNoticeEmptyList();
                    }
                    arrOfTasks.forEach(function (item, i) {
                        var dictionaryTask = {};
                        dictionaryTask = arrOfTasks[i];
                        $('#tasks-list-section .task-list').append(
                            '<div class="task" data-id=' + dictionaryTask.id + '>' +
                            '<div class="column number">' + (++i) + '</div>' +
                            '<div class="column content">' +
                            '<span class="title">' + dictionaryTask.title + '</span>' +
                            '<span class="description">' + dictionaryTask.description + '</span>' +
                            '</div>' +
                            '<div class="column control">' +
                            '<span class="edit ico ico-pencil"></span>' +
                            '<span class="delete ico ico-trash"></span>' +
                            '   </div>' +
                            '</div>'
                        );
                    });

                } else {
                    $('form button').before('<span class="invalid-message">' + SOME_ERROR + '</span>');
                    console.log(data);
                }
            },
            error: function (error) {
                identifyErrorAnswer(error);
            },
            complete: function () {
                $('#loader').remove();
            }

        });

    }

    $('.new-task').on('click', function () {

        $('#tasks-list-section').fadeOut(0, function () {
            $('#add-task-section').fadeIn();
        });
    });

    $('.back-to-list').on('click', function () {
        var activeSection = $(this).closest('section');
        $(activeSection).fadeOut(0, function () {
            $('#tasks-list-section').fadeIn();
            $(activeSection).find('input, textarea').each(function () {
                $(this).val('');
            });
        });
    });

    $('.task-list').on('click', '.delete', function () {
        $('.delete').prop('disabled', true);
        var activeTask = {};
        var taskId = 0;
        var accessToken = '';

        activeTask = ($(this).closest('.task'));
        taskId = $(activeTask).attr('data-id');
        accessToken = getValueFromCookie(TOKEN_NAME);
        deleteTask(taskId, accessToken, activeTask);
    });


    $('.task-list').on('click', '.edit', function () {
        var activeTask = {};
        var formData = {};
        var taskId = 0;
        var accessToken = '';
        var title = '';
        var description = '';

        activeTask = ($(this).closest('.task'));
        taskId = $(activeTask).attr('data-id');
        accessToken = getValueFromCookie(TOKEN_NAME);
        title = $(activeTask).find('.content .title').text();
        description = $(activeTask).find('.content .description').text();

        $('#tasks-list-section').fadeOut(0, function () {
            $('#editTitle').val(title);
            $('#editDesc').val(description);
            $('#edit-task-section').fadeIn(function () {
                $('#edit-task').attr('data-id', taskId);
            });
        });
    });

    function updateTaskNumber() {
        var taskNumber = $('.task-list').find('.number');
        if (taskNumber.length) {
            $('.task-list').find('.number').each(function (index) {
                index++;
                $(this).text(index);
            });
            $('.delete').prop('disabled', false);
        } else {
            addNoticeEmptyList();
        }

    }

    function addNoticeEmptyList() {
        $('#tasks-list-section .task-list').append(
            '<div class="task note">' +
            '<h2>This list is empty. Please add the new task.</h2>' +
            '</div>'
        );
    }

    function editTask(editFormData, taskId) {
        $.ajax({
            type: 'PUT',
            url: URI + 'item/' + taskId,
            headers: {
                'Content-Type': 'application/json',
                'Token-Key': accessToken
            },
            data: editFormData,
            success: function (data) {
                if (data.status) {
                    window.location.href = 'tickets.html';
                } else {
                    $('form button').before('<span class="invalid-message">' + SOME_ERROR + '</span>');
                    console.log(data);
                }
            },
            error: function (error) {
                identifyErrorAnswer(error);
            }
        });
    }

    function deleteTask(taskId, accessToken, activeTask) {
        $.ajax({
            type: 'DELETE',
            url: URI + 'item/' + taskId,
            headers: {
                'Content-Type': 'application/json',
                'Token-Key': accessToken
            },
            success: function (data) {
                if (data.status) {
                    $(activeTask).fadeOut(400, function () {
                        $(this).remove();
                        updateTaskNumber();
                    });


                } else {
                    $('form button').before('<span class="invalid-message">' + SOME_ERROR + '</span>');
                    console.log(data);
                }
            },
            error: function (error) {
                identifyErrorAnswer(error);
            }
        });
    }


    $('form').on('submit', function (event) {
        event.preventDefault();
        var idForm = $(this).attr('id');
        var taskId = $(this).attr('data-id');
        $(this).find('button').prop('disabled', true);
        $('.invalid-message').remove();
        var formData = '';
        var objFormData = {};
        var name = '';
        $(this).find('input, textarea').each(function () {
            name = $(this).attr('name');
            objFormData[name] = $(this).val();
        });
        formData = JSON.stringify(objFormData);

        switch (idForm) {
            case 'login':
                authOfUser(formData);
                break;

            case 'sign-up':
                registerOfUser(formData);
                break;

            case 'recover-password':
                recoverPass(formData);
                break;

            case 'add-task':
                addTask(formData);
                break;

            case 'edit-task':
                editTask(formData, taskId);
                break;
        }

        setTimeout(function () {
            $('form button').prop('disabled', false);
        }, 2000);
    });

    $('#logout-btn').on('click', function () {
        $.ajax({
            type: 'POST',
            url: URI + 'logout',
            headers: {
                'Token-Key': accessToken,
                'Content-Type': 'application/json'
            },
            success: function (data) {
                if (data.status) {
                    document.cookie = TOKEN_NAME + '=; path=/; expires= Thu, 01 Jan 1970 00:00:01 GMT';
                    window.location.href = 'index.html';
                } else {
                    alert('Sorry an error occurred on server');
                    console.log(data);
                }
            },
            error: function (error) {
                identifyErrorAnswer(error);
            }


        });
    });


});


