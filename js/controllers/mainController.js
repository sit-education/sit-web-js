myApp.controller('mainController',['$scope', '$http', '$location', function($scope, $http, $location){

    if(!getValueFromCookie(TOKEN_NAME)){
        $location.path('/login');
    }else{
        $location.path('/tasks');
    }

    $scope.logOut = function(){
        var accessToken = getValueFromCookie(TOKEN_NAME);
        $http({
            method: 'POST',
            url: URL + 'logout',
            headers: {
                'Token-Key': accessToken,
                'Content-Type': 'application/json'
            }
        }).success(function(data){
            if(data.status){
                document.cookie = TOKEN_NAME + '=; path=/; expires= Thu, 01 Jan 1970 00:00:01 GMT';
                $location.path('/login');
            }else{
                alert('MSG_SOME_ERROR');
            }
        }).error(function(error) {
            if (error.status == 0) {
                if(error.errors[0].error_key === INVALID_TOKEN){
                    document.cookie = TOKEN_NAME + '=; path=/; expires= Thu, 01 Jan 1970 00:00:01 GMT';
                    alert(MSG_DISCONNECT_ERROR);
                    window.location.href = '#/login';
                }else{
                     alert(error.errors[0].error_message);
                }

            }else{
                identifyCodeError(error);
            }
        });
    }

}]);