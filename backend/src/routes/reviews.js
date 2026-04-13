const express = require('express');
const router = express.Router();
const { 
  createReview, 
  getAllReviews, 
  getReview, 
  updateReview, 
  deleteReview,
  approveReview,
  replyToReview,
  getReviewStats
} = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/auth');
const { validateReview } = require('../middleware/validator');

// Public routes
router.get('/', getAllReviews);
router.get('/stats', getReviewStats);
router.get('/:id', getReview);

// Protected routes
router.post('/', protect, validateReview, createReview);
router.put('/:id', protect, updateReview);

// Admin only routes
router.delete('/:id', protect, adminOnly, deleteReview);
router.put('/:id/approve', protect, adminOnly, approveReview);
router.put('/:id/reply', protect, adminOnly, replyToReview);

module.exports = router;
