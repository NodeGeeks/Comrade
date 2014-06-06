angular.module('comrade.services', [])

/**
 * A simple example service that returns some data.
 */

.factory('Notifications', function() {
    return {
        getFacebookNotifications: function() {
            hello("facebook").api("me/notifications", {limit: 1000} ).success( function( json, next ){
                console.log(json);
            }).error( function(){
                alert("Whoops!");
            });
        }
    }
})

.factory('Comrades', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var comrades = [ ];


    return {
        all: function() {
          return comrades;
        },
        get: function(comradeId) {
          return comrades[comradeId];
        },
        facebook: function() {
            hello("facebook").api("me/friends", {limit: 1000} ).success( function( json, next ){
                console.log(json);
                if( next ){
                    if( confirm( "Got friend "+ json.data[0].name + ". Get another?" ) ){
                        next();
                    }
                }
                else{
                    alert( "Got friend "+ json.data[0].name + ". That's it!" );
                }
            }).error( function(){
                alert("Whoops!");
            });

            hello("facebook").api("me/family", "get", {limit: 100}, function(json){console.log(json);});
        }

    }
})

.factory('SocialAccounts', function () {
    return {
        getSocialStatus: function (provider) {
            var online = function(session){
                var current_time = (new Date()).getTime() / 1000;
                return session && session.access_token && session.expires > current_time;
            };
            var social = hello(provider).getAuthResponse();
            return online(social) ? true : false;
        }
    }
})

.factory('ComradeAPI', function ($scope, $http, $window) {
    //This is a sails NodeJS monogodb localhost running that we will move to a AWS Server we have for Production use
    var baseURL = "http://50.18.210.192:1337";
    return {

        login: function(params) {
            return $http.get(baseURL+'/api/login', params);
        },
        register: function(params) {
            return $http.post(baseURL+'/api/register', params);
        },
        logout: function() {
           //TODO send post request to invalidate users ComradeToken
        }
    }
})


.factory('UserSession', function () {
    //TODO for developmement its okay to use standar localStorage but for product we want to use 'angular-local-storage' git repo by 'grevory'
    return {
        all: function() {
            var userData = window.localStorage['user'];
            if(userData) {
                return angular.fromJson(userData);
            }
            return [];
        },
        save: function(userData) {
            window.localStorage['user'] = angular.toJson(userData);
        }
    }
})

.factory('Messages', function () {
  var messages = [
    { id: 0, person: 'Scruff McGruff', short: 'Take the bite out of crime!', source: 'Facebook', timestamp: '2005-10-30 T 10:45' },
    { id: 1, person: 'Henry Brick', short: 'That game last night was amazing', source: 'Comrade', timestamp: '2005-10-30 T 10:45' },
    { id: 2, person: 'Jason Radcliff', short: 'You like that game huh? I love DarkSouls 2', source: 'SMS', timestamp: '2005-10-30 T 10:45' },
    { id: 3, person: 'Ash Ketchum', short: 'Pikachu!', source: 'Google', timestamp: '2005-10-30 T 10:45' }
  ];


  return {
    all: function() {
      return messages;
    },
    get: function(messageId) {
      // Simple index lookup
      return messages[messageId];
    }
  }
})

.factory('Events', function () {
  var events = [
    { id: 0, name: 'Birthday' },
    { id: 1, name: 'Party Time' },
    { id: 2, name: 'Dinner at Dominos' },
    { id: 3, name: 'Harry wedding' }
  ];
     
  return {
    all: function() {
      return events;
    },
    get: function(eventId) {
      // Simple index lookup
      return events[eventId];
    }
  }
})

.factory('SettingsController', function () {

});
