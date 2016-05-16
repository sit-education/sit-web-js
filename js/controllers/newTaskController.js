myApp.controller('newTaskController',['$scope', '$rootScope', '$location', '$http', function($scope, $rootScope, $location, $http){

    if($location.path() !== '/login' && $location.path() !== '/signUp' && $location.path() !== '/reset' && !getValueFromCookie(TOKEN_NAME)){
        $location.path('/login');
    }

    var accessToken = getValueFromCookie(TOKEN_NAME);

    if($rootScope.tasks === undefined) {
        $location.path('/tasks');

    }
    $scope.formField = {};

    $scope.addNewTask = function(){
        $scope.pressed = true;

        $http({
            method: 'POST',
            url: URL + 'item',
            data: $scope.formField,
            headers: {
                'Content-Type': 'application/json',
                'Token-Key': accessToken
            }
        }).success(function(data){
            if(data.status){
                window.location.href = '#/tasks';
            }else{
                $scope.error = MSG_SOME_ERROR;
            }
        }).error(function(error){
            $scope.error = identifyErrorAnswer(error);

        })
    };

}]);