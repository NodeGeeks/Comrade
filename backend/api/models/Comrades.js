/**
* Comrades.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    tableName: 'comrades',
    schema: true,
    attributes: {
        userID: {
            type: 'string',
            required: true,
            columnName: 'userID'
        },
        comradesFullName: {
            type: 'string',
            required: true,
            columnName: 'comradesFullName'
        },
        comradePhoto: {
            type: 'string',
            columnName: 'comradePhoto'
        },
        comradeID: {
            type: 'string',
            required: true,
            columnName: 'comradeID'
        },
        onlineStatus: {
            type: 'string',
            defaultsTo: 'offline',
            enum: ['offline', 'online', 'busy'],
            columnName: 'onlineStatus'
        },
        comrades: {
            type: 'string',
            defaultsTo: 'pending',
            enum: ['pending', 'approved', 'denied', 'i-denied', 'blocked', 'i-blocked', 'ignored', 'i-ignored', 'sent'],
            columnName: 'comrades'
        }
    }
};

