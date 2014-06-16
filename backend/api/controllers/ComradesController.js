/**
 * ComradesController
 *
 * @description :: Server-side logic for managing Comrades
 * @help        :: See http://links.sailsjs.org/docs/controllers
 *
 * `status` codes are as follows
 *  0 = pending
 *  1 = accepted
 *  2 = declined
 *  3 = ignored
 *  4 = blocked
 *
 */

module.exports = {

	sendComradesRequest: function (req, res) {
        Comrades.create({userID: req.body.userID, comradesID: req.body.comradesID, comrades: 1}).exec(function aftwards(err, update){

        });
    },
    acceptComradesRequest: function (req, res) {
        Comrades.update({userID: req.body.userID, comradesID: req.body.comradesID}, {comrades: 1}).exec(function aftwards(err, update){

        });
    },
    declineComradesRequest: function (req, res) {
        Comrades.update({userID: req.body.userID, comradesID: req.body.comradesID}, {comrades: 2}).exec(function aftwards(err, update){

        });
    },
    ignoreComradesRequest: function (req, res) {
        Comrades.update({userID: req.body.userID, comradesID: req.body.comradesID}, {comrades: 3}).exec(function aftwards(err, update){

        });
    },
    blockComrade: function (req, res) {
        Comrades.update({userID: req.body.userID, comradesID: req.body.comradesID}, {comrades: 4}).exec(function aftwards(err, update){

        });
    }
};

