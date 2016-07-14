var express     = require('express');
var orderRouter = express.Router();
var verify = require('../../app/controllers/verify');
var orderHandler = require('../../app/controllers/orderHandler');

orderRouter.route('/h5')
.get(verify.verifyOrdinaryUser, orderHandler.selectAllOrders)
.post(verify.verifyOrdinaryUser, orderHandler.createNewOrder)
.delete(verify.verifyOrdinaryUser, verify.verifyAdminUser, orderHandler.deleteAllOrders);

orderRouter.route('/h5/:orderId')
.get(verify.verifyOrdinaryUser, orderHandler.retrieveOneOrder)
.put(verify.verifyOrdinaryUser, orderHandler.updateOneOrder)
.delete(verify.verifyOrdinaryUser, orderHandler.deleteOneOrder);

orderRouter.route('/h5/department/:dName')
.get(verify.verifyOrdinaryUser, orderHandler.selectOrdersOfOneDepartment)
.delete(verify.verifyOrdinaryUser, verify.verifyAdminUser, orderHandler.deleteOrdersOfOneDepartment);

module.exports = orderRouter;
