myApp.controller('loginController',['$scope', '$http', '$location', function($scope, $http, $location){

    if($location.path() == '/login' && getValueFromCookie(TOKEN_NAME)){
        $location.path('/tasks');
    }


    $scope.formField = {};

    $scope.saveDataForm = function(){
        $scope.pressed = true;
        $scope.formDataJson = JSON.stringify($scope.formField);
        $http({
            method: 'POST',
            url: URL +'login',
            data: $scope.formDataJson,
            headers: {
                'Content-Type':'application/json'
            }
        }).success(function(data){
            $scope.pressed = false;
            if (data.status) {
                var accessToken = data.data.tokenKey;
                var tokenExpired = (data.data.tokenExpired) * 1000;
                tokenExpired = new Date(tokenExpired).toUTCString();
                //document.cookie = TOKEN_NAME + '=' + accessToken + '; path=/; expires=' + tokenExpired;
                document.cookie = TOKEN_NAME + '=' + accessToken + '; path=/';
                $location.path('/tasks');
            } else {
                $scope.error = MSG_SOME_ERROR;
            }
        }).error(function(error){
            $scope.pressed = false;
            $scope.error = identifyErrorAnswer(error);
        })
    };


}]);