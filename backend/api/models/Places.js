/**
* Places.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    tableName: 'places',
    schema: true,
    attributes: {
        userID: {
            type: 'string',
            required: true,
            columnName: 'userID'
        },
        name: {
            type: 'string',
            required: true,
            columnName: 'name'
        },
        longitude: {
            type: 'float',
            columnName: 'longitude'
        },
        latitude: {
            type: 'float',
            columnName: 'latitude'
        },
        address: {
            type: 'string',
            columnName: 'address'
        },
        postal: {
            type: 'int',
            columnName: 'postal'
        },
        description: {
            type: 'text',
            columnName: 'description'
        },
        visitCount: {
            type: 'int',
            columnName: 'visitCount'
        },
        photoURL: {
            type: 'string',
            columnName: 'photoURL'
        }
    },

    beforeCreate: function(val, next) {

    }
};

