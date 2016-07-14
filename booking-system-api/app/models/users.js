var mongoose              = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose'),
    Schema                = mongoose.Schema;

var UserSchema = new Schema({
    admin: {
        type: Boolean,
        default: false
    },
    phoneNumber: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
