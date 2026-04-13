const MenuItem = require('../models/MenuItem');

// Get all menu items
exports.getAllMenuItems = async (req, res) => {
  try {
    const { category, search, isAvailable, isPopular, dietary } = req.query;
    
    let query = {};
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by availability
    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }
    
    // Filter by popular
    if (isPopular !== undefined) {
      query.isPopular = isPopular === 'true';
    }
    
    // Filter by dietary preferences
    if (dietary) {
      const dietaryFilters = dietary.split(',');
      dietaryFilters.forEach(filter => {
        query[`dietary.${filter}`] = true;
      });
    }
    
    // Search by name or description
    if (search) {
      query.$text = { $search: search };
    }

    const menuItems = await MenuItem.find(query).sort({ category: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: { menuItems }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching menu items',
      error: error.message
    });
  }
};

// Get single menu item
exports.getMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { menuItem }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching menu item',
      error: error.message
    });
  }
};

// Create menu item (Admin only)
exports.createMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: { menuItem }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating menu item',
      error: error.message
    });
  }
};

// Update menu item (Admin only)
exports.updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: { menuItem }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating menu item',
      error: error.message
    });
  }
};

// Delete menu item (Admin only)
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting menu item',
      error: error.message
    });
  }
};

// Get menu categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await MenuItem.distinct('category');
    
    const categoryData = categories.map(cat => ({
      id: cat,
      name: {
        en: cat.charAt(0).toUpperCase() + cat.slice(1),
        ar: getArabicCategoryName(cat)
      }
    }));

    res.status(200).json({
      success: true,
      data: { categories: categoryData }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// Helper function for Arabic category names
function getArabicCategoryName(category) {
  const names = {
    koshari: 'كشري',
    appetizers: 'مقبلات',
    desserts: 'حلويات',
    drinks: 'مشروبات',
    specials: 'أطباق خاصة',
    combos: 'وجبات combo'
  };
  return names[category] || category;
}

// Get popular items
exports.getPopularItems = async (req, res) => {
  try {
    const popularItems = await MenuItem.find({ isPopular: true, isAvailable: true })
      .limit(6)
      .sort({ orderCount: -1 });

    res.status(200).json({
      success: true,
      count: popularItems.length,
      data: { popularItems }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching popular items',
      error: error.message
    });
  }
};
