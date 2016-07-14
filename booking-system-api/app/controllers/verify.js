var jwt    = require('jsonwebtoken'),
    config = require('../../config/config');

exports.getToken = function(user) {
    var payload = {
        _doc: {
            username: user.username,
            admin: user.admin,
            uuid: user._id
        }
    };
    return jwt.sign(payload, config.secretKey, {
        expiresIn: 3600 // 3600s = 1 hour
    });
};

exports.verifyOrdinaryUser = function(req, res, next) {
    console.log('verifyOrdinaryUser');
    console.log(req.headers);
    var token = req.query.token || req.body.token || req.headers['x-access-token'];
    if(token) {
        console.log('token exists!');
        jwt.verify(token, config.secretKey, function(err, decodedTokenPayload) {
            if(err) {
                var err = new Error('The token is not valid!');
                err.status = 401;
                next(err);
            } else {
                req.decodedTokenPayload = decodedTokenPayload;
                next();
            }
        });
    } else {
        var err = new Error('You are not authorized!');
        err.status = 401;
        next(err);
    }
};

// This middleware should be applied after verifyOrdinaryUser(...)
exports.verifyAdminUser = function(req, res, next) {
    if(req.decodedTokenPayload._doc.admin) {
        next();
    } else {
        var err = new Error('Forbidden behaviour!');
        err.status = 403;
        next(err);
    }
};

exports.authenticateUser = function(token) {
    jwt.verify(token, config.secretKey, function(err, decodedTokenPayload) {
        if(err) {
            return false;
        } else {
            // req.decodedTokenPayload = decodedTokenPayload;
            console.log(decodedTokenPayload);
            return decodedTokenPayload._doc.username;
        }
    });
};
