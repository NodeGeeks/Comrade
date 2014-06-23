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
    }
};

