const express = require('express');
const router = express.Router();
const { 
  getAllMenuItems, 
  getMenuItem, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem,
  getCategories,
  getPopularItems
} = require('../controllers/menuController');
const { protect, adminOnly } = require('../middleware/auth');
const { validateMenuItem } = require('../middleware/validator');

// Public routes
router.get('/', getAllMenuItems);
router.get('/categories', getCategories);
router.get('/popular', getPopularItems);
router.get('/:id', getMenuItem);

// Admin only routes
router.post('/', protect, adminOnly, validateMenuItem, createMenuItem);
router.put('/:id', protect, adminOnly, validateMenuItem, updateMenuItem);
router.delete('/:id', protect, adminOnly, deleteMenuItem);

module.exports = router;
