angular.module('comrade.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Comrades', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var comrades = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];


  return {
    all: function() {
      return comrades;
    },
    get: function(comradeId) {
      // Simple index lookup
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
