angular.module('comrade.services', [])

/**
 * A simple example service that returns some data.
 */

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
    }
  }
})


.factory('ComradeAPI', function ($scope, $http, $window) {
    //This is a sails NodeJS monogodb localhost running that we will move to a AWS Server we have for Production use
    var baseURL = "http://localhost:1337";
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

.factory('oAuthAPI', function ($scope, $http, $window) {
    return {
        facebookGEToAuth2: function(token) {
            var URL = 'https://graph.facebook.com/me?fields=id&access_token='+token;
            $http({method: 'GET', url: URL}).
                success(function(data, status, headers, config) {
                    return data;
                }).
                error(function(data, status, headers, config) {
                    return data;
                });
        }
    }
})

.factory('UserSession', function () {




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
});
