'use strict';
$(document).ready(function () {

    var URI = 'https://sit-todo-test.appspot.com/api/v1/';
    var TOKEN_NAME = 'access-token';
    var SOME_ERROR = 'Something was wrong. Please try later';
    var jsonTaskData = 0;
    var taskId = 0;

    $('form button').prop('disabled', false);

    var arrPagePath = [];
    var currentPage = window.location.pathname;
    arrPagePath = currentPage.split('/');
    currentPage = arrPagePath[arrPagePath.length - 1];

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


    var accessToken = getValueFromCookie(TOKEN_NAME);

    if (currentPage == 'tickets.html') {
        if (!(accessToken)) {
            window.location.href = 'index.html';
        }
        getTask();
        //setInterval(getTask, 10000);
    }


    function identifyErrorAnswer(error) {
        if (!(error.status)) {
            var response = 0;
            var totalErrorResponse = 0;
            response = JSON.parse(error.responseText);
            totalErrorResponse = {
                status: response.status,
                errorMessage: response.errors[0].error_message
            };
            $('form button').before('<span class="invalid-message">' + totalErrorResponse.errorMessage + '</span>');
        } else {
            $('form button').before('<span class="invalid-message">' + SOME_ERROR + '</span>');
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
            success: function (data) {
                if (data.status) {
                    $('.task').remove();
                    var arrOfTasks = data.data.todoData;
                    if (arrOfTasks.length) {
                        arrOfTasks.forEach(function (item, i) {
                            var dictionaryTask = {};
                            dictionaryTask = arrOfTasks[i];
                            $('#tasks-list-section .task-list').append(
                                '<div class="task">' +
                                    '<div class="column number">' + (++i) + '</div>' +
                                '<div class="column content">' +
                                    '<span class="title">' + dictionaryTask.title + '</span>' +
                                    '<span class="description">' + dictionaryTask.description + '</span>' +
                                '</div>' +
                                '<div class="column control">' +
                                    '<span class="edit glyphicon glyphicon-pencil"></span>' +
                                    '<span class="delete glyphicon glyphicon-trash"></span>' +
                                '   </div>' +
                                '</div>'
                            );
                        });

                    } else {
                        $('#tasks-list-section .task-list').append(
                            '<div class="task note">' +
                                '<h2>You haven\'t any tasks yet</h2>' +
                            '</div>'
                        );
                    }

                    var allTasksDom = $('.task-list');
                    successTaskList(arrOfTasks, allTasksDom);
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

    function successTaskList(arrOfTasks, allTasksDom) {
        var activeItemValue = 0;
        var jsonTaskData = '';

        $('.new-task').on('click', function () {
            $('.new-task').prop('disabled', true);
            $('#tasks-list-section').fadeOut(0, function () {
                $('#add-task-section').fadeIn();
            });
        });

        $('.task-list').on('click', '.delete', function () {
            $('.delete').prop('disabled', true);
            var activeTaskDom = $(this).parents('.task');
            activeItemValue = $(activeTaskDom).find('.number').text();
            taskId = arrOfTasks[activeItemValue - 1].id;

            deleteTask(taskId, activeTaskDom);
            arrOfTasks.splice(activeItemValue - 1, 1);
            updateTaskNumber(allTasksDom);
        });

        $('.task-list').on('click', '.edit', function () {
            $('.edit').prop('disabled', true);
            $('#tasks-list-section').fadeOut(0, function () {
                $('#edit-task-section').fadeIn();
            });

            var activeTaskDom = $(this).parents('.task');
            activeItemValue = $(activeTaskDom).find('.number').text();
            var currentObjFromArr = {};
            currentObjFromArr = arrOfTasks[activeItemValue - 1];
            taskId = currentObjFromArr.id;
            jsonTaskData = getTaskDataForEdit(currentObjFromArr);
            $('#editTitle').val(currentObjFromArr.title);
            $('#editDesc').val(currentObjFromArr.description);
        });

    }

    function getTaskDataForEdit(currentObjFromArr) {
        delete currentObjFromArr.id;
        jsonTaskData = JSON.stringify(currentObjFromArr);
        return jsonTaskData;
    }

    function updateTaskNumber(allTasksDom) {
        setTimeout(function () {
            $('.delete').prop('disabled', false);
            $(allTasksDom).find('.number').each(function (index) {
                index++;
                $(this).text(index);
            });
        }, 1300)
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

    function deleteTask(taskId, activeTaskDom) {
        $.ajax({
            type: 'DELETE',
            url: URI + 'item/' + taskId,
            headers: {
                'Content-Type': 'application/json',
                'Token-Key': accessToken
            },
            success: function (data) {
                if (data.status) {
                    $(activeTaskDom).fadeOut(400, function () {
                        $(this).remove();
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
        $(this).find('button').prop('disabled', true);
        $('.invalid-message').remove();
        var formData = 0;
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
                alert('Sorry an error occurred on server');
                console.log(error);
            }


        });
    });


});


