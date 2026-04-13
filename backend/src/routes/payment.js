const express = require('express');
const router = express.Router();
const { 
  createPaymentIntent, 
  confirmPayment, 
  webhook, 
  getPaymentStatus,
  refundPayment 
} = require('../controllers/paymentController');
const { protect, adminOnly } = require('../middleware/auth');
const { validatePayment } = require('../middleware/validator');

// Stripe webhook (raw body needed)
router.post('/webhook', express.raw({ type: 'application/json' }), webhook);

// Protected routes
router.post('/create-intent', protect, validatePayment, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);
router.get('/status/:paymentIntentId', protect, getPaymentStatus);

// Admin only
router.post('/refund', protect, adminOnly, refundPayment);

module.exports = router;
