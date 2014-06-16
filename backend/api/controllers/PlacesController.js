/**
 * PlacesController
 *
 * @description :: Server-side logic for managing Places
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    places: function(req, res) {
        if (!req.body.userID || !req.body.accessToken ) {
            res.serverError('No ID or Token found, are you sure your logged in?')
        } else {

            Places.findOne({userID: req.body.userID}).exec(function afterwards(err, found) {
                if (found) {
                    res.json(found);
                }
                if (err) {
                    res.serverError(err);
                }

            });
        }
    },
    inviteComrades: function(req, res) {
        Places.findOne({userID: req.body.userID}).exec(function afterwards(err, found) {
            if (found) {
                res.json(found);
            }
            if (err) {
                res.serverError(err);
            }

        });
    },
    addPlace: function(req, res) {
        Places.create({userID: req.body.userID, }).exec(function afterwards(err, created){

        });
    },
    removePlace: function(req, res) {

    }
};

