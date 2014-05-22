angular.module('comrade.services', [])

/**
 * A simple example service that returns some data.
 */

.factory('Comrades', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var comrades = [
    { id: 0, name: 'Scruff McGruff', facebookId: '664311', twitterId: '', googlePlusId: '431611', sms: '5593380208', email: 'email@mydomain.com', bio: 'This is a short bio description of what i am all about, hi my names so and so and im awesome, i work at my job where i earn money. I got out weekley and buy stuff at stores.' },
    { id: 1, name: 'G.I. Joe', facebookId: '71341', twitterId: '1436743', googlePlusId: '', sms: '5593380208', email: 'email@mydomain.com', bio: 'This is a short bio description of what i am all about, hi my names so and so and im awesome, i work at my job where i earn money. I got out weekley and buy stuff at stores.'  },
    { id: 2, name: 'Miss Frizzle', facebookId: '46136', twitterId: '146331', googlePlusId: '7134643', sms: '5593380208', email: 'email@mydomain.com', bio: 'This is a short bio description of what i am all about, hi my names so and so and im awesome, i work at my job where i earn money. I got out weekley and buy stuff at stores.'  },
    { id: 3, name: 'Ash Ketchum', facebookId: '', twitterId: '14513', googlePlusId: '', sms: '5593380208', email: 'email@mydomain.com', bio: 'This is a short bio description of what i am all about, hi my names so and so and im awesome, i work at my job where i earn money. I got out weekley and buy stuff at stores.'  }
  ];


  return {
    all: function() {
      return comrades;
    },
    get: function(comradeId) {
      return comrades[comradeId];
    }
  }
})


.factory('User', function () {


    return {
        login: function (user) {
            UserSession.currentUser = user;
        },

        isLoggedIn: function () {
            return UserSession.currentUser !== null;
        }
    }
})

.factory('UserSession', function () {


    return {
        currentUser: null
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
});
