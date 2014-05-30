/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {
        comradeUsername: {
            type: 'string',
            unique: true,
            required: true
        },
        firstName: {
            type: 'string',
            required: true
        },
        lastName: {
            type: 'string',
            required: true
        },
        phoneNumber: {
            type: 'integer',
            unique: true
        },
        email: {
            type: 'email',
            unique: true,
            required: true
        },
        activated: {
            type: 'boolean',
            defaultsTo: 'false'
        },
        password: 'STRING',
        accessToken: 'STRING',
        socialAccounts: 'JSON'
    },

    beforeCreate: function (val, next) {
        var bcrypt = require('bcrypt');
        //TODO check if user needs to be generated a comradeUsername or if one is already there
        bcrypt.genSalt(10, function(err, salt) {
            if (err) return next(err);

            bcrypt.hash(val.password, salt, function(err, hash) {
                if (err) return next(err);

                val.password = hash;
                next();
            });
        });
    },

    afterCreate: function (val, next) {
        //TODO send a welcome email to the user
    }
};

