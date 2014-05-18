angular.module('comrade.controllers', [])

.controller('AppController', function() {
    $scope.name = SessionService.currentUser.name;
})

.controller('MainController', function($scope) {
    $scope.$hasHeader=false;
})

.controller('LoginController', function($scope) {

})

.controller('SignupController', function($scope) {

})

.controller('DashboardController', function($scope) {

})

.controller('ComradesController', function($scope, Comrades) {
    $scope.comrades = Comrades.all();
})

.controller('ComradeInfoController', function($scope, $stateParams, Comrades) {
    $scope.comrade = Comrades.get($stateParams.comradeId);
})

.controller('EventsController', function($scope, Events) {
    $scope.events = Events.all();
})

.controller('MessagesController', function($scope) {

});
