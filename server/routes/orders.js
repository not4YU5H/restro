const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Public routes
router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrderById);

// Admin routes
router.get('/', orderController.getAllOrders);
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;
