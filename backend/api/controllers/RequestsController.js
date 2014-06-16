/**
 * RequestsController
 *
 * @description :: Server-side logic for managing Requests
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    requests: function(req, res) {
        if (!req.body.userID || !req.body.accessToken ) {
            res.serverError('No ID or Token found, are you sure your logged in?')
        } else {

            Requests.findOne({userID: req.body.userID}).exec(function afterwards(err, found) {
                if (found) {
                    res.json(found);
                }
                if (err) {
                    res.serverError(err);
                }

            });
        }
    },

    invite: function(req,res) {
        var curTimestamp = new _.now();
        var willExpireAt = req.body.expires + curTimestamp;
        Requests.create({userID: req.body.userID, comradeID: req.body.comradeID, requestType: 'invite', memo: req.body.memo, expires: willExpireAt, latitude: req.body.latitude, longitude: req.body.longitude}).exec(function afterwards(err,created){
            if (created) {
                res.json(created);
            }
            if (err) {
                res.serverError(err);
            }
        });
    },

    find: function(req,res) {
        var curTimestamp = new _.now();
        var willExpireAt = req.body.expires + curTimestamp;
        Requests.create({userID: req.body.userID, comradeID: req.body.comradeID, requestType: 'find', memo: req.body.memo, expires: willExpireAt}).exec(function afterwards(err,created){

        });
    },

    respondToFind: function(req,res) {
        var curTimestamp = new _.now();
        var willExpireAt = req.body.expires + curTimestamp;
        Requests.update({userID: req.body.comradeID, comradeID: req.body.userID, requestType: 'find'}, {status: req.body.status, expires: willExpireAt, latitude: req.body.latitude, longitude: req.body.longitude}).exec(function afterwards(err,created){
            if (created) {
                res.json(created);
            }
            if (err) {
                res.serverError(err);
            }
        });
    },

    respondToInvite: function(req,res) {
        Requests.update({userID: req.body.comradeID, comradeID: req.body.userID, requestType: 'invite'}, {status: req.body.status}).exec(function afterwards(err,created){
            if (created) {
                res.json(created);
            }
            if (err) {
                res.serverError(err);
            }
        });
    }

};

