var H5Orders = require('../models/orders').h5;

module.exports = {
    selectAllOrders: function(req, res, next) {
        if(req.decodedTokenPayload._doc.admin) {
            H5Orders.find({}, function(err, orders) {
                if(err) {
                    var err = new Error('Unknown error when GET all h5 orders!');
                    err.status = 500;
                    return next(err);
                }

                return res.json({
                    requestSucceed: true,
                    requestAt: new Date(),
                    orders: orders
                });
            });
        } else {
            H5Orders.find({userId: req.decodedTokenPayload._doc.uuid}, function(err, orders) {
                if(err) {
                    var err = new Error('Unknown error when GET all h5 orders!');
                    err.status = 500;
                    return next(err);
                }

                return res.json({
                    requestSucceed: true,
                    requestAt: new Date(),
                    orders: orders
                });
            });
        }

    },

    retrieveOneOrder: function(req, res, next) {
        H5Orders.findById(req.params.orderId, function(err, order) {
            if(err) {
                var err = new Error('Unknown error when GET a specific h5 order!');
                err.status = 500;
                return next(err);
            }

            return res.json({
                requestSucceed: true,
                requestAt: new Date(),
                order: order
            });
        });
    },

    selectOrdersOfOneDepartment: function(req, res, next) {
        H5Orders.find({department: req.params.dName}, function(err, orders) {
            if(err) {
                var err = new Error('Unknown error when GET h5 orders under a department!');
                err.status = 500;
                return next(err);
            }

            return res.json({
                requestSucceed: true,
                requestAt: new Date(),
                orders: orders
            });
        });
    },

    createNewOrder: function(req, res, next) {
        req.body.username = req.decodedTokenPayload._doc.username;
        req.body.userId = req.decodedTokenPayload._doc.uuid;
        H5Orders.create(req.body, function(err, order) {
            if(err) {
                console.log(err);
                var err = new Error('Unknown error when POST a new h5 order!');
                err.status = 500;
                return next(err);
            }

            var id = order._id;
            return res.json({
                requestSucceed: true,
                requestAt: new Date(),
                order: order
            });
        });
    },

    updateOneOrder: function(req, res, next) {
        if(req.decodedTokenPayload._doc.admin) {
            H5Orders.findOneAndUpdate(
                {_id: req.params.orderId},
                { $set: req.body },
                { new: true }
            ).exec(function(err, updatedOrder) {
                if(err) {
                    var err = new Error('Unknown error when PUT(update) a specific h5 order!');
                    err.status = 500;
                    return next(err);
                }

                if(!updatedOrder) {
                    var err = new Error('Did not find that h5 order!')
                    err.status = 500;
                    return next(err);
                }

                return res.json({
                    requestSucceed: true,
                    requestAt: new Date(),
                    order: updatedOrder
                });
            });
        } else {
            H5Orders.findOneAndUpdate(
                {_id: req.params.orderId, userId: req.decodedTokenPayload._doc.uuid},
                { $set: req.body },
                { new: true }
            ).exec(function(err, updatedOrder) {
                if(err) {
                    var err = new Error('Unknown error when PUT(update) a specific h5 order!');
                    err.status = 500;
                    return next(err);
                }

                if(!updatedOrder) {
                    var err = new Error('Forbidden! You are not authorized to modify this doc, it is not created by you!')
                    err.status = 403;
                    return next(err);
                }

                return res.json({
                    requestSucceed: true,
                    requestAt: new Date(),
                    order: updatedOrder
                });
            });
        }
    },

    deleteAllOrders: function(req, res, next) {
        H5Orders.remove({}, function(err, resp) {
            if(err) {
                var err = new Error('Unknown error when DELETE all orders!');
                err.status = 500;
                return next(err);
            }

            return res.json({
                requestSucceed: true,
                requestAt: new Date(),
                info: resp
            });
        });
    },

    deleteOneOrder: function(req, res, next) {
        if(req.decodedTokenPayload._doc.admin) {
            H5Orders.findOneAndRemove({
                _id: req.params.orderId,
            }).exec(function(err, deletedOrder) {
                if(err) {
                    var err = new Error('Unknown error when DELETE a specific h5 order!');
                    err.status = 500;
                    return next(err);
                }

                if(!deletedOrder) {
                    var err = new Error('Did not find that h5 order!')
                    err.status = 500;
                    return next(err);
                }

                return res.json({
                    requestSucceed: true,
                    requestAt: new Date(),
                    info: deletedOrder
                });
            });
        } else {
            H5Orders.findOneAndRemove({
                _id: req.params.orderId,
                userId: req.decodedTokenPayload._doc.uuid
            }).exec(function(err, deletedOrder) {
                if(err) {
                    var err = new Error('Unknown error when DELETE a specific h5 order!');
                    err.status = 500;
                    return next(err);
                }

                if(!deletedOrder) {
                    var err = new Error('Forbidden! You are not authorized to delete this doc, it is not created by you!')
                    err.status = 403;
                    return next(err);
                }

                return res.json({
                    requestSucceed: true,
                    requestAt: new Date(),
                    info: deletedOrder
                });
            });
        }
    },

    deleteOrdersOfOneDepartment: function(req, res, next) {
        H5Orders.remove({department: req.params.dName}, function(err, resp) {
            if(err) {
                var err = new Error('Unknown error when DELETE h5 orders under a department!');
                err.status = 500;
                return next(err);
            }

            return res.json({
                requestSucceed: true,
                requestAt: new Date(),
                info: resp
            });
        });
    }
};
