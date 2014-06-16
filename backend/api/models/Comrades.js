/**
* Comrades.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    tableName: 'comrades',
    schema: false,
    attributes: {
        userID: {
            type: 'int',
            required: true,
            columnName: 'userID'
        },
        comradePhoto: {
            type: 'string',
            columnName: 'comradePhoto'
        },
        comradeID: {
            type: 'int',
            required: true,
            columnName: 'comradeID'
        },
        onlineStatus: {
            type: 'string',
            defaultsTo: 'offline',
            enum: ['offline','online']
        },
        comrades: {
            type: 'string',
            defaultsTo: 'pending',
            enum: ['pending', 'approved', 'denied', 'blocked', 'ignored'],
            columnName: 'comrades'
        }
    },

    beforeCreate: function(val, next) {

    }
};

