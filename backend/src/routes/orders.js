const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getAllOrders, 
  getMyOrders, 
  getOrder, 
  updateStatus, 
  cancelOrder,
  getOrderStats
} = require('../controllers/orderController');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');
const { validateOrder } = require('../middleware/validator');

// Create order (optional auth for guest checkout)
router.post('/', optionalAuth, validateOrder, createOrder);

// User routes
router.get('/my-orders', protect, getMyOrders);
router.get('/stats', protect, adminOnly, getOrderStats);
router.get('/:id', protect, getOrder);
router.put('/:id/cancel', protect, cancelOrder);

// Admin routes
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateStatus);

module.exports = router;
