myApp.controller('signUpController', ['$scope', '$http', '$location', function($scope, $http, $location){

    if($location.path() == '/signUp' && getValueFromCookie(TOKEN_NAME)){
        $location.path('/tasks');
    }

    $scope.formField = {};
    $scope.showSuccess = false;
    $scope.hideForm = false;

    $scope.saveDataForm = function(){
        $scope.pressed = true;
        $scope.formDataJson = JSON.stringify($scope.formField);
        $http({
            method: 'POST',
            url: URL +'signup',
            data: $scope.formDataJson,
            headers: {
                'Content-Type':'application/json'
            }
        }).success(function(data){
            $scope.pressed = false;
            if(data.status){
                $scope.hideForm = true;
                $scope.showSuccess = true;
            }else{
                $scope.error = MSG_SOME_ERROR;
            }
        }).error(function(error){
            $scope.pressed = false;
            $scope.error = identifyErrorAnswer(error);
        })
    };


}]);