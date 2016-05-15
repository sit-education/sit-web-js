myApp.controller('tasksController', ['$scope', '$http','$rootScope', '$location', function($scope, $http, $rootScope, $location){

    if($location.path() !== '/login' && $location.path() !== '/signUp' && $location.path() !== '/reset' && !getValueFromCookie(TOKEN_NAME)){
        $location.path('/login');
    }else{

        var accessToken = getValueFromCookie(TOKEN_NAME);
        $scope.formField = {};

        $rootScope.updateTasks();


        $scope.removeTask = function(id){
            $scope.pressed = false;

            $http({
                method: 'DELETE',
                url: URL + 'item/' + id,
                headers: {
                    'Content-Type': 'application/json',
                    'Token-Key': accessToken
                }
            }).success(function(data){
                $scope.pressed = false;
                if(data.status){
                    $rootScope.updateTasks();
                }else{
                    $scope.error = MSG_SOME_ERROR;
                }
            }).error(function(error){
                $scope.pressed = false;
                $scope.error = identifyErrorAnswer(error);
            })
        };

    }





}]);