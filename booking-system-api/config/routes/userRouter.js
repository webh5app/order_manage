var express     = require('express'),
    verify      = require('../../app/controllers/verify'),
    userHandler = require('../../app/controllers/userHandler'),
    userRouter  = express.Router();

/* GET users listing, only permitted to admin. */
userRouter.get('/', verify.verifyOrdinaryUser, verify.verifyAdminUser, userHandler.selectAllUsers);

userRouter.get('/admins',  verify.verifyOrdinaryUser, verify.verifyAdminUser, userHandler.selectAllAdmins);

userRouter.post('/register', userHandler.register);

userRouter.post('/login', userHandler.login);

userRouter.post('/logout', userHandler.logout);

userRouter.post('/authenticate', verify.verifyOrdinaryUser, userHandler.authenticateUser);

module.exports = userRouter;
