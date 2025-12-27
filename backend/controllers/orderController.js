import pool from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendOrderConfirmationEmail } from '../utils/email.js';

/**
 * Create order from cart
 */
export const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { shippingAddress, notes, promoCode } = req.body;

  // Verify user email is verified
  const [users] = await pool.execute(
    'SELECT id, email, name, isEmailVerified FROM users WHERE id = ?',
    [userId]
  );

  if (users.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const user = users[0];

  if (!user.isEmailVerified) {
    return res.status(400).json({
      success: false,
      message: 'Please verify your email before placing an order'
    });
  }

  // Get cart items
  const [cartItems] = await pool.execute(
    `SELECT 
      c.id,
      c.quantity,
      p.id as productId,
      p.name,
      p.price,
      p.stock,
      p.isActive
    FROM carts c
    JOIN products p ON c.productId = p.id
    WHERE c.userId = ? AND p.isActive = TRUE`,
    [userId]
  );

  if (cartItems.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Cart is empty'
    });
  }

  // Validate stock and calculate totals
  let subtotal = 0;
  let discount = 0;
  let discountValue = 0;

  for (const item of cartItems) {
    if (item.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${item.name}. Only ${item.stock} available.`
      });
    }
    subtotal += item.price * item.quantity;
  }

  // Apply promo code if provided
  if (promoCode) {
    const [promoCodes] = await pool.execute(
      `SELECT * FROM promo_codes 
       WHERE code = ? 
       AND isActive = TRUE 
       AND (validFrom IS NULL OR validFrom <= NOW())
       AND (validUntil IS NULL OR validUntil >= NOW())
       AND (usageLimit IS NULL OR usedCount < usageLimit)`,
      [promoCode]
    );

    if (promoCodes.length > 0) {
      const promo = promoCodes[0];
      
      if (promo.minPurchase && subtotal < promo.minPurchase) {
        return res.status(400).json({
          success: false,
          message: `Minimum purchase of ${promo.minPurchase} FCFA required for this promo code`
        });
      }

      if (promo.discountType === 'percentage') {
        discountValue = (subtotal * promo.discountValue) / 100;
        if (promo.maxDiscount) {
          discountValue = Math.min(discountValue, promo.maxDiscount);
        }
      } else {
        discountValue = promo.discountValue;
      }

      discount = discountValue;
    }
  }

  const tax = 0; // No tax for now
  const shippingCost = 0; // Free shipping for now
  const totalAmount = subtotal - discount + tax + shippingCost;

  // Create order
  const [orderResult] = await pool.execute(
    `INSERT INTO orders 
     (userId, totalAmount, subtotal, tax, shippingCost, discount, promoCode, shippingAddress, notes, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [
      userId,
      totalAmount,
      subtotal,
      tax,
      shippingCost,
      discount,
      promoCode || null,
      JSON.stringify(shippingAddress),
      notes || null
    ]
  );

  const orderId = orderResult.insertId;

  // Get order number
  const [orders] = await pool.execute(
    'SELECT orderNumber FROM orders WHERE id = ?',
    [orderId]
  );
  const orderNumber = orders[0].orderNumber;

  // Create order items and update stock
  for (const item of cartItems) {
    const subtotalItem = item.price * item.quantity;

    await pool.execute(
      'INSERT INTO order_items (orderId, productId, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?)',
      [orderId, item.productId, item.quantity, item.price, subtotalItem]
    );

    // Update stock
    await pool.execute(
      'UPDATE products SET stock = stock - ? WHERE id = ?',
      [item.quantity, item.productId]
    );
  }

  // Update promo code usage
  if (promoCode) {
    await pool.execute(
      'UPDATE promo_codes SET usedCount = usedCount + 1 WHERE code = ?',
      [promoCode]
    );
  }

  // Clear cart
  await pool.execute('DELETE FROM carts WHERE userId = ?', [userId]);

  // Log activity
  await pool.execute(
    'INSERT INTO activity_logs (userId, action, entityType, entityId, description) VALUES (?, ?, ?, ?, ?)',
    [userId, 'order_created', 'order', orderId, `Order ${orderNumber} created`]
  );

  // Get order with items for email
  const [orderItems] = await pool.execute(
    `SELECT 
      oi.*,
      p.name as productName
    FROM order_items oi
    JOIN products p ON oi.productId = p.id
    WHERE oi.orderId = ?`,
    [orderId]
  );

  const order = {
    id: orderId,
    orderNumber,
    totalAmount,
    subtotal,
    discount,
    paymentMethod: null,
    status: 'pending'
  };

  // Send confirmation email (async, don't wait)
  sendOrderConfirmationEmail(user, order, orderItems, 'fr').catch(err => 
    console.error('Failed to send order confirmation email:', err)
  );

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: {
      order: {
        id: orderId,
        orderNumber,
        totalAmount,
        status: 'pending'
      }
    }
  });
});

