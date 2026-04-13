const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    en: { type: String, required: [true, 'Please provide English name'] },
    ar: { type: String, required: [true, 'Please provide Arabic name'] }
  },
  description: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: true,
    enum: ['koshari', 'appetizers', 'desserts', 'drinks', 'specials', 'combos']
  },
  image: {
    type: String,
    required: true
  },
  ingredients: [{
    en: String,
    ar: String
  }],
  dietary: {
    vegetarian: { type: Boolean, default: false },
    vegan: { type: Boolean, default: false },
    glutenFree: { type: Boolean, default: false },
    spicy: { type: Boolean, default: false }
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  preparationTime: {
    type: Number,
    default: 15 // minutes
  },
  calories: {
    type: Number
  },
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  orderCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp
menuItemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for search
menuItemSchema.index({ 'name.en': 'text', 'description.en': 'text' });

module.exports = mongoose.model('MenuItem', menuItemSchema);
