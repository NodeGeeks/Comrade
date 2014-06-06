angular.module('comrade.controllers', [])


.controller('MainController', function($scope, $window, $http, $ionicLoading, $state, $location, UserSession) {
    $scope.$hasHeader=false;
    hello.init( {
            google : '981504375483-e9f503lpnnkcfs83mg8ig9mtoqba7ntt.apps.googleusercontent.com',
            facebook : '238314456375254',
            twitter : 'QjnVXduKJIbDaddazyN7uCQCI'
        }, {scope:'friends, events, create_event, email, notifications', redirect_uri: 'http://localhost:8100/'}
    );

    hello.on('auth.login', function(auth){
        hello( auth.network ).api( '/me' ).success(function(r){
            var firstName = r.first_name;
            var lastName = r.last_name;
            var email = r.email;
            console.log(r);
            var baseURL = "http://50.18.210.192:1337";
            $http({method: 'POST', url: baseURL + '/user/loginSocialAccount', data: {provider: auth.network, id: r.id, token: auth.authResponse.access_token, firstName: firstName, lastName: lastName, email: email }}).
                success(function(data, status, headers, config) {
                    //console.log(data);
                    UserSession.save(data);
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
    var baseURL = "http://50.18.210.192:1337";
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
    var baseURL = "http://50.18.210.192:1337";
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

.controller('DashboardController', function($scope, $ionicModal, UserSession, Notifications, SocialAccounts) {
    //TODO toggle switch for switching on or off different social accounts.
    $scope.UserData = UserSession.all();
    $scope.socialStatus = function (provider) {
        return SocialAccounts.getSocialStatus(provider);
    };
    var socialStatus1 = $scope.socialStatus('facebook');
    console.log($scope.socialStatus('facebook'));
    $scope.facebookNotifications = Notifications.getFacebookNotifications();

    $scope.refreshNotificationsList = function() {
        alert('ahhh refreshing :)');
    };

    $scope.socialLogout = function() {
        if ($scope.UserData.facebook !== undefined){
            hello('facebook').logout(function(){
                alert("Signed out of Facebook");
            });
        }
        if ($scope.UserData.google !== undefined){
            hello('facebook').logout(function(){
                alert("Signed out of Google");
            });
        }

    };

    $ionicModal.fromTemplateUrl('settings.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.settingsModal = modal;
    });

    $ionicModal.fromTemplateUrl('socialaccounts.html', {
        scope: $scope,
        animation: 'slide-in-left'
    }).then(function(modal) {
        $scope.socialAccountsModal = modal;
    });
    $scope.openSettingsModal = function() {
        $scope.settingsModal.show();
    };
    $scope.closeSettingsModal = function() {
        $scope.settingsModal.hide();
    };
    $scope.openSocialAccountsModal = function() {
        $scope.socialAccountsModal.show();
    };
    $scope.closeSocialAccountsModal = function() {
        $scope.socialAccountsModal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.settingsModal.remove();
        $scope.socialAccountsModal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });


})

.controller('SocialAccountsController', function ($scope, SocialAccounts) {
    $scope.socialAccounts = SocialAccounts.getSocialStatus();
})

.controller('SettingsController', function ($scope) {
})

.controller('ComradesController', function($scope, Comrades) {
    $scope.comrades = Comrades.all();
    $scope.facebookComrades = Comrades.facebook();
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
