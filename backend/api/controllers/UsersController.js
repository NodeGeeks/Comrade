/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
//TODO better error reporting, use res.serveError() instead of res.json(), res.json makes the client think that it was a success, if we res.serveError then we can take advantage of the success().error() callbacks on client side AngularJS $http
module.exports = {

    checkAuthToken: function (req, res) {
        Users.find({id: req.body.id, accessToken: req.body.token}).exec(function (err, user) {
            if (user.length >= 1) {
                res.send(true);
            } else {res.send(false)}
        });
    },
    login: function (req, res) {

        var bcrypt = require('bcrypt-nodejs');
        var thingToEncrypt = "comrade" + _.random(598, 78905478) + req.body + _.random(23, 8300000000);
        var emailRegex = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);

        if (emailRegex.test(req.body.email) == true) {
            Users.findOne().where({email: req.body.email})
            .then(function (user) {
                bcrypt.compare(req.body.password, user.password, function (err, match) {
                    if (err) res.serverError({ error: 'Server error' }, 500);

                    if (match) {
                        req.session.user = user.id;
                        bcrypt.genSalt(10, function(err, salt) {
                            if (err) return next(err);

                            bcrypt.hash(thingToEncrypt, salt, function () {}, function (err, hash) {
                                if (err) return next(err);
                                var accessToken = hash;
                                Users.update({id: user.id}, {accessToken: accessToken})
                                .then(function (updated) {
                                    return res.json(updated);
                                })
                                .fail(function (err) {
                                    return res.serverError(err);
                                });
                            });
                        });
                    } else {
                        if (req.session.user) req.session.user = null;
                        res.serverError({ error: 'Invalid password' }, 401);
                    }
                });
            })
            .fail(function(err) {
                return res.serverError(err);
            });
        } else if (req.body.email) {
            Users.findOne().where({comradeUsername: req.body.email})
                .then(function (user) {
                    bcrypt.compare(req.body.password, user.password, function (err, match) {
                        if (err) res.serverError({ error: 'Server error' }, 500);

                        if (match) {
                            req.session.user = user.id;
                            bcrypt.genSalt(10, function(err, salt) {
                                if (err) return next(err);

                                bcrypt.hash(thingToEncrypt, salt, function () {}, function (err, hash) {
                                    if (err) return next(err);
                                    var accessToken = hash;
                                    Users.update({id: user.id}, {accessToken: accessToken})
                                        .then(function (updated) {
                                            return res.json(updated);
                                        })
                                        .fail(function (err) {
                                            return res.serverError(err);
                                        });
                                });
                            });
                        } else {
                            if (req.session.user) req.session.user = null;
                            res.serverError({ error: 'Invalid password' }, 401);
                        }
                    });
                })
                .fail(function(err) {
                    return res.serverError(err);
                });
        } else if (!req.body.email) {
            res.notFound('Cant log you in if we dont know who you are.');
        }
    },

    activateAccount: function (req, res) {
        Users.update({email: req.body.email, activationToken: req.body.activationToken}, {activated: true})
        .then(function (update){
            return res.json(update);
            //TODO added a response to redirect to a page on the site for successful account activation
        })
        .fail(function(err){
            return res.serverError(err);
        });
    },

    signup: function (req, res) {
        var bcrypt = require('bcrypt-nodejs');
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                res.json(err);
            }
            bcrypt.hash(req.body.password, salt, function() {} , function(err, hash) {
                if (err) {
                    res.json(err);
                }
                req.body.password = hash;
                bcrypt.genSalt(10, function(err, salt) {
                    if (err) {
                        res.json(err);
                    }
                    bcrypt.hash(hash, salt, function() {} , function(err, hash2) {
                        req.body.accessToken = hash2;
                    });
                });
                bcrypt.genSalt(10, function(err, salt) {
                    if (err) {
                        res.json(err);
                    }


                    bcrypt.hash(req.body.password, salt, function() {} , function(err, hash1) {
                        if (err) {
                            res.json(err);
                        }
                        req.body.activationToken = hash1;

                        Users.find({comradeUsername: req.body.username}).exec( function findCB(err, found) {

                            if (found.length >= 1) {
                                res.json({exists: 'this username already exists', errorCode: 'USERNAME_EXISTS'})
                            } else if (found ==  null || found == undefined || found.length < 1) {
                                Users.find({email: req.body.email}).exec( function findCB(err, found) {
                                    if (found.length >= 1) {
                                        res.json({exists: 'this email already exists', errorCode: 'EMAIL_EXISTS'})
                                    } else if (found ==  null || found == undefined || found.length < 1) {
                                        Users.create({ comradeUsername: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, password: req.body.password, accessToken: req.body.accessToken, activationToken: req.body.activationToken}).exec(function aftwards(err, user) {
                                            if (user) {
                                                console.log('this is the first time this user has been created ', user);
                                                var mailOptions = {
                                                    from: 'aaron@teknologenie.com',
                                                    to: req.body.email,
                                                    subject: 'Comrade Account Verficiation',
                                                    text: 'In order to use your Comrade account please follow the link bellow to verify your email address and activate your account /n /n https://comradeapp.com/users/activate?email='+req.body.email+'&activationToken='+hash1+''
                                                };
                                                var nodemailer = require("nodemailer");
                                                var transport = nodemailer.createTransport("direct", {debug: true});
                                                transport.sendMail(mailOptions, function(error, response){
                                                    if(error){
                                                        console.log(error);
                                                        return;
                                                    }

                                                    // response.statusHandler only applies to 'direct' transport
                                                    response.statusHandler.once("failed", function(data){
                                                        console.log(
                                                            "Permanently failed delivering message to %s with the following response: %s",
                                                            data.domain, data.response);
                                                    });

                                                    response.statusHandler.once("requeue", function(data){
                                                        console.log("Temporarily failed delivering message to %s", data.domain);
                                                    });

                                                    response.statusHandler.once("sent", function(data){
                                                        console.log("Message was accepted by %s", data.domain);
                                                    });
                                                });
                                                res.json(user);

                                            } else if (err) {
                                                res.json({ error: 'Could not create user' }, 404);
                                            }
                                        });
                                    }
                                    if (err) {
                                        res.json({ error: 'Could not create hash' }, 404);
                                    }
                                })
                            }
                            if (err) {
                                res.json(err);
                            }
                        });
                    });
                });
            });
        });

    },

    logout: function (req, res) {
        Users.update({id: req.body.id, accessToken:req.body.accessToken}, { accessToken: 'invalid'} )
        .then(function (updated){
            return res.json(updated);
        })
        .failed(function(err) {
            return res.serverError(err);
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
                    Users.find().where({facebookID: socialID})
                    .then( function (found) {

                        if (found.length >= 1) {
                            Users.update({facebookID: socialID}, {accessToken: accessToken})
                            .then(function (updated) {
                                return res.json(updated);
                            })
                            .fail(function(err){
                                return res.serverError(err);
                            });

                        } else if (found == null || found == undefined || found.length < 1) {
                            Users.create({facebookID: socialID, firstName: firstName, lastName: lastName, accessToken: accessToken})
                            .then(function (created) {
                                return res.json(created);
                            })
                            .fail(function(err){
                                return res.serverError(err);
                            });
                        }
                    })
                    .fail(function(err){
                        return res.serverError(err);
                    });
                } else if (provider == "google") {
                    Users.find().where({googleID: socialID})
                        .then( function (found) {

                            if (found.length >= 1) {
                                Users.update({googleID: socialID}, {accessToken: accessToken})
                                    .then(function (updated) {
                                        return res.json(updated);
                                    })
                                    .fail(function(err){
                                        return res.serverError(err);
                                    });

                            } else if (found == null || found == undefined || found.length < 1) {
                                Users.create({googleID: socialID, firstName: firstName, lastName: lastName, accessToken: accessToken})
                                    .then(function (created) {
                                        return res.json(created);
                                    })
                                    .fail(function(err){
                                        return res.serverError(err);
                                    });
                            }
                        })
                        .fail(function(err){
                            return res.serverError(err);
                        });
                } else if (provider == "twitter") {
                    Users.find().where({twitterID: socialID})
                        .then( function (found) {

                            if (found.length >= 1) {
                                Users.update({twitterID: socialID}, {accessToken: accessToken})
                                    .then(function (updated) {
                                        return res.json(updated);
                                    })
                                    .fail(function(err){
                                        return res.serverError(err);
                                    });

                            } else if (found == null || found == undefined || found.length < 1) {
                                Users.create({twitterID: socialID, firstName: firstName, lastName: lastName, accessToken: accessToken})
                                    .then(function (created) {
                                        return res.json(created);
                                    })
                                    .fail(function(err){
                                        return res.serverError(err);
                                    });
                            }
                        })
                        .fail(function(err){
                            return res.serverError(err);
                        });
                } else if (provider == "linkedin") {
                    Users.find().where({linkedInID: socialID})
                        .then( function (found) {

                            if (found.length >= 1) {
                                Users.update({linkedInID: socialID}, {accessToken: accessToken})
                                    .then(function (updated) {
                                        return res.json(updated);
                                    })
                                    .fail(function(err){
                                        return res.serverError(err);
                                    });

                            } else if (found == null || found == undefined || found.length < 1) {
                                Users.create({linkedInID: socialID, firstName: firstName, lastName: lastName, accessToken: accessToken})
                                    .then(function (created) {
                                        return res.json(created);
                                    })
                                    .fail(function(err){
                                        return res.serverError(err);
                                    });
                            }
                        })
                        .fail(function(err){
                            return res.serverError(err);
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
            Users.update({id: id, accessToken:token}, { facebookID: socialID} )
            .then(function (updated){
                return res.json(updated);
            })
            .failed(function(err) {
                return res.serverError(err);
            });
        } else if (provider == "google") {
            Users.update({id: id, accessToken:token}, { googleID: socialID} )
            .then(function (updated){
                return res.json(updated);
            })
            .failed(function(err) {
                return res.serverError(err);
            });
        } else if (provider == "twitter") {
            Users.update({id: id, accessToken:token}, { twitterID: socialID} )
            .then(function (updated){
                return res.json(updated);
            })
            .failed(function(err) {
                return res.serverError(err);
            });
        } else if (provider == "linkedin") {
            Users.update({id: id, accessToken:token}, { linkedInID: socialID} )
            .then(function (updated){
                return res.json(updated);
            })
            .failed(function(err) {
                return res.serverError(err);
            });
        }
    }
};

