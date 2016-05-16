var myApp = angular.module('myApp', ['ngRoute']);

var URL = 'https://sit-todo-test.appspot.com/api/v1/';
var TOKEN_NAME = 'access-token';
var MSG_SOME_ERROR = 'Sorry, unexpected error. Please try later';
var MSG_DISCONNECT_ERROR = 'You have been disconnected';
var MSG_DELETED_ACCOUNT = 'Yor account was deleted';
var INVALID_TOKEN = 'invalid_token';


function identifyCodeError(error){
    switch (error){
        case 500:
            document.cookie = TOKEN_NAME + '=; path=/; expires= Thu, 01 Jan 1970 00:00:01 GMT';
            alert(MSG_SOME_ERROR);
            window.location.href = '#/login';
            break;

        case 410:
            document.cookie = TOKEN_NAME + '=; path=/; expires= Thu, 01 Jan 1970 00:00:01 GMT';
            alert(MSG_DELETED_ACCOUNT);
            window.location.href = '#/login';
            break;

        default:
            document.cookie = TOKEN_NAME + '=; path=/; expires= Thu, 01 Jan 1970 00:00:01 GMT';
            alert(MSG_SOME_ERROR);
            window.location.href = '#/login';
            break;
    }
}

function identifyErrorAnswer(error) {
        if (error.status == 0) {
            if(error.errors[0].error_key === INVALID_TOKEN){
                document.cookie = TOKEN_NAME + '=; path=/; expires= Thu, 01 Jan 1970 00:00:01 GMT';
                alert(MSG_DISCONNECT_ERROR);
                window.location.href = '#/login';
            }else{
                return error.errors[0].error_message;
            }

        }else{
            identifyCodeError(error);
        }

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
myApp.run(['$rootScope', '$http', '$location', function($rootScope, $http, $location){
    $rootScope.loc = $location;

    if($location.path() !== '/login' && $location.path() !== '/signUp' && $location.path() !== '/reset' && !getValueFromCookie(TOKEN_NAME)){
        window.location.href = '#/login';
    }

    $rootScope.emptyList = false;


    $rootScope.updateTasks = function(){
        var accessToken = getValueFromCookie(TOKEN_NAME);
        $http({
            method: 'GET',
            url: URL + 'items',
            headers: {
                'Content-Type': 'application/json',
                'Token-Key': accessToken
            }
        }).success(function (data){
            if(data.status){

                $rootScope.tasks = data.data.todoData;
                if(!$rootScope.tasks.length){
                    $rootScope.emptyList = true;
                }else{
                    $rootScope.emptyList = false;
                }
            }else{
                $rootScope.error = MSG_SOME_ERROR;
            }

        }).error(function(error){
            $rootScope.error = identifyErrorAnswer(error);
        });
    }
}]);

myApp.config(['$routeProvider', function($routeProvide){
	$routeProvide


        .when('/',  {
            templateUrl : 'template/login.html',
            controller  : 'loginController'
        })

		.when('/login',  {
			templateUrl : 'template/login.html',
			controller  : 'loginController'
		})

		.when('/signUp', {
			templateUrl : 'template/registration.html',
			controller  : 'signUpController'
		})

		.when('/reset', {
			templateUrl : 'template/recover_password.html',
			controller  : 'resetController'
		})

        .when('/tasks', {
            templateUrl : 'template/tasks.html',
            controller  : 'tasksController'
        })

        .when('/new',   {
            templateUrl : 'template/new.html',
            controller  : 'newTaskController'
        })

        .when('/task/:id',   {
            templateUrl : 'template/task.html',
            controller  : 'editTaskController'
        })


	    .otherwise({
            redirectTo: '/'
        });

}]);

















