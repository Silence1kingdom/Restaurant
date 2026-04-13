const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

// Create payment intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100), // Convert to cents
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber
      }
    });

    // Update order with payment intent
    order.paymentIntentId = paymentIntent.id;
    await order.save();

    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating payment intent',
      error: error.message
    });
  }
};

// Confirm payment
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update order payment status
      const order = await Order.findOneAndUpdate(
        { paymentIntentId },
        { paymentStatus: 'completed', status: 'confirmed' },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Payment confirmed',
        data: { order }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed',
        data: { status: paymentIntent.status }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error confirming payment',
      error: error.message
    });
  }
};

// Webhook for Stripe events
exports.webhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle events
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handlePaymentSuccess(paymentIntent);
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      await handlePaymentFailure(failedPayment);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};

// Handle successful payment
async function handlePaymentSuccess(paymentIntent) {
  try {
    const order = await Order.findOneAndUpdate(
      { paymentIntentId: paymentIntent.id },
      { paymentStatus: 'completed', status: 'confirmed' },
      { new: true }
    );

    if (order) {
      console.log(`Payment succeeded for order: ${order.orderNumber}`);
      // TODO: Send confirmation email
    }
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

// Handle failed payment
async function handlePaymentFailure(paymentIntent) {
  try {
    const order = await Order.findOneAndUpdate(
      { paymentIntentId: paymentIntent.id },
      { paymentStatus: 'failed' },
      { new: true }
    );

    if (order) {
      console.log(`Payment failed for order: ${order.orderNumber}`);
    }
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

// Get payment status
exports.getPaymentStatus = async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.status(200).json({
      success: true,
      data: {
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment status',
      error: error.message
    });
  }
};

// Refund payment
exports.refundPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order || !order.paymentIntentId) {
      return res.status(404).json({
        success: false,
        message: 'Order or payment not found'
      });
    }

    // Create refund
    const refund = await stripe.refunds.create({
      payment_intent: order.paymentIntentId,
      reason: 'requested_by_customer'
    });

    // Update order
    order.paymentStatus = 'refunded';
    order.status = 'cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: { refund }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing refund',
      error: error.message
    });
  }
};
