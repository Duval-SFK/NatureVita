import pool from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Create review
 */
export const createReview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId, orderId, rating, comment } = req.body;

  // Validate rating
  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be between 1 and 5'
    });
  }

  // Check if product exists
  const [products] = await pool.execute(
    'SELECT id FROM products WHERE id = ? AND isActive = TRUE',
    [productId]
  );

  if (products.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // If orderId provided, verify user owns the order
  if (orderId) {
    const [orders] = await pool.execute(
      'SELECT id FROM orders WHERE id = ? AND userId = ?',
      [orderId, userId]
    );

    if (orders.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Order not found or access denied'
      });
    }
  }

  // Check if review already exists
  const [existingReviews] = await pool.execute(
    'SELECT id FROM reviews WHERE userId = ? AND productId = ?',
    [userId, productId]
  );

  if (existingReviews.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'You have already reviewed this product'
    });
  }

  // Create review (requires admin approval)
  const [result] = await pool.execute(
    `INSERT INTO reviews (userId, productId, orderId, rating, comment, isApproved)
     VALUES (?, ?, ?, ?, ?, FALSE)`,
    [userId, productId, orderId || null, rating, comment]
  );

  // Log activity
  await pool.execute(
    'INSERT INTO activity_logs (userId, action, entityType, entityId, description) VALUES (?, ?, ?, ?, ?)',
    [userId, 'review_created', 'review', result.insertId, `Review created for product ${productId}`]
  );

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully. It will be published after admin approval.',
    data: { reviewId: result.insertId }
  });
});

/**
 * Get product reviews
 */
export const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = parseInt(limit);

  const [reviews] = await pool.execute(
    `SELECT r.*, u.name as userName
     FROM reviews r
     JOIN users u ON r.userId = u.id
     WHERE r.productId = ? AND r.isApproved = TRUE
     ORDER BY r.createdAt DESC
     LIMIT ? OFFSET ?`,
    [productId, limitNum, offset]
  );

  // Get total count
  const [countResult] = await pool.execute(
    'SELECT COUNT(*) as total FROM reviews WHERE productId = ? AND isApproved = TRUE',
    [productId]
  );

  const total = countResult[0].total;

  // Calculate average rating
  const [avgResult] = await pool.execute(
    'SELECT AVG(rating) as averageRating FROM reviews WHERE productId = ? AND isApproved = TRUE',
    [productId]
  );

  res.json({
    success: true,
    data: {
      reviews,
      averageRating: avgResult[0].averageRating || 0,
      total,
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
 * Get user reviews
 */
export const getUserReviews = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [reviews] = await pool.execute(
    `SELECT r.*, p.name as productName, p.slug as productSlug, p.imageUrl as productImage
     FROM reviews r
     JOIN products p ON r.productId = p.id
     WHERE r.userId = ?
     ORDER BY r.createdAt DESC`,
    [userId]
  );

  res.json({
    success: true,
    data: { reviews }
  });
});

