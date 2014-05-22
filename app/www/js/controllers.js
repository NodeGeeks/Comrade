angular.module('comrade.controllers', [])

.controller('AppController', function() {
    $scope.name = SessionService.currentUser.name;
})

.controller('MainController', function($scope) {
    $scope.$hasHeader=false;
    //TODO create a simple plugin/directive to carry all possible providers, what parameters they require and allow me to for example add facebook-login-button as the attr to a button and automatically take care of logging in. This plugin needs to hold all providers URLS, required parameters and Comrades App ID's
    $scope.facebookLogin = function() {
        var oAuth2Params = {
            response_type: 'token',
            client_id: '238314456375254',
            redirect_uri: 'http://localhost:8100/',
            scope: 'read_mailbox, email, xmpp_login',
            display: 'popup'
        };
        var oAuthURL = 'https://www.facebook.com/dialog/oauth?' + $.param(oAuth2Params);
        var popupDialog = window.open(oAuthURL, '_blank', 'location=yes');
        //TODO implement a better way to check if the inAppBrowser was canceled, terminated, error checking. Add more listeners look at inAppBrowser documentation for further usable callbacks and methods.
        popupDialog.addEventListener('loadstop', function(event) {
            var access_token = event.url.match(/(?:#|#.+&)access_token=([^&]+)/)[1];
            var error = event.url.split("error=")[1];
            if(access_token || error){
                if(access_token){
                    popupDialog.close();
                    //TODO send token off to RESTful CRUD api at comradeapp.com to handle creating the users account or logging them in.
                    alert(access_token);
                } else if(error){
                    alert(error);
                }
            }
        });
    };
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
})

.controller('PlacesController', function($scope) {

});
