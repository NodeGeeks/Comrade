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
            type: 'integer',
            primaryKey: true,
            columnName: 'userID'
        },
        comradeID: {
            type: 'integer',
            columnName: 'comradeID'
        },
        comrades: {
            type: 'integer',
            defaultsTo: 0,
            columnName: 'comrades'
        }
    },

    beforeCreate: function(val, next) {

    }
};

