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
            //TODO check if the ID exists already
            User.findOrCreate({facebook:{socialID: socialID}},{firstName: firstName, lastName: lastName, facebook:{socialID: socialID, socialToken: socialToken}, email: email }).exec(function createFindCB(err,record){
                if (record) {
                    res.json(record);
                } else if (err.code == 'ER_DUP_ENTRY') {
                    res.json( {error: 'Email address in use'}, 409);
                    //TODO let the user know they already have
                }
            });
        } else if (provider == "google") {
            User.findOrCreate({googleplus:{socialID: socialID}},{firstName: firstName, lastName: lastName, googleplus:{socialID: socialID, socialToken: socialToken}, email: email }).exec(function createFindCB(err,record){
                if (record) {
                    res.json(record);
                } else if (err.code == 'ER_DUP_ENTRY') {
                    res.json({error: 'Email address in use'}, 409);
                    //TODO fix this and get ER_DUP_ENTRY working properly
                } else if (err.code == 'E_UNKNOWN') {
                    res.json({error: 'Something wierd happened, we dunno either. Contact support'}, 500);
                }
                console.log(err.code);
            });
        } else if (provider == "twitter") {

        } else if (provider == "linkedin") {

        } else if (provider == "instagram") {

        } else if (provider == "yahoo") {

        } else if (provider == "flickr") {

        } else if (provider == "foursquare") {

        }

    },

    linkSocialAccount: function (req, res) {
        var provider = req.body.socialAccount.provider;
        console.log(req.body.socialAccount);
        //TODO verify access token
        User.update({id: req.body.id}, {socialAccounts: {provider: {provider: req.body.socialAccount.provider, id: req.body.socialAccount.id, token: req.body.socialAccount.token}} } ).exec(function afterwards(err,updated){

            if (err) {
                console.log(err);
                // handle error here- e.g. `res.serverError(err);`
                return;
            }

            console.log('Updated user to have name '+updated[0].name);
        });
    }
};

