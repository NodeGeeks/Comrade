/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    tableName: 'comrade_users',
    schema: true,
    syncable: true,
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
        password: {
            type: 'string',
            required: true
        },
        accessToken: {
            type: 'string',
            required: true
        },
        activationToken: {
            type: 'string'
        },
        facebookID: {
            type: 'string',
            unique: true
        },
        facebookToken: {
            type: 'string'
        },
        twitterID: {
            type: 'string',
            unique: true
        },
        twitterToken: {
            type: 'string'
        },
        googleID: {
            type: 'string',
            unique: true
        },
        googleToken: {
            type: 'string'
        },
        linkedInID: {
            type: 'string',
            unique: true
        },
        linkedInToken: {
            type: 'string'
        }


    },

    toJSON: function() {
        var data = this.toObject();
        delete data.password;
        return data;
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
        function randomNum(min, max) {
            return Math.random() * (max - min) + min;
        };
        var thingToEncrypt = "TOKEN" + "comrade" + randomNum(598, 78905478) + "ACTIVATION";
        if (val.activated !== true && val.email) {
            bcrypt.genSalt(10, function(err, salt) {
                if (err) return next(err);

                bcrypt.hash(thingToEncrypt, salt, function(err, hash) {
                    if (err) return next(err);

                    val.activationToken = hash;
                    var mailOptions = {
                        from: 'aaron@teknologenie.com',
                        to: val.email,
                        subject: 'Comrade Account Verficiation',
                        text: 'In order to use your Comrade account please follow the link bellow to verify your email address and activate your account /n /n https://comradeapp.com/user/activate?email='+val.email+'&activationToken='+hash+''
                    };
                    var mail = require("nodemailer").mail;
                    mail(mailOptions);
                    next();
                });
            });
        } else {
            next(); //in case of social login
        }
    },

    beforeValidate: function (val, next) {

        var bcrypt = require('bcrypt');

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

