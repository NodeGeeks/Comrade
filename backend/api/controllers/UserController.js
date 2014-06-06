/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    login: function (req, res) {
        var bcrypt = require('bcrypt');
        console.log(req.params);
        console.log(req.body);
        User.findOneByEmail(req.body.email).exec(function (err, user) {
            if (err) res.json({ error: 'DB error' }, 500);

            if (user) {
                bcrypt.compare(req.body.password, user.password, function (err, match) {
                    if (err) res.json({ error: 'Server error' }, 500);

                    if (match) {
                        // password match
                        req.session.user = user.id;
                        res.json(user);
                    } else {
                        // invalid password
                        if (req.session.user) req.session.user = null;
                        res.json({ error: 'Invalid password' }, 400);
                    }
                });
            } else {
                res.json({ error: 'User not found' }, 404);
            }
        });
    },

    signup: function (req, res) {
        console.log(req.body);
        User.create({ comradeUsername: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, password: req.body.password}).exec(function (err, user) {
            if (err) res.json({ error: 'DB error' }, 500);

            if (user) {
                res.json(user);
            } else {
                res.json({ error: 'Could not create user' }, 404);
                //TODO give better reason on why the user was unable to be created
            }
        });
    },

    loginSocialAccount: function (req, res) {
        //TODO check which social provider
        var provider = req.body.provider;
        var socialID = req.body.id;
        var socialToken = req.body.token;
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var email = req.body.email;

        if (provider == "facebook") {
            User.findOrCreate({facebook:{socialID: socialID}},{firstName: firstName, lastName: lastName, facebook:{socialID: socialID, socialToken: socialToken}, email: email }).exec(function createFindCB(err,record){
                if (record) {
                    res.json(record);
                } else if (err) {
                    if (err.code == 11000) {
                        res.forbidden('The email associated with your facebook account is already linked to a Comrade account. For security reasons please login with your other account and link your facebook account'); //TODO this should be assigned to a more specific err.code value instead of E_UNKNOWN
                    }
                    console.log(err);
                }
            });
        } else if (provider == "google") {
            User.findOrCreate({googleplus:{socialID: socialID}},{firstName: firstName, lastName: lastName, googleplus:{socialID: socialID, socialToken: socialToken}, email: email }).exec(function createFindCB(err,record){
                if (record) {
                    res.json(record);
                } else if (err) {
                    if (err.code == 11000) {
                        res.forbidden('The email associated with your Google account is already linked to a Comrade account. For security reasons please login with your other account and link your facebook account'); //TODO this should be assigned to a more specific err.code value instead of E_UNKNOWN
                    }
                    console.log(err);
                }
            });
        } else if (provider == "twitter") {
            User.findOrCreate({twitter:{socialID: socialID}},{firstName: firstName, lastName: lastName, twitter:{socialID: socialID, socialToken: socialToken}, email: email }).exec(function createFindCB(err,record){
                if (record) {
                    res.json(record);
                } else if (err) {
                    if (err.code == 11000) {
                        res.forbidden('The email associated with your Twitter account is already linked to a Comrade account. For security reasons please login with your other account and link your facebook account'); //TODO this should be assigned to a more specific err.code value instead of E_UNKNOWN
                    }
                    console.log(err);
                }
            });
        } else if (provider == "linkedin") {
            User.findOrCreate({linkedIn:{socialID: socialID}},{firstName: firstName, lastName: lastName, linkedIn:{socialID: socialID, socialToken: socialToken}, email: email }).exec(function createFindCB(err,record){
                if (record) {

                    res.json(record);
                } else if (err) {
                    if (err.code == 'E_UNKNOWN') {
                        res.forbidden('The email associated with your linkedIn account is already linked to a Comrade account. For security reasons please login with your other account and link your facebook account'); //TODO this should be assigned to a more specific err.code value instead of E_UNKNOWN
                    }
                    console.log(err);
                }
            });
        }
    },

    linkSocialAccount: function (req, res) {
        var provider = req.body.provider;
        var socialID = req.body.id;
        var socialToken = req.body.token;
        var email = req.body.email;
        console.log(req.body.socialAccount);
        //TODO verify access token
        if (provider == "facebook") {
            User.update({id: req.body.id}, { facebook:{socialID: socialID, socialToken: socialToken}, email: email } ).exec(function afterwards(err,updated){
                if (err) {
                    res.serverError("error while linking social account" +err);
                }
            });
        } else if (provider == "googleplus") {
            User.update({id: req.body.id}, { googleplus:{socialID: socialID, socialToken: socialToken}, email: email } ).exec(function afterwards(err,updated){
                if (err) {
                    res.serverError("error while linking social account" +err);
                }
            });
        } else if (provider == "twitter") {
            User.update({id: req.body.id}, { twitter:{socialID: socialID, socialToken: socialToken}, email: email } ).exec(function afterwards(err,updated){
                if (err) {
                    res.serverError("error while linking social account" +err);
                }
            });
        } else if (provider == "linkedin") {
            User.update({id: req.body.id}, { linkedIn:{socialID: socialID, socialToken: socialToken}, email: email } ).exec(function afterwards(err,updated){
                if (err) {
                    res.serverError("error while linking social account" +err);
                }
            });
        }


    }
};

