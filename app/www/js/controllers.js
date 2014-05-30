angular.module('comrade.controllers', [])

.controller('AppController', function($scope, UserSession) {

})

.controller('MainController', function($scope, $window, $http, $ionicLoading, $state, $location) {
    $scope.$hasHeader=false;
    var inAppBrowseroAuth = null;


    $scope.$on('gotFacebookToken', function(event, token) {
        var URL = 'https://graph.facebook.com/me?fields=id&access_token='+token;
        $http({method: 'GET', url: URL}).
            success(function(data, status, headers, config) {
                alert(JSON.stringify(data));
                data.provider = "facebook";
                data.token = token;
                var baseURL = "http://localhost:1337";
                $http({method: 'POST', url: baseURL + '/user/linkSocialAccount', data: {id: 1, socialAccount: data }}).
                    success(function(data, status, headers, config) {
                        alert(JSON.stringify(data));
                    }).
                    error(function(data, status, headers, config) {
                        alert(JSON.stringify(data));
                    });
                $location.path('/loggedIn/dashboard');
                $ionicLoading.hide();
            }).
            error(function(data, status, headers, config) {
                alert(JSON.stringify(data));
            });

        inAppBrowseroAuth.close();
        $ionicLoading.show({
            template: 'Logging in...'
        });
        inAppBrowseroAuth.removeEventListener('loaderror', function(data){
            //nothing
        });
        inAppBrowseroAuth.removeEventListener('exit', function(data){
            //nothing
        });
        inAppBrowseroAuth.removeEventListener('loadstop', function(data){
            //nothing
        });
    });
    //TODO create a simple plugin/directive to carry all possible providers, what parameters they require and allow me to for example add facebook-login-button as the attr to a button and automatically take care of logging in. This plugin needs to hold all providers URLS, required parameters and Comrades App ID's
    $scope.facebookLogin = function() {
        var oAuth2Params = {
            response_type: 'token',
            client_id: '238314456375254',
            redirect_uri: 'http://localhost:8100/',
            scope: 'read_mailbox, email, xmpp_login, read_friendlists, user_friends, create_event',
            auth_type: 'rerequest',
            display: 'popup'
        };
        var oAuthURL = 'https://www.facebook.com/dialog/oauth?' + $.param(oAuth2Params);
        inAppBrowseroAuth = window.open(oAuthURL, '_blank', 'location=yes');
        //TODO implement a better way to check if the inAppBrowser was canceled, terminated, error checking. Add more listeners look at inAppBrowser documentation for further usable callbacks and methods.
        inAppBrowseroAuth.addEventListener('loadstop', function(event) {
            var access_token = event.url.match(/(?:#|#.+&)access_token=([^&]+)/)[1];
            var error = event.url.split("error=")[1];
            if(access_token || error){
                if (!access_token) {
                    if (error) {
                        alert(error);
                    }
                } else {
                    $scope.$broadcast('gotFacebookToken', access_token);
                }
            }
        });
        inAppBrowseroAuth.addEventListener('loaderror', function(data){
            alert(JSON.stringify(data));
        })
        inAppBrowseroAuth.addEventListener('exit', function(data){
            //alert("inAppBrowser closed");
        })

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
