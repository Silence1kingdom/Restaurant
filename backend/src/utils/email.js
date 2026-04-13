const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Send order confirmation email
exports.sendOrderConfirmation = async (order, customerEmail) => {
  try {
    const transporter = createTransporter();
    
    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name.en}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">€${item.price.toFixed(2)}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: `"koshari101" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #d4a574; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">koshari101</h1>
            <p style="color: white; margin: 5px 0;">Authentic Egyptian Street Food</p>
          </div>
          
          <div style="padding: 20px; background: #f9f9f9;">
            <h2 style="color: #333;">Thank you for your order!</h2>
            <p style="color: #666;">Order Number: <strong>${order.orderNumber}</strong></p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background: #333; color: white;">
                  <th style="padding: 10px; text-align: left;">Item</th>
                  <th style="padding: 10px; text-align: center;">Qty</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
                  <td style="padding: 10px; text-align: right;">€${order.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 10px; text-align: right;"><strong>Delivery:</strong></td>
                  <td style="padding: 10px; text-align: right;">€${order.deliveryFee.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 10px; text-align: right;"><strong>Tax:</strong></td>
                  <td style="padding: 10px; text-align: right;">€${order.tax.toFixed(2)}</td>
                </tr>
                <tr style="background: #d4a574; color: white;">
                  <td colspan="2" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
                  <td style="padding: 10px; text-align: right;"><strong>€${order.total.toFixed(2)}</strong></td>
                </tr>
              </tfoot>
            </table>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <h3 style="margin-top: 0; color: #333;">Delivery Information</h3>
              <p style="margin: 5px 0; color: #666;"><strong>Name:</strong> ${order.customerInfo.name}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Phone:</strong> ${order.customerInfo.phone}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Address:</strong> ${order.customerInfo.address.street}, ${order.customerInfo.address.city}</p>
            </div>
            
            <p style="color: #666; margin-top: 20px;">
              Estimated delivery time: <strong>45-60 minutes</strong>
            </p>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0;">koshari101 - Via Panfilo Castaldi 23, Porta Venezia, Italy</p>
            <p style="margin: 5px 0;">Phone: +39 392 475 6960</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent to:', customerEmail);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
};

// Send order status update email
exports.sendOrderStatusUpdate = async (order, customerEmail, status) => {
  try {
    const transporter = createTransporter();
    
    const statusMessages = {
      confirmed: 'Your order has been confirmed and is being prepared.',
      preparing: 'Your order is now being prepared in our kitchen.',
      ready: 'Your order is ready for pickup/delivery!',
      'out-for-delivery': 'Your order is out for delivery!',
      delivered: 'Your order has been delivered. Enjoy your meal!',
      cancelled: 'Your order has been cancelled.'
    };

    const mailOptions = {
      from: `"koshari101" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `Order Update - ${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #d4a574; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">koshari101</h1>
          </div>
          
          <div style="padding: 20px; background: #f9f9f9;">
            <h2 style="color: #333;">Order Status Update</h2>
            <p style="color: #666;">Order Number: <strong>${order.orderNumber}</strong></p>
            <p style="color: #333; font-size: 18px; margin: 20px 0;">
              ${statusMessages[status] || 'Your order status has been updated.'}
            </p>
            <p style="color: #666;">Current Status: <strong style="color: #d4a574;">${status.toUpperCase()}</strong></p>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0;">koshari101 - Via Panfilo Castaldi 23, Porta Venezia, Italy</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Status update email sent to:', customerEmail);
  } catch (error) {
    console.error('Error sending status update email:', error);
  }
};
