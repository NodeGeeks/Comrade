angular.module('comrade.controllers', [])


.controller('MainController', function($scope, $window, $http, $ionicLoading, $state, $location, UserSession) {
    $scope.$hasHeader=false;

    $scope.socialLogin = function(provider) {
        var options = {};
        if (provider == "facebook") {
            options = {scope:'basic, friends, events, create_event, email, notifications'};
        } else if (provider == "twitter") {
            options = {scope:'basic', oauth_proxy: 'https://auth-server.herokuapp.com/proxy'};
        } else if (provider == "google") {
            options = {scope:'basic, friends, events, email'};
        } else if (provider == "linkedin") {
            options = {scope:'basic, friends, email', redirect_uri:'http://localhost:8100', oauth_proxy: 'https://auth-server.herokuapp.com/proxy'};
        }
        hello.login( provider, options, function(auth){
            hello(provider).api( '/me' ).success(function(r){
                var firstName = r.first_name;
                var lastName = r.last_name;
                var baseURL = "http://localhost:1337";
                $http({method: 'POST', url: baseURL + '/users/loginSocialAccount', data: {provider: auth.network, id: r.id, token: auth.authResponse.access_token, firstName: firstName, lastName: lastName}}).
                    success(function(data, status, headers, config) {
                        console.log(data);

                        UserSession.save(data);
                        $location.path('/loggedIn/dashboard');
                    }).
                    error(function(data, status, headers, config) {
                        console.log(data);
                    });
            });
        });

    }
})

.controller('LoginController', function($scope, $http, $location) {
    var baseURL = "http://localhost:1337";
    $scope.login = function(loginData) {
        console.log(loginData);

        $http({method: 'POST', url: baseURL + '/users/login', data: loginData}).
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
        $http({method: 'POST', url: baseURL + '/users/signup', data: signupData}).
            success(function(data, status, headers, config) {
                $location.path('/loggedIn/tutorial');
            }).
            error(function(data, status, headers, config) {
                alert(JSON.stringify(data));
            });
    };
})

.controller('DashboardController', function($scope, $http, $ionicModal, $location, UserSession, Notifications, SocialAccounts) {
    var baseURL = "http://localhost:1337";
    //TODO toggle switch for switching on or off different social accounts.
    $scope.UserData = UserSession.all();
    $scope.socialStatus = function (provider) {
        return SocialAccounts.getSocialStatus(provider);
    };
    $scope.facebookNotifications = Notifications.getFacebookNotifications();

    $scope.logout = function() {
        $http({method: 'POST', url: baseURL + '/users/logout', data: $scope.UserData.id}).
            success(function(data, status, headers, config) {
                console.log(data);
                UserSession.invalidate();
                hello().logout(function() {
                });
                $location.path('/main');

            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });


    };


    $scope.socialLogout = function(provider) {

        hello(provider).logout(function(val) {

        });

    };

    $scope.linkSocialAccount = function(provider) {
        var options = {};
        if (provider == "facebook") {
            options = {scope:'basic, friends, events, create_event, email, notifications'};
        } else if (provider == "twitter") {
            options = {scope:'basic', oauth_proxy: 'https://auth-server.herokuapp.com/proxy'};
        } else if (provider == "google") {
            options = {scope:'basic, friends, events, email'};
        } else if (provider == "linkedin") {
            options = {scope:'basic, friends, email', redirect_uri:'http://localhost:8100', oauth_proxy: 'https://auth-server.herokuapp.com/proxy'};
        }
        hello.login( provider, options, function(auth){
            hello(provider).api( '/me' ).success(function(r){
                var email = r.email;
                var baseURL = "http://localhost:1337";
                $http({method: 'POST', url: baseURL + '/users/linkSocialAccount', data: {provider: auth.network, id: $scope.UserData.id , socialID: r.id, token: $scope.UserData.accessToken, socialToken: auth.authResponse.access_token}}).
                    success(function(data, status, headers, config) {
                        console.log(data);

                        UserSession.save(data);
                        $location.path('/loggedIn/dashboard');
                    }).
                    error(function(data, status, headers, config) {
                        console.log(data);
                    });
            });
        });

    }

    $ionicModal.fromTemplateUrl('linkanothersocialaccount.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.linkAnotherSocialAccount = modal;
    });

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
    $scope.openLinkMoreModal = function() {
        $scope.linkAnotherSocialAccount.show();
    };
    $scope.closeLinkMoreModal = function() {
        $scope.linkAnotherSocialAccount.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.settingsModal.remove();
        $scope.socialAccountsModal.remove();
        $scope.linkAnotherSocialAccount.remove();
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
    $scope.facebookComrades = Comrades.facebook();
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
    $scope.twitterMessages = Messages.twitter();
})

.controller('PlacesController', function($scope) {

});
