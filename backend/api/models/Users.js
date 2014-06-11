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
        phoneNumber: {
            type: 'integer',
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
            defaultsTo: 'false',
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
        facebookToken: {
            type: 'string',
            columnName: 'facebookToken'
        },
        twitterID: {
            type: 'string',
            columnName: 'twitterID'
        },
        twitterToken: {
            type: 'string',
            columnName: 'twitterToken'
        },
        googleID: {
            type: 'string',
            columnName: 'googleID'
        },
        googleToken: {
            type: 'string',
            columnName: 'googleToken'
        },
        linkedInID: {
            type: 'string',
            columnName: 'linkedInID'
        },
        linkedInToken: {
            type: 'string',
            columnName: 'linkedInToken'
        }
    },

    toJSON: function() {
        var data = this.toObject();
        delete data.password;
        return data;
    },

    beforeCreate: function (val, next) {
        var bcrypt = require('bcrypt-nodejs');
        if (val.password) {
            bcrypt.genSalt(10, function(err, salt) {
                if (err) return next(err);

                bcrypt.hash(val.password, salt, function() {} , function(err, hash) {
                    if (err) return next(err);
                    val.password = hash;
                });
            });
        } else if (!val.password) {
           next();
        }

        if (val.email) {
            var mailOptions = {
                from: 'aaron@teknologenie.com',
                to: val.email,
                subject: 'Comrade Account Verficiation',
                text: 'In order to use your Comrade account please follow the link bellow to verify your email address and activate your account /n /n https://comradeapp.com/users/activate?email='+val.email+'&activationToken='+hash+''
            };
            var mail = require("nodemailer").mail;
            mail(mailOptions);
            next();
        }

    },

    afterCreate: function (val, next) {
        //nothing yet
    }
};

