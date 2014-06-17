/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    tableName: 'users',
    schema: true,
    attributes: {
        comradeUsername: {
            type: 'string',
            unique: true,
            columnName: 'comradeUsername'
        },
        firstName: {
            type: 'string',
            required: true,
            columnName: 'firstName'
        },
        lastName: {
            type: 'string',
            required: true,
            columnName: 'lastName'
        },
        photoURL: {
            type: 'string',
            columnName: 'photoURL'
        },
        phoneNumber: {
            type: 'int',
            unique: true,
            columnName: 'phoneNumber'
        },
        email: {
            type: 'email',
            unique: true,
            columnName: 'email'
        },
        activated: {
            type: 'boolean',
            defaultsTo: false,
            columnName: 'activated'
        },
        password: {
            type: 'string',
            columnName: 'password'
        },
        accessToken: {
            type: 'string',
            required: true,
            defaultsTo: 'invalid',
            columnName: 'accessToken'
        },
        activationToken: {
            type: 'string',
            columnName: 'activationToken'
        },
        facebookID: {
            type: 'string',
            columnName: 'facebookID'
        },
        twitterID: {
            type: 'string',
            columnName: 'twitterID'
        },
        googleID: {
            type: 'string',
            columnName: 'googleID'
        },
        linkedInID: {
            type: 'string',
            columnName: 'linkedInID'
        },
        toJSON: function() {
            var obj = this.toObject();
            delete obj.activationToken;
            delete obj.password;
            return obj;
        }
    },

    beforeCreate: function (val, next) {
        var bcrypt = require('bcrypt-nodejs');
        if (val.password) {
            console.log(val.password);
            bcrypt.genSalt(10, function(err, salt) {
                if (err) return next(err);

                bcrypt.hash(val.password, salt, function() {} , function(err, hash) {
                    if (err) return next(err);
                    val.password = hash;
                    bcrypt.genSalt(10, function(err, salt) {
                        if (err) return next(err);
                        bcrypt.hash(hash, salt, function() {} , function(err, hash2) {
                            val.accessToken = hash2;
                            console.log(hash2);
                        });
                    });
                    if (val.email) {

                        bcrypt.genSalt(10, function(err, salt) {
                            if (err) return next(err);

                            bcrypt.hash(val.password, salt, function() {} , function(err, hash1) {
                                if (err) return next(err);
                                val.activationToken = hash1;
                                next();
                                var mailOptions = {
                                    from: 'aaron@teknologenie.com',
                                    to: val.email,
                                    subject: 'Comrade Account Verficiation',
                                    text: 'In order to use your Comrade account please follow the link bellow to verify your email address and activate your account /n /n https://comradeapp.com/users/activate?email='+val.email+'&activationToken='+hash1+''
                                };
                                var mail = require("nodemailer").mail;
                                mail(mailOptions, function(err) {
                                    console.log(err);
                                    console.log('activation email sent to '+val.email);

                                });
                            });
                        });
                    } else if (!val.email) {
                        next();
                    }
                });
            });
        } else if (!val.password) {
           next();
        }


    },

    afterCreate: function (val, next) {
        //TODO after user is created, if it was done with a social account check which socialID of that provider exists and make them Comrades, also notify the end user that they gained a new Comrade
    }
};

