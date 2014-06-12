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
    var comrades = [];
    var facebookFriends = [];
    var googleFriends = [];
    var twitterFriends = [];
    var uniqueIds = [];


    return {
        all: function() {
          console.log(comrades);
          return comrades;
        },
        get: function(comradeId) {
          return comrades[comradeId];
        },

        google: function() {
            hello("google").api("me/friends" ).success( function( json ){
                for (var i = 0; i < json.data.length; i++) {
                    var obj = json.data[i];
                    if (uniqueIds.indexOf(obj.id) == -1 && obj.objectType !== 'page'){
                        console.log(obj);
                        googleFriends.push(obj);
                        comrades.push(obj);
                        uniqueIds.push(obj.id);
                    }
                }
            }).error( function(err){
                //TODO handle error on getting friends
            });
        },

        twitter: function() {
            hello("twitter").api("me/friends" ).success( function( json ){
                for (var i = 0; i < json.data.length; i++) {
                    var obj = json.data[i];
                    if (uniqueIds.indexOf(obj.id) == -1){
                        console.log(obj);
                        twitterFriends.push(obj);
                        comrades.push(obj);
                        uniqueIds.push(obj.id);
                    }
                }
            }).error( function(err){
                //TODO handle error on getting friends
            });
        },

        facebook: function() {

            hello("facebook").api("me/friends" ).success( function( json ){
                for (var i = 0; i < json.data.length; i++) {
                    var obj = json.data[i];
                    if (uniqueIds.indexOf(obj.id) == -1){
                        console.log(obj);
                        facebookFriends.push(obj);
                        comrades.push(obj);
                        uniqueIds.push(obj.id);
                    }
                }
            }).error( function(err){
                if( err.error.error_subcode == 463) {
                    hello("facebook").login();
                }
            });

            hello("facebook").api("me/family", "get", {}, function(json){

                for (var i = 0; i < json.data.length; i++) {
                    var obj = json.data[i];
                    if (uniqueIds.indexOf(obj.id) == -1){
                        obj.thumbnail = 'http://graph.facebook.com/' + obj.id + '/picture';
                        console.log(obj);
                        facebookFriends.push(obj);
                        comrades.push(obj);
                        uniqueIds.push(obj.id);
                    }
                }
            });
        }

    }
})

.factory('SocialAccounts', function () {
    return {
        getSocialStatus: function (provider) {
            var active = function(provider){
                var userData = localStorage.getItem('user');
                var parsed = angular.fromJson(userData);
                if (provider == "facebook") {
                    if (parsed[0].facebookID) return true;
                }
                if (provider == "twitter") {
                    if (parsed[0].twitterID) return true;
                }
                if (provider == "google") {
                    if (parsed[0].googleID) return true;
                }
            };
            return active(provider) ? true : false;
        },
        saveSocialBasics: function(userData, provider) {
            window.localStorage[provider] = angular.toJson(userData);
        }

    }
})

.factory('ComradeAPI', function ($scope, $http, $window) {

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
        invalidate: function() {
            window.localStorage['user'] = null;
        },
        save: function(userData) {
            window.localStorage['user'] = angular.toJson(userData);
            console.log("DATA" + userData);
        }
    }
})

.factory('Messages', function () {
  var messages = [ ];


  return {
    all: function() {
      return messages;
    },
    get: function(messageId) {
      // Simple index lookup
      return messages[messageId];
    },
    twitter: function() {
      hello("twitter").api("me/messages" ).success( function( json ){
          console.log(json);
          for (var i = 0; i < json.length; i++) {
              var obj = json[i];
              messages = obj;
          }
      }).error( function(err){
          console.log(err);
          if( err.error.error_subcode == 463) {
              hello("twitter").login();
          }
      });
    },
    twitterLoadChat: function() {
        hello("twitter").api("me/messages" ).success( function( json ){
            console.log(json);
            for (var i = 0; i < json.length; i++) {
                var obj = json[i];
                messages = obj;
            }
        }).error( function(err){
            console.log(err);
            if( err.error.error_subcode == 463) {
                hello("twitter").login();
            }
        });

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
