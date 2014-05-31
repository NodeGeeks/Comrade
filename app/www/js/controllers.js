angular.module('comrade.controllers', [])

.controller('AppController', function($scope, UserSession) {

})

.controller('MainController', function($scope, $window, $http, $ionicLoading, $state, $location) {
    $scope.$hasHeader=false;
    hello.init( {
            google : '981504375483-e9f503lpnnkcfs83mg8ig9mtoqba7ntt.apps.googleusercontent.com',
            facebook : '238314456375254',
            twitter : 'QjnVXduKJIbDaddazyN7uCQCI'
        }, {scope:'friends', redirect_uri: 'http://localhost:8100/'}
    );
    hello.on('auth.login', function(auth){
        console.log(auth);
        // call user information, for the given network
        //NOTE at this point we do not have a social media ID for the user only an access token for oAuth2 providers.
        hello( auth.network ).api( '/me' ).success(function(r){
            var firstName = r.first_name;
            var lastName = r.last_name;
            var email = r.email;
            console.log(r);
            var baseURL = "http://localhost:1337";
            $http({method: 'POST', url: baseURL + '/user/loginSocialAccount', data: {provider: auth.network, id: r.id, token: auth.authResponse.access_token, firstName: firstName, lastName: lastName, email: email }}).
                success(function(data, status, headers, config) {
                    console.log(data);
                }).
                error(function(data, status, headers, config) {
                    console.log(data);
                });
            $location.path('/loggedIn/dashboard');
        });

    });

    $scope.socialLogin = function(provider) {

        //TODO add if statements to check provider and give appropriate options such as scopes and redirect_uri's as well as callbacks if needed
        hello(provider).login();
    };
})

.controller('LoginController', function($scope, $http, $location) {
    var baseURL = "http://localhost:1337";
    $scope.login = function(loginData) {
        console.log(loginData);

        $http({method: 'POST', url: baseURL + '/user/login', data: loginData}).
            success(function(data, status, headers, config) {
                alert(JSON.stringify(data));
                $location.path('/loggedIn/dashboard');
            }).
            error(function(data, status, headers, config) {
                alert(JSON.stringify(data));
            });
    };
})

.controller('SignupController', function($scope, $http, $location) {
    var baseURL = "http://localhost:1337";
    $scope.signup = function(signupData) {
        console.log(signupData);
        $http({method: 'POST', url: baseURL + '/user/signup', data: signupData}).
            success(function(data, status, headers, config) {
                alert(JSON.stringify(data));
                $location.path('/loggedIn/newuser');
            }).
            error(function(data, status, headers, config) {
                alert(JSON.stringify(data));
            });
    };
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

    $scope.socialLogout = function(provider) {
        hello(provider).logout(function(){
            alert("Signed out");
        });
    };
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
