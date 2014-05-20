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

.controller('DashboardController', function($scope, $ionicModal) {
    $ionicModal.fromTemplateUrl('settings.html', function($ionicModal) {
        $scope.modal = $ionicModal;
    }, {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope,
        // The animation we want to use for the modal entrance
        animation: 'fade-in'
    });  
    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });
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

.controller('MessagesController', function($scope, Messages) {
    $scope.messages = Messages.all();
});
