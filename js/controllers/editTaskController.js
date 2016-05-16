myApp.controller('editTaskController',['$scope', '$http', '$routeParams', '$rootScope', '$location', function($scope, $http, $routeParams, $rootScope, $location){

    if($location.path() !== '/login' && $location.path() !== '/signUp' && $location.path() !== '/reset' && !getValueFromCookie(TOKEN_NAME)){
        $location.path('/login');
    }

    var accessToken = getValueFromCookie(TOKEN_NAME);

    var id = $routeParams.id;

    id = id - 1;

    if($rootScope.tasks === undefined) {
        $location.path('/tasks');
    }
    $scope.task = $rootScope.tasks[id];


    $scope.saveEditTask = function(){

        $http({
            method: 'PUT',
            url: URL + 'item/'+ $scope.task.id,
            data: $scope.task,
            headers: {
                'Content-Type': 'application/json',
                'Token-Key': accessToken
            }
        }).success(function (data){
            if(data.status){
                $scope.pressed = false;
                $location.path('/tasks');
            }else{
                $scope.error = MSG_SOME_ERROR;
            }
        }).error(function(error){
            $scope.pressed = false;
            $scope.error = identifyErrorAnswer(error);
        });
    };

}]);