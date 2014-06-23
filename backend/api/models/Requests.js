/**
* Requests.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    tableName: 'requests',
    schema: true,
    attributes: {
        userID: {
            type: 'string',
            required: true,
            columnName: 'userID'
        },
        comradeID: {
            type: 'string',
            required: true,
            columnName: 'comradeID'
        },
        requestType: {
            type: 'string',
            enum: ['invite','find'],
            required: true,
            columnName: 'requestType'
        },
        longitude: {
            type: 'float',
            columnName: 'longitude'
        },
        latitude: {
            type: 'float',
            columnName: 'latitude'
        },
        memo: {
            type: 'text',
            columnName: 'memo'
        },
        expires: {
            type: 'datetime',
            columnName: 'expires'
        },
        status: {
            type: 'string',
            enum: ['expired', 'pending', 'found', 'driving', 'denied', 'arrived', 'accepted'],
            defaultsTo: 'pending',
            columnName: 'status'
        }
    }
};

