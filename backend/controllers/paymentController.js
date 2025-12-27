import pool from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import axios from 'axios';
import crypto from 'crypto';
import { sendOrderConfirmationEmail } from '../utils/email.js';

/**
 * Initialize Monetbil payment
 */
export const initiatePayment = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const userId = req.user.id;

  // Get order
  const [orders] = await pool.execute(
    `SELECT o.*, u.email, u.name, u.phone
     FROM orders o
     JOIN users u ON o.userId = u.id
     WHERE o.id = ? AND o.userId = ? AND o.status = 'pending'`,
    [orderId, userId]
  );

  if (orders.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Order not found or already processed'
    });
  }

  const order = orders[0];

  // Check if payment already exists
  const [existingPayments] = await pool.execute(
    'SELECT id FROM payments WHERE orderId = ? AND status IN ("pending", "completed")',
    [orderId]
  );

  if (existingPayments.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Payment already initiated for this order'
    });
  }

  // Monetbil configuration
  const monetbilConfig = {
    serviceKey: process.env.MONETBIL_SERVICE_KEY,
    serviceSecret: process.env.MONETBIL_SERVICE_SECRET,
    returnUrl: process.env.MONETBIL_RETURN_URL || `${process.env.FRONTEND_URL}/payment/return`,
    notifyUrl: process.env.MONETBIL_NOTIFY_URL || `${process.env.BACKEND_URL}/api/payments/webhook`,
  };

  if (!monetbilConfig.serviceKey || !monetbilConfig.serviceSecret) {
    return res.status(500).json({
      success: false,
      message: 'Payment gateway not configured'
    });
  }

  // Create payment record
  const [paymentResult] = await pool.execute(
    `INSERT INTO payments (orderId, userId, paymentMethod, amount, currency, status)
     VALUES (?, ?, 'monetbil', ?, 'XAF', 'pending')`,
    [orderId, userId, order.totalAmount]
  );

  const paymentId = paymentResult.insertId;

  // Prepare Monetbil payment data
  const paymentData = {
    item_ref: order.orderNumber,
    item_name: `Commande NatureVita - ${order.orderNumber}`,
    amount: order.totalAmount,
    currency: 'XAF',
    return_url: monetbilConfig.returnUrl,
    notify_url: monetbilConfig.notifyUrl,
    cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
    payment_ref: `PAY-${paymentId}-${Date.now()}`,
    country: 'CM',
    email: order.email,
    phone: order.phone || '',
    logo: `${process.env.FRONTEND_URL}/logo.png`,
  };

  // Generate signature
  const signatureString = Object.keys(paymentData)
    .sort()
    .map(key => `${key}=${paymentData[key]}`)
    .join('&');
  const signature = crypto
    .createHmac('sha256', monetbilConfig.serviceSecret)
    .update(signatureString)
    .digest('hex');

  paymentData.signature = signature;

  // Call Monetbil API
  try {
    const response = await axios.post('https://api.monetbil.com/v1/payment', paymentData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data && response.data.payment_url) {
      // Update payment with transaction ID
      await pool.execute(
        'UPDATE payments SET transactionId = ?, monetbilId = ? WHERE id = ?',
        [paymentData.payment_ref, response.data.transaction_id || null, paymentId]
      );

      // Log activity
      await pool.execute(
        'INSERT INTO activity_logs (userId, action, entityType, entityId, description) VALUES (?, ?, ?, ?, ?)',
        [userId, 'payment_initiated', 'payment', paymentId, `Payment initiated for order ${order.orderNumber}`]
      );

      res.json({
        success: true,
        data: {
          paymentUrl: response.data.payment_url,
          transactionId: paymentData.payment_ref
        }
      });
    } else {
      throw new Error('Invalid response from payment gateway');
    }
  } catch (error) {
    // Update payment status to failed
    await pool.execute(
      'UPDATE payments SET status = ?, errorMessage = ? WHERE id = ?',
      ['failed', error.message, paymentId]
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to initiate payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Monetbil webhook handler
 */
export const monetbilWebhook = asyncHandler(async (req, res) => {
  const {
    transaction_id,
    payment_ref,
    status,
    amount,
    currency,
    item_ref,
  } = req.body;

  // Verify signature
  const signature = req.body.signature;
  const signatureString = Object.keys(req.body)
    .filter(key => key !== 'signature')
    .sort()
    .map(key => `${key}=${req.body[key]}`)
    .join('&');
  
  const expectedSignature = crypto
    .createHmac('sha256', process.env.MONETBIL_SERVICE_SECRET)
    .update(signatureString)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(400).json({
      success: false,
      message: 'Invalid signature'
    });
  }

  // Find payment by transaction ID or payment_ref
  const [payments] = await pool.execute(
    `SELECT p.*, o.orderNumber, o.userId, o.status as orderStatus
     FROM payments p
     JOIN orders o ON p.orderId = o.id
     WHERE p.transactionId = ? OR p.monetbilId = ?`,
    [payment_ref, transaction_id]
  );

  if (payments.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found'
    });
  }

  const payment = payments[0];

  // Update payment status
  const paymentStatus = status === 'success' ? 'completed' : status === 'failed' ? 'failed' : 'pending';
  
  await pool.execute(
    `UPDATE payments 
     SET status = ?, monetbilId = ?, metadata = ?, updatedAt = NOW()
     WHERE id = ?`,
    [
      paymentStatus,
      transaction_id,
      JSON.stringify(req.body),
      payment.id
    ]
  );

  // If payment successful, update order
  if (paymentStatus === 'completed' && payment.orderStatus === 'pending') {
    await pool.execute(
      `UPDATE orders 
       SET status = 'paid', 
           paymentStatus = 'completed',
           paymentMethod = 'monetbil',
           paymentId = ?
       WHERE id = ?`,
      [transaction_id, payment.orderId]
    );

    // Get order details for email
    const [orderDetails] = await pool.execute(
      `SELECT o.*, u.email, u.name
       FROM orders o
       JOIN users u ON o.userId = u.id
       WHERE o.id = ?`,
      [payment.orderId]
    );

    const [orderItems] = await pool.execute(
      `SELECT oi.*, p.name as productName
       FROM order_items oi
       JOIN products p ON oi.productId = p.id
       WHERE oi.orderId = ?`,
      [payment.orderId]
    );

    // Send confirmation email
    if (orderDetails.length > 0) {
      const order = orderDetails[0];
      order.shippingAddress = order.shippingAddress 
        ? JSON.parse(order.shippingAddress) 
        : null;

      sendOrderConfirmationEmail(
        { email: order.email, name: order.name },
        order,
        orderItems,
        'fr'
      ).catch(err => console.error('Failed to send confirmation email:', err));
    }

    // Create notification
    await pool.execute(
      `INSERT INTO notifications (userId, type, title, message, link)
       VALUES (?, ?, ?, ?, ?)`,
      [
        payment.userId,
        'order_paid',
        'Paiement confirmé',
        `Votre commande ${payment.orderNumber} a été payée avec succès.`,
        `/orders/${payment.orderId}`
      ]
    );

    // Log activity
    await pool.execute(
      'INSERT INTO activity_logs (userId, action, entityType, entityId, description) VALUES (?, ?, ?, ?, ?)',
      [payment.userId, 'payment_completed', 'payment', payment.id, `Payment completed for order ${payment.orderNumber}`]
    );
  }

  res.json({
    success: true,
    message: 'Webhook processed'
  });
});

/**
 * Get payment status
 */
export const getPaymentStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id;

  const [payments] = await pool.execute(
    `SELECT p.*, o.orderNumber
     FROM payments p
     JOIN orders o ON p.orderId = o.id
     WHERE p.orderId = ? AND p.userId = ?`,
    [orderId, userId]
  );

  if (payments.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found'
    });
  }

  const payment = payments[0];
  payment.metadata = payment.metadata ? JSON.parse(payment.metadata) : null;

  res.json({
    success: true,
    data: { payment }
  });
});

