/**
 * EventsController
 *
 * @description :: Server-side logic for managing Events
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    events: function(req, res) {
        if (!req.body.userID || !req.body.accessToken ) {
            res.serverError('No ID or Token found, are you sure your logged in?')
        } else {
            Events.find({userID: req.body.userID}).exec(function afterwards(err, found) {
                if (found) {
                    res.json(found);
                }
                if (err) {
                    res.serverError(err);
                }

            });
        }
    },
    createEvent: function(req, res) {
        Events.create({userID: req.body.userID }).exec(function afterwards(err, found) {
            if (found) {
                res.json(found);
            }
            if (err) {
                res.serverError(err);
            }

        });
    },
    inviteComrades: function(req, res) {

    },
    sharePlace: function(req, res) {

    }
	
};