/**
 * Get user orders
 */
export const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10, status } = req.query;

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = parseInt(limit);

  let query = `
    SELECT 
      o.id,
      o.orderNumber,
      o.totalAmount,
      o.status,
      o.paymentStatus,
      o.paymentMethod,
      o.createdAt
    FROM orders o
    WHERE o.userId = ?
  `;

  const params = [userId];

  if (status) {
    query += ' AND o.status = ?';
    params.push(status);
  }

  query += ' ORDER BY o.createdAt DESC LIMIT ? OFFSET ?';
  params.push(limitNum, offset);

  const [orders] = await pool.execute(query, params);

  // Get total count
  let countQuery = 'SELECT COUNT(*) as total FROM orders WHERE userId = ?';
  const countParams = [userId];

  if (status) {
    countQuery += ' AND status = ?';
    countParams.push(status);
  }

  const [countResult] = await pool.execute(countQuery, countParams);
  const total = countResult[0].total;

  res.json({
    success: true,
    data: {
      orders,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    }
  });
});

/**
 * Get single order
 */
export const getOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const [orders] = await pool.execute(
    `SELECT 
      o.*,
      u.name as customerName,
      u.email as customerEmail
    FROM orders o
    JOIN users u ON o.userId = u.id
    WHERE o.id = ? AND o.userId = ?`,
    [id, userId]
  );

  if (orders.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  const order = orders[0];

  // Get order items
  const [orderItems] = await pool.execute(
    `SELECT 
      oi.*,
      p.name as productName,
      p.slug as productSlug,
      p.imageUrl as productImage
    FROM order_items oi
    JOIN products p ON oi.productId = p.id
    WHERE oi.orderId = ?`,
    [id]
  );

  // Parse shipping address
  order.shippingAddress = order.shippingAddress 
    ? JSON.parse(order.shippingAddress) 
    : null;

  res.json({
    success: true,
    data: {
      order: {
        ...order,
        items: orderItems
      }
    }
  });
});

/**
 * Cancel order
 */
export const cancelOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const [orders] = await pool.execute(
    'SELECT id, status, orderNumber FROM orders WHERE id = ? AND userId = ?',
    [id, userId]
  );

  if (orders.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  const order = orders[0];

  if (order.status === 'cancelled') {
    return res.status(400).json({
      success: false,
      message: 'Order is already cancelled'
    });
  }

  if (['shipped', 'delivered'].includes(order.status)) {
    return res.status(400).json({
      success: false,
      message: 'Cannot cancel order that is already shipped or delivered'
    });
  }

  // Update order status
  await pool.execute(
    'UPDATE orders SET status = ? WHERE id = ?',
    ['cancelled', id]
  );

  // Restore stock
  const [orderItems] = await pool.execute(
    'SELECT productId, quantity FROM order_items WHERE orderId = ?',
    [id]
  );

  for (const item of orderItems) {
    await pool.execute(
      'UPDATE products SET stock = stock + ? WHERE id = ?',
      [item.quantity, item.productId]
    );
  }

  // Log activity
  await pool.execute(
    'INSERT INTO activity_logs (userId, action, entityType, entityId, description) VALUES (?, ?, ?, ?, ?)',
    [userId, 'order_cancelled', 'order', id, `Order ${order.orderNumber} cancelled`]
  );

  res.json({
    success: true,
    message: 'Order cancelled successfully'
  });
});

