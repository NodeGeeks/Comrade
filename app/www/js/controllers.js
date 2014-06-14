angular.module('comrade.controllers', [])


.controller('MainController', function($scope, $window, $http, $ionicLoading, $state, $location, UserSession, SocialAccounts) {
    $scope.$hasHeader=false;
    var a = angular.fromJson(window.localStorage.getItem('user'));
    console.log(a);
    if (a) {
        if (a.accessToken && a.id) {
            $location.path('/loggedIn/dashboard');
        }
    }
    $scope.socialLogin = function(provider) {
        $ionicLoading.show({
            template: 'Logging in'
        });
        var retrieveStoreAndGo = function(userData) {
            var hasFacebook = userData[0].facebookID ? true : false;
            var hasTwitter = userData[0].twitterID ? true : false;
            var hasGoogle = userData[0].googleID ? true : false;
            var i = 0;
            var l = 0;
            UserSession.save(userData[0]);
            if (hasFacebook) {
                i++;
                hello.login( 'facebook', {display: 'none'}, function(auth){
                    hello('facebook').api( '/me' ).success(function(r){
                        UserSession.saveSocial(r, 'facebook');
                        SocialAccounts.setSocialProfileImage('facebook', r.thumbnail);
                        l++;
                        if (l == i) {
                            $ionicLoading.hide();
                            $location.path('/loggedIn/dashboard');
                        }
                    });
                });
            }
            if (hasTwitter) {
                i++;
                hello.login( 'twitter', {}, function(auth){
                    hello('twitter').api( '/me' ).success(function(r){
                        UserSession.saveSocial(r, 'twitter');
                        SocialAccounts.setSocialProfileImage('twitter', r.thumbnail);
                        l++;
                        if (l == i) {
                            $ionicLoading.hide();
                            $location.path('/loggedIn/dashboard');
                        }
                    });
                });
            }
            if (hasGoogle) {
                i++;
                hello.login( 'google', {}, function(auth){
                    hello('google').api( '/me' ).success(function(r){
                        UserSession.saveSocial(r, 'google');
                        SocialAccounts.setSocialProfileImage('google', r.thumbnail);
                        l++;
                        if (l == i) {
                            $ionicLoading.hide();
                            $location.path('/loggedIn/dashboard');
                        }
                    });
                });
            }
            console.log("we have this many social account" + i);

        };
        var options = {};
        if (provider == "facebook") {
            options = {scope:'basic, friends, events, create_event, email, notifications'};
        } else if (provider == "twitter") {
            options = {scope:'basic', oauth_proxy: 'https://auth-server.herokuapp.com/proxy'};
        } else if (provider == "google") {
            options = {scope:'basic, friends, events, email'};
        } else if (provider == "linkedin") {
            options = {scope:'basic, friends, email', redirect_uri:'http://localhost:8100/', oauth_proxy: 'https://auth-server.herokuapp.com/proxy'};
        };
        hello.login( provider, options, function(auth){
            hello(provider).api( '/me' ).success(function(r){
                var firstName = r.first_name;
                var lastName = r.last_name;
                var baseURL = "http://localhost:1337";
                $http({method: 'POST', url: baseURL + '/users/loginSocialAccount', data: {provider: auth.network, socialID: r.id, firstName: firstName, lastName: lastName}}).
                    success(function(data, status, headers, config) {
                        retrieveStoreAndGo(data);
                    }).
                    error(function(data, status, headers, config) {
                        $ionicLoading.hide();
                    });
            });
            console.log(auth);
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
    $scope.UserData = UserSession.all();
    $scope.hasFacebook = $scope.UserData.facebookID ? true : false;
    $scope.hasTwitter = $scope.UserData.twitterID ? true : false;
    $scope.hasGoogle = $scope.UserData.googleID ? true : false;
    var baseURL = "http://localhost:1337";
    //TODO toggle switch for switching on or off different social accounts.

    $scope.logout = function() {
        $http({method: 'POST', url: baseURL + '/users/logout', data: {id:angular.fromJson(window.localStorage['user']).id} }).
            success(function(data, status, headers, config) {
                console.log(data);
                window.localStorage.clear();
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
                var baseURL = "http://localhost:1337";
                var userData = window.localStorage.getItem('user');
                var parsed = angular.fromJson(userData);
                var id = parsed.id;
                var acessToken = angular.fromJson(window.localStorage['user']).accessToken;
                $http({method: 'POST', url: baseURL + '/users/linkSocialAccount', data: {provider: auth.network, id: id , socialID: r.id, token: acessToken, socialToken: auth.authResponse.access_token}}).
                    success(function(data, status, headers, config) {
                        UserSession.save(data[0]);
                        SocialAccounts.setSocialProfileImage(provider, r.thumbnail);
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

})

.controller('SettingsController', function ($scope) {
})

.controller('ComradesController', function($scope, Comrades, SocialAccounts, UserSession) {
    $scope.UserData = UserSession.all();
    $scope.hasFacebook = $scope.UserData.facebookID ? true : false;
    $scope.hasTwitter = $scope.UserData.twitterID ? true : false;
    $scope.hasGoogle = $scope.UserData.googleID ? true : false;
    $scope.search = false;
    $scope.isComrade = function (id) {
        comradess = angular.fromJson(window.localStorage['comrades']);
        for (var i=0;i<comradess.length;i++){
            if (comradess[i].id==id && comradess[i].type == 'comrade'){
                return true;
            }
        }
    };

    $scope.isSocialComrade = function (id) {
        comradess = angular.fromJson(window.localStorage['comrades']);
        for (var i=0;i<comradess.length;i++){
            if (comradess[i].id==id && comradess[i].type == 'social'){
                return true;
            }
        }
    };

    if ($scope.hasFacebook) {
        $scope.facebookComrades = Comrades.facebook();
    };
    if ($scope.hasGoogle) {
        $scope.googleComrades = Comrades.google();
    };
    if ($scope.hasTwitter) {
        $scope.twitterComrades = Comrades.twitter();

    };
    $scope.comrades = Comrades.all();
    $scope.predicate = '+name';
})

.controller('ComradeInfoController', function($scope, $stateParams, Comrades) {
    $scope.comrade = Comrades.get($stateParams.comradeId);
})

.controller('EventsController', function($scope, Events) {
    $scope.events = Events.all();
})

.controller('MessagesController', function($scope, Messages, UserSession) {
    $scope.UserData = UserSession.all();
    $scope.hasFacebook = $scope.UserData.facebookID ? true : false;
    $scope.hasTwitter = $scope.UserData.twitterID ? true : false;
    $scope.hasGoogle = $scope.UserData.googleID ? true : false;
    if ($scope.hasFacebook) {
        $scope.facebookMessages = Messages.facebook();
    };
    if ($scope.hasGoogle) {
        //$scope.googleMessages = Messages.google();
    };
    if ($scope.hasTwitter) {
        $scope.twitterMessages = Messages.twitter();

    };
    $scope.messages = Messages.all();
})

.controller('PlacesController', function($scope) {

});
