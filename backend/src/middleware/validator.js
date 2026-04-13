const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }
  next();
};

// Register validation
exports.validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone')
    .optional()
    .trim()
    .isMobilePhone().withMessage('Please provide a valid phone number'),
  handleValidationErrors
];

// Login validation
exports.validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

// Order validation
exports.validateOrder = [
  body('customerInfo.name')
    .trim()
    .notEmpty().withMessage('Customer name is required'),
  body('customerInfo.phone')
    .trim()
    .notEmpty().withMessage('Phone number is required'),
  body('customerInfo.address.street')
    .trim()
    .notEmpty().withMessage('Street address is required'),
  body('items')
    .isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.menuItemId')
    .notEmpty().withMessage('Menu item ID is required'),
  body('items.*.quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('paymentMethod')
    .notEmpty().withMessage('Payment method is required')
    .isIn(['card', 'cash', 'paypal']).withMessage('Invalid payment method'),
  handleValidationErrors
];

// Review validation
exports.validateReview = [
  body('menuItemId')
    .notEmpty().withMessage('Menu item ID is required'),
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .notEmpty().withMessage('Comment is required')
    .isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters'),
  handleValidationErrors
];

// Menu item validation
exports.validateMenuItem = [
  body('name.en')
    .trim()
    .notEmpty().withMessage('English name is required'),
  body('name.ar')
    .trim()
    .notEmpty().withMessage('Arabic name is required'),
  body('description.en')
    .trim()
    .notEmpty().withMessage('English description is required'),
  body('description.ar')
    .trim()
    .notEmpty().withMessage('Arabic description is required'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['koshari', 'appetizers', 'desserts', 'drinks', 'specials', 'combos'])
    .withMessage('Invalid category'),
  body('image')
    .notEmpty().withMessage('Image URL is required'),
  handleValidationErrors
];

// Payment validation
exports.validatePayment = [
  body('orderId')
    .notEmpty().withMessage('Order ID is required'),
  handleValidationErrors
];
