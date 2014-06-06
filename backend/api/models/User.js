/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    tableName: 'comrade_users',
    attributes: {
        comradeUsername: {
            type: 'string',
            unique: false
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
            unique: true
        },
        activated: {
            type: 'boolean',
            defaultsTo: 'false'
        },
        password: 'STRING',
        accessToken: 'STRING',
        facebook: 'json',
        twitter: 'json',
        googleplus: 'json',
        linkedIn: 'json'

    },

    toJSON: function() {
        var data = this.toObject();
        delete data.password;
        return data;
    },

    beforeCreate: function (val, next) {
        var isUnique = null;
        User.findOneByEmail(val.email).done(function(err, user) {
            if (user) {
                console.log(user);
                isUnique = false;
            }

        });
        var bcrypt = require('bcrypt');
        bcrypt.genSalt(10, function(err, salt) {
            if (err) return next(err);

            bcrypt.hash(val.password, salt, function(err, hash) {
                if (err) return next(err);

                val.password = hash;
                if (isUnique == true) next();
                if (isUnique == false) return next(err);
            });
        });
    },

    beforeValidate: function (val, next) {

        var bcrypt = require('bcrypt');
        User.count({}, function( err, count){
            userCount = count;
        });

        function randomNum(min, max) {
            return Math.random() * (max - min) + min;
        };

        var thingToEncrypt = "316HTYTHR33" + "comrade" + randomNum(2383, 8323000023160000)+ "app" + randomNum(23,83) + "CREATION";
        bcrypt.genSalt(10, function(err, salt) {
            if (err) return next(err);

            bcrypt.hash(thingToEncrypt, salt, function(err, hash) {
                if (err) return next(err);

                val.accessToken = hash;
                val.password = hash;
                next();
            });
        });





    },

    afterCreate: function (val, next) {
        //nothing yet
    }
};

