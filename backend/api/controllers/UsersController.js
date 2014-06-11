/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
//TODO better error reporting, use res.serveError() instead of res.json(), res.json makes the client think that it was a success, if we res.serveError then we can take advantage of the success().error() callbacks on client side AngularJS $http
module.exports = {
    login: function (req, res) {
        var bcrypt = require('bcrypt-nodejs');
        Users.findOneByEmail(req.body.email).exec(function (err, user) {
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
        Users.create({ comradeUsername: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, password: req.body.password}).exec(function (err, user) {
            if (err) res.json({ error: 'DB error' }, 500);

            if (user) {
                res.json(user);
            } else {
                res.json({ error: 'Could not create user' }, 404);
                //TODO give better reason on why the user was unable to be created
            }
        });
    },

    logout: function (req, res) {
        Users.update({id: req.body.id}, {accessToken: 'invalid'}).exec(function afterwards(err,updated){
            if (err) {
                res.json(err);
            }
            if (updated) {
                res.json({success: 'updated'});
            }
        });
    },

    loginSocialAccount: function (req, res) {
        var provider = req.body.provider;
        var socialID = req.body.id;
        var socialToken = req.body.token;
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var accessToken = "invalidFromLogin";
        var bcrypt = require('bcrypt-nodejs');
        function randomNum(min, max) {
            return Math.random() * (max - min) + min;
        };

        var thingToEncrypt = socialToken + "comrade" + randomNum(598, 78905478) + socialID + randomNum(23, 8300000000);
        bcrypt.genSalt(10, function(err, salt) {
            if (err) return next(err);

            bcrypt.hash(thingToEncrypt, salt, function() {} , function(err, hash) {
                if (err) return next(err);
                accessToken = hash;
                if (provider == "facebook") {
                    //TODO findOrCreate does not receive a callback on the first run through (the create part), therefore we need to do a workaround but doing the old fashion check if the value exists if not create it.
                    Users.findOrCreate({facebookID: socialID},{firstName: firstName, lastName: lastName, facebookID: socialID, facebookToken: socialToken, accessToken: accessToken}).exec(function createFindCB(err,record){
                        debugger;
                        if (record) {
                            res.json(record);
                        }
                        if (err) {
                            console.log(err);
                        }
                    });
                } else if (provider == "google") {
                    Users.findOrCreate({googleID: socialID},{firstName: firstName, lastName: lastName, googleID: socialID, googleToken: socialToken, accessToken: accessToken}).exec(function createFindCB(err,record){
                        if (record) {
                            res.json(record);
                        } else if (err) {
                            console.log(err);
                        }
                    });
                } else if (provider == "twitter") {
                    Users.findOrCreate({twitterID: socialID},{firstName: firstName, lastName: lastName, twitterID: socialID, twitterToken: socialToken, accessToken: accessToken}).exec(function createFindCB(err,record){
                        if (record) {
                            res.json(record);
                        } else if (err) {
                            console.log(err);
                        }
                    });
                } else if (provider == "linkedin") {
                    Users.findOrCreate({linkedInID: socialID},{firstName: firstName, lastName: lastName, linkedInID: socialID, linkedInToken: socialToken, accessToken: accessToken}).exec(function createFindCB(err,record){
                        if (record) {

                            res.json(record);
                        } else if (err) {
                            console.log(err);
                        }
                    });
                }
            });
        });
    },

    linkSocialAccount: function (req, res) {
        var provider = req.body.provider;
        var socialID = req.body.socialID;
        var socialToken = req.body.socialToken;
        var id = req.body.id;
        var token = req.body.token;
        if (provider == "facebook") {
            Users.update({id: id, accessToken:token}, { facebookID: socialID, facebookToken: socialToken } ).exec(function afterwards(err,updated){
                if (err) {
                    res.json(err);
                }
                if (updated) {
                    res.json(updated);
                }
            });
        } else if (provider == "google") {
            Users.update({id: id, accessToken:token}, { googleID: socialID, googleToken: socialToken } ).exec(function afterwards(err,updated){

                if (err) {
                    res.json(err);
                }
                if (updated) {
                    res.json(updated);
                }
            });
        } else if (provider == "twitter") {
            Users.update({id: id, accessToken:token}, { twitterID: socialID, twitterToken: socialToken } ).exec(function afterwards(err,updated){
                if (err) {
                    res.json(err);
                }
                if (updated) {
                    res.json(updated);
                }
            });
        } else if (provider == "linkedin") {
            Users.update({id: id, accessToken:token}, { linkedInID: socialID, linkedInToken: socialToken } ).exec(function afterwards(err,updated){
                if (err) {
                    res.json(err);
                }
                if (updated) {
                    res.json(updated);
                }
            });
        }


    }
};

