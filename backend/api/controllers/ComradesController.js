/**
 * ComradesController
 *
 * @description :: Server-side logic for managing Comrades
 * @help        :: See http://links.sailsjs.org/docs/controllers
 *
 */

module.exports = {
    comrades: function(req, res) {
        if (!req.body.userID || !req.body.accessToken ) {
            res.serverError('No ID or Token found, are you sure your logged in?')
        } else {
            Comrades.find({comradeID: req.body.userID, comrades: 'accepted'}).exec(function afterwards(err, found) {
                if (found) {
                    res.json(found);
                }
                if (err) {
                    res.serverError(err);
                }

            });
        }
    },
	sendComradesRequest: function (req, res) {
        Comrades.create({userID: req.body.userID, comradesID: req.body.comradesID, comrades: 'accepted'}).exec(function aftwards(err, created){
            if (created) {
                res.json(created);
                Comrades.create({userID: req.body.comradesID, comradesID: req.body.userID, comrades: 'pending'}).exec(function aftwards(err, created){
                    if (created) {
                        res.json(created);

                    }
                    if (err) {
                        res.serverError(err);
                    }
                });
            }
            if (err) {
                res.serverError(err);
            }
        });
    },
    acceptComradesRequest: function (req, res) {
        Comrades.update({userID: req.body.userID, comradesID: req.body.comradesID}, {comrades: 'accepted'}).exec(function aftwards(err, update){
            if (update) {
                res.json(update);
            }
            if (err) {
                res.serverError(err);
            }
        });
    },
    denyComradesRequest: function (req, res) {
        Comrades.update({userID: req.body.userID, comradesID: req.body.comradesID}, {comrades: 'denied'}).exec(function aftwards(err, update){
            if (update) {
                res.json(update);
                Comrades.update({userID: req.body.comradesID, comradesID: req.body.userID}, {comrades: 'denied'}).exec(function aftwards(err, update){
                    if (update) {
                        res.json(update);
                    }
                    if (err) {
                        res.serverError(err);
                    }
                });
            }
            if (err) {
                res.serverError(err);
            }
        });
    },
    ignoreComradesRequest: function (req, res) {
        Comrades.update({userID: req.body.userID, comradesID: req.body.comradesID}, {comrades: 'ignored'}).exec(function aftwards(err, update){
            if (update) {
                res.json(update);

            }
            if (err) {
                res.serverError(err);
            }
        });
    },
    blockComrade: function (req, res) {
        Comrades.update({userID: req.body.userID, comradesID: req.body.comradesID}, {comrades: 'blocked'}).exec(function aftwards(err, update){
            if (update) {
                res.json(update);
            }
            if (err) {
                res.serverError(err);
            }
        });
    }
};

