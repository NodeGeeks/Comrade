angular.module('comrade.services', [])

/**
 * A simple example service that returns some data.
 */

.factory('Notifications', function() {
    return {

    }
})

.factory('Comrades', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var comrades = [];
    var uniqueIds = [];


    return {
        all: function() {
          comradess = angular.fromJson(window.localStorage['comrades']);
          return comradess;
        },
        get: function(comradeId) {
          return comrades[comradeId];
        },
        save: function() {

        },
        google: function() {
            hello("google").api("me/friends" ).success( function( json ){
                for (var i = 0; i < json.data.length; i++) {
                    var obj = json.data[i];
                    obj.provider = "google";
                    obj.type = "social";
                    if (uniqueIds.indexOf(obj.id) == -1 && obj.objectType !== 'page'){
                        comrades.push(obj);
                        uniqueIds.push(obj.id);
                        window.localStorage['comrades'] = angular.toJson(comrades);
                    }

                }
            }).error( function(err){
                if (err.error.code = 401) {
                    hello.login('google', {display: 'none'}, function() {});
                }
            });
        },

        twitter: function() {
            hello("twitter").api("me/friends" ).success( function( json ){
                for (var i = 0; i < json.data.length; i++) {
                    var obj = json.data[i];
                    obj.provider = "twitter";
                    obj.type = "social";
                    if (uniqueIds.indexOf(obj.id) == -1){
                        comrades.push(obj);
                        uniqueIds.push(obj.id);
                        window.localStorage['comrades'] = angular.toJson(comrades);
                    }
                }
            }).error( function(err){
                hello("twitter").login();
            });
        },

        facebook: function() {

            hello("facebook").api("me/friends" ).success( function( json ){
                for (var i = 0; i < json.data.length; i++) {
                    var obj = json.data[i];
                    obj.provider = "facebook";
                    obj.type = "comrade";
                    if (uniqueIds.indexOf(obj.id) == -1){
                        comrades.push(obj);
                        uniqueIds.push(obj.id);
                        window.localStorage['comrades'] = angular.toJson(comrades);
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
                    obj.provider = "facebook";
                    obj.type = "social";
                    if (uniqueIds.indexOf(obj.id) == -1){
                        obj.thumbnail = 'http://graph.facebook.com/' + obj.id + '/picture';
                        comrades.push(obj);
                        uniqueIds.push(obj.id);
                        window.localStorage['comrades'] = angular.toJson(comrades);
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
                    if (parsed.facebookID) return true;
                }
                if (provider == "twitter") {
                    if (parsed.twitterID) return true;
                }
                if (provider == "google") {
                    if (parsed.googleID) return true;
                }
            };
            return active(provider) ? true : false;
        },
        setSocialProfileImage: function (provider, imgURL) {
            var userData = window.localStorage['user'];
            var parsed = angular.fromJson(userData);
            if (provider == 'facebook') {
                parsed.facebookPic = imgURL;
                window.localStorage['user'] = angular.toJson(parsed);
            }
            if (provider == 'google') {
                parsed.googlePic = imgURL;
                window.localStorage['user'] = angular.toJson(parsed);
            }
            if (provider == 'twitter') {
                parsed.twitterPic = imgURL;
                window.localStorage['user'] = angular.toJson(parsed);
            }

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
        save: function(userData) {
            window.localStorage['user'] = angular.toJson(userData);
            console.log("DATA" + userData);
        },
        saveSocial: function(socialData, provider) {
            window.localStorage[provider] = angular.toJson(socialData);
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
