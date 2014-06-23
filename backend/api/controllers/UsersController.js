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
                Users.findOne({comradeUsername: req.body.email}).exec(function (err, user) {
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
            }
        });
    },

    activateAccount: function (req, res) {
        Users.update({email: req.body.email, activationToken: req.body.activationToken}, {activated: true}).exec(function aftwards(err, update){

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
                                        res.json({ error: 'Could not create user' }, 404);
                                    }
                                })
                            }
                            if (err) {
                                res.json({ error: 'Could not create user' }, 404);
                            }
                        });
                    });
                });
            });
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
                    Users.find({facebookID: socialID}).exec( function findCB(err, found) {

                        if (found.length >= 1) {
                            console.log(found);
                            Users.update({facebookID: socialID}, {accessToken: accessToken}).exec(function afterwards(err, updated) {
                                if (err) {
                                    res.serverError(err);
                                }
                                if (updated) {
                                    res.json(updated);
                                }
                            });

                        } else if (found == null || found == undefined || found.length < 1) {
                            Users.create({facebookID: socialID, firstName: firstName, lastName: lastName, accessToken: accessToken}).exec(function createdCB(err, created) {
                                if (created) {
                                    res.json(created);
                                    res.json({created: 'successfully created new user'})
                                }
                                if (err) {
                                    res.serverError(err);
                                }
                            });
                        }
                        if (err) {
                            res.json({ error: 'Could not find user' }, 404);
                        }
                    });
                } else if (provider == "google") {
                    Users.find({googleID: socialID}).exec( function findCB(err, found) {

                        if (found.length >= 1) {
                            console.log(found);
                            Users.update({googleID: socialID}, {accessToken: accessToken}).exec(function afterwards(err, updated) {
                                if (err) {
                                    res.serverError(err);
                                }
                                if (updated) {
                                    res.json(updated);
                                }
                            });

                        } else if (found == null || found == undefined || found.length < 1) {
                            Users.create({googleID: socialID, firstName: firstName, lastName: lastName, accessToken: accessToken}).exec(function createdCB(err, created) {
                                if (created) {
                                    res.json(created);
                                    res.json({created: 'successfully created new user'})
                                }
                                if (err) {
                                    res.serverError(err);
                                }
                            });
                        }
                        if (err) {
                            res.json({ error: 'Could not find user' }, 404);
                        }
                    });
                } else if (provider == "twitter") {
                    Users.find({twitterID: socialID}).exec( function findCB(err, found) {

                        if (found.length >= 1) {
                            console.log(found);
                            Users.update({twitterID: socialID}, {accessToken: accessToken}).exec(function afterwards(err, updated) {
                                if (err) {
                                    res.serverError(err);
                                }
                                if (updated) {
                                    res.json(updated);
                                }
                            });

                        } else if (found == null || found == undefined || found.length < 1) {
                            Users.create({twitterID: socialID, firstName: firstName, lastName: lastName, accessToken: accessToken}).exec(function createdCB(err, created) {
                                if (created) {
                                    res.json(created);
                                    res.json({created: 'successfully created new user'})
                                }
                                if (err) {
                                    res.serverError(err);
                                }
                            });
                        }
                        if (err) {
                            res.json({ error: 'Could not find user' }, 404);
                        }
                    });
                } else if (provider == "linkedin") {
                    Users.find({linkedInID: socialID}).exec( function findCB(err, found) {

                        if (found.length >= 1) {
                            console.log(found);
                            Users.update({linkedInID: socialID}, {accessToken: accessToken}).exec(function afterwards(err, updated) {
                                if (err) {
                                    res.serverError(err);
                                }
                                if (updated) {
                                    res.json(updated);
                                }
                            });

                        } else if (found == null || found == undefined || found.length < 1) {
                            Users.create({linkedInID: socialID, firstName: firstName, lastName: lastName, accessToken: accessToken}).exec(function createdCB(err, created) {
                                if (created) {
                                    res.json(created);
                                    res.json({created: 'successfully created new user'})
                                }
                                if (err) {
                                    res.serverError(err);
                                }
                            });
                        }
                        if (err) {
                            res.json({ error: 'Could not find user' }, 404);
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

