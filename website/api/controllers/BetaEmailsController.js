/**
 * BetaEmailsController
 *
 * @description :: Server-side logic for managing betaemails
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	betasignup: function (req,res) {
        BetaEmails.create({email: req.body.email})
        .then(function (created1){
            return res.json(created1);
        })
        .fail(function(err) {
            return res.serverError(err);
        });
    }
};

