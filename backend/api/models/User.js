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
        linkedIn: 'json',
        foursquare: 'json',
        myspace: 'json',
        instagram: 'json',
        pinterest: 'json',
        gmail: 'json',
        yahoo: 'json',
        hotmail: 'json',
        aim: 'json',
        icloud: 'json'


    },

    beforeCreate: function (val, next) {
        var bcrypt = require('bcrypt');
        bcrypt.genSalt(10, function(err, salt) {
            if (err) return next(err);

            bcrypt.hash(val.password, salt, function(err, hash) {
                if (err) return next(err);

                val.password = hash;
                next();
            });
        });
    },

    beforeValidate: function (val, next) {
        //console.log(val);
        var bcrypt = require('bcrypt');
        var userCount = 83;
        User.count({}, function( err, count){
            userCount = count;
        });

        function randomNum(min, max) {
            return Math.random() * (max - min) + min;
        }

        var thingToEncrypt = userCount + "comrade" + randomNum(2383, 8323000023160000)+ "app" + randomNum(23,83);
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

