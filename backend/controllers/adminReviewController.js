import pool from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Get all reviews (admin)
 */
export const getAllReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, isApproved, search } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = parseInt(limit);

  let query = `
    SELECT 
      r.*,
      u.name as userName,
      u.email as userEmail,
      p.name as productName,
      p.slug as productSlug
    FROM reviews r
    JOIN users u ON r.userId = u.id
    JOIN products p ON r.productId = p.id
    WHERE 1=1
  `;
  const params = [];

  if (isApproved !== undefined) {
    query += ' AND r.isApproved = ?';
    params.push(isApproved === 'true');
  }

  if (search) {
    query += ' AND (u.name LIKE ? OR p.name LIKE ? OR r.comment LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  query += ' ORDER BY r.createdAt DESC LIMIT ? OFFSET ?';
  params.push(limitNum, offset);

  const [reviews] = await pool.execute(query, params);

  // Get total count
  let countQuery = 'SELECT COUNT(*) as total FROM reviews WHERE 1=1';
  const countParams = [];

  if (isApproved !== undefined) {
    countQuery += ' AND isApproved = ?';
    countParams.push(isApproved === 'true');
  }

  if (search) {
    countQuery += ' AND (userId IN (SELECT id FROM users WHERE name LIKE ?) OR productId IN (SELECT id FROM products WHERE name LIKE ?) OR comment LIKE ?)';
    const searchTerm = `%${search}%`;
    countParams.push(searchTerm, searchTerm, searchTerm);
  }

  const [countResult] = await pool.execute(countQuery, countParams);
  const total = countResult[0].total;

  res.json({
    success: true,
    data: {
      reviews,
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
 * Approve review (admin)
 */
export const approveReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [reviews] = await pool.execute('SELECT id FROM reviews WHERE id = ?', [id]);

  if (reviews.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }

  await pool.execute(
    'UPDATE reviews SET isApproved = TRUE WHERE id = ?',
    [id]
  );

  // Log activity
  await pool.execute(
    'INSERT INTO activity_logs (userId, action, entityType, entityId, description) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, 'review_approved', 'review', id, 'Review approved']
  );

  res.json({
    success: true,
    message: 'Review approved successfully'
  });
});

/**
 * Reject/Delete review (admin)
 */
export const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [reviews] = await pool.execute('SELECT id FROM reviews WHERE id = ?', [id]);

  if (reviews.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }

  await pool.execute('DELETE FROM reviews WHERE id = ?', [id]);

  // Log activity
  await pool.execute(
    'INSERT INTO activity_logs (userId, action, entityType, entityId, description) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, 'review_deleted', 'review', id, 'Review deleted']
  );

  res.json({
    success: true,
    message: 'Review deleted successfully'
  });
});

