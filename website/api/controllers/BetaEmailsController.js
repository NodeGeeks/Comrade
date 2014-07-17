/**
 * BetaEmailsController
 *
 * @description :: Server-side logic for managing betaemails
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	betasignup: function (req,res) {
        BetaEmails.find({email: req.body.email})
        .then( function findCB(found) {
            console.log(req.body.email);
            if (found.length >= 1) {
                res.json({exists: 'this email already exists', errorCode: 'EMAIL_EXISTS'})
            } else if (found == null || found == undefined || found.length < 1) {
                BetaEmails.create({email: req.body.email})
                    .then(function (created1) {
                        return res.json(created1);
                    })
                    .fail(function (err) {
                        return res.serverError(err);
                    });
            }
        })
        .fail(function (err) {
            return res.serverError(err);
        });
    }
};

