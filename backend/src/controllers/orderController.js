const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { 
      customerInfo, 
      items, 
      orderType, 
      paymentMethod, 
      notes 
    } = req.body;

    // Validate items and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: `Menu item not found: ${item.menuItemId}`
        });
      }

      if (!menuItem.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `${menuItem.name.en} is currently unavailable`
        });
      }

      const orderItem = {
        menuItem: menuItem._id,
        name: menuItem.name,
        quantity: item.quantity,
        price: menuItem.price,
        specialInstructions: item.specialInstructions || ''
      };

      orderItems.push(orderItem);
      subtotal += menuItem.price * item.quantity;

      // Update order count
      menuItem.orderCount += 1;
      await menuItem.save();
    }

    // Calculate totals
    const deliveryFee = orderType === 'delivery' ? 3.50 : 0;
    const tax = subtotal * 0.10; // 10% tax
    const total = subtotal + deliveryFee + tax;

    // Create order
    const order = await Order.create({
      customer: req.user?.id,
      customerInfo,
      items: orderItems,
      subtotal,
      deliveryFee,
      tax,
      total,
      orderType,
      paymentMethod,
      notes,
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60000) // 45 minutes
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Get all orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: { orders }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Get user orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: { orders }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('items.menuItem');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order or is admin
    if (order.customer?._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// Update order status (Admin)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // If delivered, set actual delivery time
    if (status === 'delivered') {
      order.actualDeliveryTime = new Date();
      await order.save();
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.customer?.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Can only cancel pending or confirmed orders
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order at this stage'
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    });
  }
};

// Get order statistics (Admin)
exports.getOrderStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          avgOrderValue: { $avg: '$total' }
        }
      }
    ]);

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today }
    });

    const pendingOrders = await Order.countDocuments({
      status: { $in: ['pending', 'confirmed', 'preparing'] }
    });

    res.status(200).json({
      success: true,
      data: {
        totalOrders: stats[0]?.totalOrders || 0,
        totalRevenue: stats[0]?.totalRevenue || 0,
        avgOrderValue: stats[0]?.avgOrderValue || 0,
        todayOrders,
        pendingOrders
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order stats',
      error: error.message
    });
  }
};
