var passport = require('passport'),
    User     = require('../../app/models/users'),
    verify   = require('../../app/controllers/verify');

module.exports = {
    selectAllUsers: function(req, res, next) {
        User.find({}, function(err, users) {
            if(err) {
                var err = new Error('Unknown error when GET all users');
                err.status = 500;
                return next(err);
            }

            return res.json({
                requestAt: new Date(),
                requestSucceed: true,
                users: users
            });
        });
    },

    selectAllAdmins: function(req, res, next) {
        User.find({admin: true}, function(err, admins) {
            if(err) {
                var err = new Error('Unknown error when GET admins');
                err.status = 500;
                return next(err);
            }

            return res.json({
                requestAt: new Date(),
                requestSucceed: true,
                admins: admins
            });
        });
    },

    register: function(req, res, next) {
        User.register(new User({
            username: req.body.username,
            admin: (req.body.admin || false)
        }), req.body.password, function(err) {
            if(err) {
                var err = new Error('Unknown error when registering!');
                err.status = 500;
                next(err);
            } else {
                // To double check the new user's info is already stored in the databse correctly
                passport.authenticate('local')(req, res, function() {
                    res.json({
                        requestAt: new Date(),
                        requestSucceed: true
                    });
                });
            }
        });
    },

    login: function(req, res, next) {
        passport.authenticate('local', function(err, user) {
            if (err) { return next(err); }
            if (!user) { return res.redirect('/login'); }

            req.logIn(user, function(err) {
                if (err) { return next(err); }

                var token = verify.getToken(user);
                res.json({
                    requestAt: new Date(),
                    requestSucceed: true,
                    token: token,
                    username: user.username
                });
            });
        })(req, res, next);
    },

    logout: function(req, res, next) {
        req.logout();
        res.json({
            requestAt: new Date(),
            requestSucceed: true
        });
    },

    authenticateUser: function(req, res, next) {
        res.json({
            requestAt: new Date(),
            requestSucceed: true,
            username: req.decodedTokenPayload._doc.username
        });
    }
};
