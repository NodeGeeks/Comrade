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
        var thingToEncrypt = "comrade" + _.random(598, 78905478) + req.body.username + _.random(23, 8300000000);
        Users.findOne({email: req.body.email}).exec(function (err, user) {
            if (err) res.serverError({ error: 'DB error' }, 500);

            if (user) {
                bcrypt.compare(req.body.password, user.password, function (err, match) {
                    if (err) res.serverError({ error: 'Server error' }, 500);

                    if (match) {
                        req.session.user = user.id;
                        bcrypt.genSalt(10, function(err, salt) {
                            if (err) return next(err);

                            bcrypt.hash(thingToEncrypt, salt, function () {}, function (err, hash) {
                                if (err) return next(err);
                                var accessToken = hash;
                                Users.update({id: user.id}, {accessToken: accessToken}).exec(function afterwards(err, updated) {
                                    if (err) {
                                        res.serverError(err);
                                    }
                                    if (updated) {
                                        res.json(updated);
                                    }
                                });
                            });
                        });
                    } else {
                        if (req.session.user) req.session.user = null;
                        res.serverError({ error: 'Invalid password' }, 401);
                    }
                });
            } else {
                res.json({ error: 'User not found' }, 404);
            }
        });
    },

    activateAccount: function (req, res) {
        Users.update({email: req.body.email, activationToken: req.body.activationToken}, {activated: true}).exec(function aftwards(err, update){

        });
    },

    signup: function (req, res) {
        Users.create({ comradeUsername: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, password: req.body.password}).exec(function (err, user) {

            if (user) {
                res.json(user);
            } else if (err) {
                res.serverError({ error: 'Could not create user' }, 404);
                //TODO give better reason on why the user was unable to be created
            }
        });

    },

    logout: function (req, res) {
        Users.update({id: req.body.id}, {accessToken: 'invalid'}).exec(function afterwards(err,updated){
            if (err) {
                res.serverError(err);
            }
            if (updated) {
                res.json({success: 'updated'});
            }
        });
    },

    loginSocialAccount: function (req, res) {
        var provider = req.body.provider;
        var socialID = req.body.socialID;
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var accessToken = "invalidFromLogin";
        var bcrypt = require('bcrypt-nodejs');
        var thingToEncrypt = "comrade" + _.random(598, 78905478) + socialID + _.random(23, 8300000000);
        bcrypt.genSalt(10, function(err, salt) {
            if (err) return next(err);

            bcrypt.hash(thingToEncrypt, salt, function() {} , function(err, hash) {
                if (err) return next(err);
                accessToken = hash;
                if (provider == "facebook") {
                    //TODO findOrCreate does not receive a callback on the first run through (the create part), therefore we need to do a workaround but doing the old fashion check if the value exists if not create it.
                    Users.findOrCreate({facebookID: socialID},{firstName: firstName, lastName: lastName, facebookID: socialID, accessToken: accessToken}).exec(function createFindCB(err,record){
                        if (record) {
                            Users.update({facebookID: socialID}, {accessToken: accessToken}).exec(function afterwards(err,updated){
                                if (err) {
                                    res.serverError(err);
                                }
                                if (updated) {
                                    res.json(updated);
                                }
                            });
                        }
                        if (err ) {
                            res.serverError(err);
                        }
                    });
                } else if (provider == "google") {
                    Users.findOrCreate({googleID: socialID},{firstName: firstName, lastName: lastName, googleID: socialID, accessToken: accessToken}).exec(function createFindCB(err,record){
                        if (record) {
                            Users.update({googleID: socialID}, {accessToken: accessToken}).exec(function afterwards(err,updated){
                                if (err) {
                                    res.serverError(err);
                                }
                                if (updated) {
                                    res.json(updated);
                                }
                            });
                        } else if (err) {
                            res.serverError(err);
                        }
                    });
                } else if (provider == "twitter") {
                    Users.findOrCreate({twitterID: socialID},{firstName: firstName, lastName: lastName, twitterID: socialID, accessToken: accessToken}).exec(function createFindCB(err,record){
                        if (record) {
                            Users.update({twitterID: socialID}, {accessToken: accessToken}).exec(function afterwards(err,updated){
                                if (err) {
                                    res.json(err);
                                }
                                if (updated) {
                                    res.json(updated);
                                }
                            });
                        } else if (err) {
                            res.serverError(err);
                        }
                    });
                } else if (provider == "linkedin") {
                    Users.findOrCreate({linkedInID: socialID},{firstName: firstName, lastName: lastName, linkedInID: socialID, accessToken: accessToken}).exec(function createFindCB(err,record){
                        if (record) {
                            Users.update({linkedInID: socialID}, {accessToken: accessToken}).exec(function afterwards(err,updated){
                                if (err) {
                                    res.json(err);
                                }
                                if (updated) {
                                    res.json(updated);
                                }
                            });
                        } else if (err) {
                            res.serverError(err);
                        }
                    });
                }
            });
        });
    },

    linkSocialAccount: function (req, res) {
        var provider = req.body.provider;
        var socialID = req.body.socialID;
        var id = req.body.id;
        var token = req.body.token;
        if (provider == "facebook") {
            Users.update({id: id, accessToken:token}, { facebookID: socialID} ).exec(function afterwards(err,updated){
                if (err) {
                    res.serverError(err);
                }
                if (updated) {
                    res.json(updated);
                }
            });
        } else if (provider == "google") {
            Users.update({id: id, accessToken:token}, { googleID: socialID} ).exec(function afterwards(err,updated){

                if (err) {
                    res.serverError(err);
                }
                if (updated) {
                    res.json(updated);
                }
            });
        } else if (provider == "twitter") {
            Users.update({id: id, accessToken:token}, { twitterID: socialID} ).exec(function afterwards(err,updated){
                if (err) {
                    res.serverError(err);
                }
                if (updated) {
                    res.json(updated);
                }
            });
        } else if (provider == "linkedin") {
            Users.update({id: id, accessToken:token}, { linkedInID: socialID} ).exec(function afterwards(err,updated){
                if (err) {
                    res.serverError(err);
                }
                if (updated) {
                    res.json(updated);
                }
            });
        }


    }
};

