import pool from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Get dashboard statistics
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  const dateFilter = startDate && endDate 
    ? `WHERE createdAt BETWEEN ? AND ?`
    : 'WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
  
  const params = startDate && endDate ? [startDate, endDate] : [];

  // Total orders
  const [totalOrdersResult] = await pool.execute(
    `SELECT COUNT(*) as total FROM orders ${dateFilter}`,
    params
  );

  // Pending orders
  const [pendingOrdersResult] = await pool.execute(
    `SELECT COUNT(*) as total FROM orders ${dateFilter.replace('createdAt', 'status')} AND status = 'pending'`,
    startDate && endDate ? [startDate, endDate, 'pending'] : ['pending']
  );

  // Total revenue
  const [revenueResult] = await pool.execute(
    `SELECT COALESCE(SUM(totalAmount), 0) as total 
     FROM orders 
     ${dateFilter} 
     AND status IN ('paid', 'processing', 'shipped', 'delivered')`,
    params
  );

  // New users
  const [newUsersResult] = await pool.execute(
    `SELECT COUNT(*) as total FROM users ${dateFilter}`,
    params
  );

  // Active products
  const [activeProductsResult] = await pool.execute(
    'SELECT COUNT(*) as total FROM products WHERE isActive = TRUE'
  );

  // Unread messages
  const [unreadMessagesResult] = await pool.execute(
    "SELECT COUNT(*) as total FROM messages WHERE status = 'unread'"
  );

  // Recent orders
  const [recentOrders] = await pool.execute(
    `SELECT o.*, u.name as customerName, u.email as customerEmail
     FROM orders o
     JOIN users u ON o.userId = u.id
     ORDER BY o.createdAt DESC
     LIMIT 10`
  );

  // Sales by day (last 30 days)
  const [salesByDay] = await pool.execute(
    `SELECT 
       DATE(createdAt) as date,
       COUNT(*) as orderCount,
       SUM(totalAmount) as revenue
     FROM orders
     WHERE status IN ('paid', 'processing', 'shipped', 'delivered')
     AND createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
     GROUP BY DATE(createdAt)
     ORDER BY date DESC`
  );

  // Top products
  const [topProducts] = await pool.execute(
    `SELECT 
       p.id,
       p.name,
       p.imageUrl,
       SUM(oi.quantity) as totalSold,
       SUM(oi.subtotal) as totalRevenue
     FROM products p
     JOIN order_items oi ON p.id = oi.productId
     JOIN orders o ON oi.orderId = o.id
     WHERE o.status IN ('paid', 'processing', 'shipped', 'delivered')
     AND o.createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
     GROUP BY p.id
     ORDER BY totalSold DESC
     LIMIT 10`
  );

  res.json({
    success: true,
    data: {
      stats: {
        totalOrders: parseInt(totalOrdersResult[0].total),
        pendingOrders: parseInt(pendingOrdersResult[0].total),
        totalRevenue: parseFloat(revenueResult[0].total),
        newUsers: parseInt(newUsersResult[0].total),
        activeProducts: parseInt(activeProductsResult[0].total),
        unreadMessages: parseInt(unreadMessagesResult[0].total)
      },
      recentOrders,
      salesByDay,
      topProducts
    }
  });
});

/**
 * Get all orders (admin)
 */
export const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = parseInt(limit);

  let query = `
    SELECT 
      o.*,
      u.name as customerName,
      u.email as customerEmail,
      u.phone as customerPhone
    FROM orders o
    JOIN users u ON o.userId = u.id
    WHERE 1=1
  `;
  const params = [];

  if (status) {
    query += ' AND o.status = ?';
    params.push(status);
  }

  if (search) {
    query += ' AND (o.orderNumber LIKE ? OR u.name LIKE ? OR u.email LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  query += ' ORDER BY o.createdAt DESC LIMIT ? OFFSET ?';
  params.push(limitNum, offset);

  const [orders] = await pool.execute(query, params);

  // Get total count
  let countQuery = `
    SELECT COUNT(*) as total
    FROM orders o
    JOIN users u ON o.userId = u.id
    WHERE 1=1
  `;
  const countParams = [];

  if (status) {
    countQuery += ' AND o.status = ?';
    countParams.push(status);
  }

  if (search) {
    countQuery += ' AND (o.orderNumber LIKE ? OR u.name LIKE ? OR u.email LIKE ?)';
    const searchTerm = `%${search}%`;
    countParams.push(searchTerm, searchTerm, searchTerm);
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
 * Update order status (admin)
 */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status'
    });
  }

  // Get order
  const [orders] = await pool.execute(
    'SELECT id, orderNumber, userId, status FROM orders WHERE id = ?',
    [id]
  );

  if (orders.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  const order = orders[0];

  // Update order status
  await pool.execute(
    'UPDATE orders SET status = ? WHERE id = ?',
    [status, id]
  );

  // Create notification for user
  await pool.execute(
    `INSERT INTO notifications (userId, type, title, message, link)
     VALUES (?, ?, ?, ?, ?)`,
    [
      order.userId,
      'order_status_updated',
      'Statut de commande mis à jour',
      `Votre commande ${order.orderNumber} est maintenant ${status}.`,
      `/orders/${id}`
    ]
  );

  // Log activity
  await pool.execute(
    'INSERT INTO activity_logs (userId, action, entityType, entityId, description) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, 'order_status_updated', 'order', id, `Order ${order.orderNumber} status updated to ${status}`]
  );

  res.json({
    success: true,
    message: 'Order status updated successfully'
  });
});

/**
 * Get order details (admin)
 */
export const getOrderDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [orders] = await pool.execute(
    `SELECT 
      o.*,
      u.name as customerName,
      u.email as customerEmail,
      u.phone as customerPhone,
      u.address as customerAddress,
      u.city as customerCity,
      u.country as customerCountry
    FROM orders o
    JOIN users u ON o.userId = u.id
    WHERE o.id = ?`,
    [id]
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

  // Get payment info
  const [payments] = await pool.execute(
    'SELECT * FROM payments WHERE orderId = ?',
    [id]
  );

  // Parse JSON fields
  order.shippingAddress = order.shippingAddress 
    ? JSON.parse(order.shippingAddress) 
    : null;

  if (payments.length > 0) {
    payments[0].metadata = payments[0].metadata 
      ? JSON.parse(payments[0].metadata) 
      : null;
  }

  res.json({
    success: true,
    data: {
      order: {
        ...order,
        items: orderItems,
        payment: payments[0] || null
      }
    }
  });
});

