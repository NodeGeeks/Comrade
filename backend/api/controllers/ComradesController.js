/**
 * ComradesController
 *
 * @description :: Server-side logic for managing Comrades
 * @help        :: See http://links.sailsjs.org/docs/controllers
 *
 */

module.exports = {
    comrades: function(req, res) {
        Comrades.find().where({comradeID: req.body.id, comrades: 'approved'})
            .then(function (found) {
                return res.json(found);
            })
            .fail(function(err) {
                return res.serverError(err);
            });
    },
    pendingComradesRequests: function (req, res) {
        Comrades.find().where({userID: req.body.id, comrades: 'pending'})
        .then(function (found) {
            return res.json(found);
        })
        .fail(function(err) {
            return res.serverError(err);
        });
    },
	sendComradesRequest: function (req, res) {

        var emailRegex = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
        var intRegex = new RegExp(/^\d+$/);
        //TODO create a var that strips all dashes or () from a phone number if passed
        var val = req.body.value;
        if (emailRegex.test(val) == true) {
            Users.findOne().where({email: val})
            .then(function (found) {
                Comrades.create({userID: req.body.id, comradeID: found.id, comradesFullName: found.firstName +" "+ found.lastName, comrades: 'approved'})
                .then(function (created){
                    Comrades.create({userID: found.id, comradeID: req.body.id, comradesFullName: req.body.fullName, comrades: 'pending'})
                    .then(function (created1){
                        return res.json(created1);
                    })
                    .fail(function(err) {
                        return res.serverError(err);
                    });
                })
                .fail(function(err) {
                    return res.serverError(err);
                });
            })
            .fail(function(err){
                return res.serverError(err);
            });
        } else if (intRegex.test(val) == true) {
            console.log('looks like a phone number to me');
            Users.findOne()
                .where({phoneNumber: val})
                .then(function (found) {
                    Comrades.create({userID: req.body.id, comradeID: found.id, comrades: 'approved'})
                        .then(function (created){
                            Comrades.create({userID: found.id, comradeID: req.body.id, comrades: 'pending'})
                                .then(function (created1){
                                    return res.json(created1);
                                })
                                .fail(function(err) {
                                    return res.serverError(err);
                                });
                        })
                        .fail(function(err) {
                            return res.serverError(err);
                        });
                })
                .fail(function(err){
                    return res.serverError(err);
                });
        } else if (val) {
            console.log('just a normal username');
            Users.findOne()
                .where({comradeUsername: val})
                .then(function (found) {
                    Comrades.create({userID: req.body.id, comradeID: found.id, comrades: 'sent'})
                        .then(function (created){
                            Comrades.create({userID: found.id, comradeID: req.body.id, comrades: 'pending'})
                                .then(function (created1){
                                    return res.json(created1);
                                })
                                .fail(function(err) {
                                    return res.serverError(err);
                                });
                        })
                        .fail(function(err) {
                            return res.serverError(err);
                        });
                })
                .fail(function(err){
                    return res.serverError(err);
                });
        } else if (!val) {
            res.notFound('Could not find someone with no data, did you forget to type something perhaps?');
        }


    },
    acceptComradesRequest: function (req, res) {
        Comrades.update({userID: req.body.userID, comradesID: req.body.comradesID}, {comrades: 'approved'})
            .then(function (updated){
                Comrades.update({userID: req.body.comradesID, comradesID: req.body.userID}, {comrades: 'approved'})
                    .then(function (updated){
                        res.json(updated);
                    })
                    .fail(function(err){
                        res.serverError(err);
                    });
            })
            .fail(function(err) {
                return res.serverError(err);
            });
    },
    denyComradesRequest: function (req, res) {
        Comrades.update({userID: req.body.userID, comradesID: req.body.comradesID}, {comrades: 'i-denied'})
        .then(function (updated){
                Comrades.update({userID: req.body.comradesID, comradesID: req.body.userID}, {comrades: 'denied'})
                .then(function (updated){
                    res.json(updated);
                })
                .fail(function(err){
                    res.serverError(err);
                });
        })
        .fail(function(err) {
            return res.serverError(err);
        });

    },
    ignoreComradesRequest: function (req, res) {
        Comrades.update({userID: req.body.userID, comradesID: req.body.comradesID}, {comrades: 'i-ignored'})
            .then(function (updated){
                Comrades.update({userID: req.body.comradesID, comradesID: req.body.userID}, {comrades: 'ignored'})
                    .then(function (updated){
                        res.json(updated);
                    })
                    .fail(function(err){
                        res.serverError(err);
                    });
            })
            .fail(function(err) {
                return res.serverError(err);
            });
    },
    blockComrade: function (req, res) {
        Comrades.update({userID: req.body.userID, comradesID: req.body.comradesID}, {comrades: 'i-blocked'})
            .then(function (updated){
                Comrades.update({userID: req.body.comradesID, comradesID: req.body.userID}, {comrades: 'blocked'})
                    .then(function (updated){
                        res.json(updated);
                    })
                    .fail(function(err){
                        res.serverError(err);
                    });
            })
            .fail(function(err) {
                return res.serverError(err);
            });
    }
};

