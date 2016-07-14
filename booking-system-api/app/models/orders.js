var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var H5_schema = new Schema({
    username: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
    },
    principal: {
        type: String,
        default: ""
    },
    department: {
        type: String,
        default: ""
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    usage: {
        type: String,
        required: true
    },
    deadline_design: {
        type: String,
        required: true
    },
    deadline_it: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
    collection: 'h5_orders'
});

var H5_model = mongoose.model('h5_order', H5_schema);

module.exports.h5 = H5_model;
