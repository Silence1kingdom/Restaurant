const Review = require('../models/Review');
const MenuItem = require('../models/MenuItem');

// Create review
exports.createReview = async (req, res) => {
  try {
    const { menuItemId, rating, title, comment, orderId } = req.body;

    // Check if menu item exists
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    // Create review
    const review = await Review.create({
      customer: req.user?.id,
      customerName: req.body.customerName || req.user?.name || 'Anonymous',
      menuItem: menuItemId,
      order: orderId,
      rating,
      title,
      comment
    });

    // Update menu item ratings
    const reviews = await Review.find({ menuItem: menuItemId, isApproved: true });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    menuItem.ratings.average = Math.round(avgRating * 10) / 10;
    menuItem.ratings.count = reviews.length;
    await menuItem.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: { review }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: error.message
    });
  }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const { menuItemId, page = 1, limit = 10 } = req.query;
    
    let query = { isApproved: true };
    if (menuItemId) {
      query.menuItem = menuItemId;
    }

    const reviews = await Review.find(query)
      .populate('menuItem', 'name image')
      .populate('customer', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Review.countDocuments(query);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: { reviews }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// Get single review
exports.getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('menuItem', 'name image')
      .populate('customer', 'name');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { review }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching review',
      error: error.message
    });
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check ownership
    if (review.customer?.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.comment = comment || review.comment;
    await review.save();

    // Update menu item ratings
    const menuItem = await MenuItem.findById(review.menuItem);
    const reviews = await Review.find({ menuItem: review.menuItem, isApproved: true });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    menuItem.ratings.average = Math.round(avgRating * 10) / 10;
    menuItem.ratings.count = reviews.length;
    await menuItem.save();

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: { review }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating review',
      error: error.message
    });
  }
};

// Delete review (Admin)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Update menu item ratings
    const menuItem = await MenuItem.findById(review.menuItem);
    if (menuItem) {
      const reviews = await Review.find({ menuItem: review.menuItem, isApproved: true });
      if (reviews.length > 0) {
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        menuItem.ratings.average = Math.round(avgRating * 10) / 10;
        menuItem.ratings.count = reviews.length;
      } else {
        menuItem.ratings.average = 0;
        menuItem.ratings.count = 0;
      }
      await menuItem.save();
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
};

// Approve review (Admin)
exports.approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review approved',
      data: { review }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving review',
      error: error.message
    });
  }
};

// Reply to review (Admin)
exports.replyToReview = async (req, res) => {
  try {
    const { text } = req.body;
    
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        reply: {
          text,
          repliedAt: new Date(),
          repliedBy: req.user.id
        }
      },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reply added successfully',
      data: { review }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error replying to review',
      error: error.message
    });
  }
};

// Get review stats
exports.getReviewStats = async (req, res) => {
  try {
    const stats = await Review.aggregate([
      { $match: { isApproved: true } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          rating5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
          rating4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
          rating3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
          rating2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
          rating1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || {
        totalReviews: 0,
        avgRating: 0,
        rating5: 0,
        rating4: 0,
        rating3: 0,
        rating2: 0,
        rating1: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching review stats',
      error: error.message
    });
  }
};
