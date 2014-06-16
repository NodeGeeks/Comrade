/**
* Chat.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      openChat: function(req, res) {
          var room = req.param('room');

          // If request from WebSocket, this method is exist.
          req.socket.join(room);
      }


  }
};

