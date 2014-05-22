angular.module('comrade', ['ionic', 'comrade.controllers', 'comrade.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

    .state('main', {
        url: "/main",
        templateUrl: "templates/main.html",
        controller: 'MainController'
    })

    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
    })

    .state('signup', {
        url: '/signup',
        templateUrl: 'templates/signup.html',
        controller: 'SignupController'

    })

    .state('loggedIn', {
        url: "/loggedIn",
        abstract: true,
        templateUrl: "templates/loggedIn.html",
        controller: 'MainController'
    })

    .state('loggedIn.dashboard', {
        url: '/dashboard',
        views: {
            'dashboard': {
                templateUrl: 'templates/dashboard.html',
                controller: 'DashboardController'
            }
        }
    })

    .state('loggedIn.comrades', {
        url: '/comrades',
         views: {
            'comrades': {
                templateUrl: 'templates/comrades.html',
                controller: 'ComradesController'
            }
        }
    })

    .state('loggedIn.comrade', {
      url: '/comrade/:comradeId',
      views: {
        'comrade-info': {
          templateUrl: 'templates/comrade-info.html',
          controller: 'ComradeInfoController'
        }
      }
    })

    .state('loggedIn.events', {
        url: '/events',
        views: {
            'events': {
                templateUrl: 'templates/events.html',
                controller: 'EventsController'
            }
        }
    })
    .state('loggedIn.messages', {
        url: '/messages',
        views: {
            'messages': {
                templateUrl: 'templates/messages.html',
                controller: 'MessagesController'
            }
        }
    })
    .state('loggedIn.places', {
        url: '/places',
        views: {
            'places': {
                templateUrl: 'templates/places.html',
                controller: 'PlacesController'
            }
        }
    })


    $urlRouterProvider.otherwise('/main');

});

