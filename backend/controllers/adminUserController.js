import pool from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import bcrypt from 'bcryptjs';

/**
 * Get all users (admin)
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, role, isActive } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = parseInt(limit);

  let query = `
    SELECT 
      id, name, email, role, phone, address, city, country,
      isActive, isEmailVerified, createdAt, lastLogin,
      (SELECT COUNT(*) FROM orders WHERE userId = users.id) as orderCount
    FROM users
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    query += ' AND (name LIKE ? OR email LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm);
  }

  if (role) {
    query += ' AND role = ?';
    params.push(role);
  }

  if (isActive !== undefined) {
    query += ' AND isActive = ?';
    params.push(isActive === 'true');
  }

  query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
  params.push(limitNum, offset);

  const [users] = await pool.execute(query, params);

  // Get total count
  let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
  const countParams = [];

  if (search) {
    countQuery += ' AND (name LIKE ? OR email LIKE ?)';
    const searchTerm = `%${search}%`;
    countParams.push(searchTerm, searchTerm);
  }

  if (role) {
    countQuery += ' AND role = ?';
    countParams.push(role);
  }

  if (isActive !== undefined) {
    countQuery += ' AND isActive = ?';
    countParams.push(isActive === 'true');
  }

  const [countResult] = await pool.execute(countQuery, countParams);
  const total = countResult[0].total;

  res.json({
    success: true,
    data: {
      users,
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
 * Get user details (admin)
 */
export const getUserDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [users] = await pool.execute(
    `SELECT 
      id, name, email, role, phone, address, city, country,
      isActive, isEmailVerified, createdAt, updatedAt, lastLogin
    FROM users
    WHERE id = ?`,
    [id]
  );

  if (users.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Get user orders
  const [orders] = await pool.execute(
    `SELECT id, orderNumber, totalAmount, status, createdAt
     FROM orders
     WHERE userId = ?
     ORDER BY createdAt DESC
     LIMIT 10`,
    [id]
  );

  // Get order statistics
  const [orderStats] = await pool.execute(
    `SELECT 
       COUNT(*) as totalOrders,
       SUM(totalAmount) as totalSpent,
       AVG(totalAmount) as averageOrderValue
     FROM orders
     WHERE userId = ? AND status IN ('paid', 'processing', 'shipped', 'delivered')`,
    [id]
  );

  res.json({
    success: true,
    data: {
      user: users[0],
      orders,
      stats: orderStats[0] || {
        totalOrders: 0,
        totalSpent: 0,
        averageOrderValue: 0
      }
    }
  });
});

/**
 * Update user (admin)
 */
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, role, phone, address, city, country, isActive } = req.body;

  // Check if user exists
  const [users] = await pool.execute('SELECT id FROM users WHERE id = ?', [id]);

  if (users.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Check if email is already taken by another user
  if (email) {
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, id]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use'
      });
    }
  }

  // Build update query
  const updates = [];
  const values = [];

  if (name !== undefined) {
    updates.push('name = ?');
    values.push(name);
  }
  if (email !== undefined) {
    updates.push('email = ?');
    values.push(email);
  }
  if (role !== undefined) {
    updates.push('role = ?');
    values.push(role);
  }
  if (phone !== undefined) {
    updates.push('phone = ?');
    values.push(phone);
  }
  if (address !== undefined) {
    updates.push('address = ?');
    values.push(address);
  }
  if (city !== undefined) {
    updates.push('city = ?');
    values.push(city);
  }
  if (country !== undefined) {
    updates.push('country = ?');
    values.push(country);
  }
  if (isActive !== undefined) {
    updates.push('isActive = ?');
    values.push(isActive);
  }

  if (updates.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No fields to update'
    });
  }

  values.push(id);

  await pool.execute(
    `UPDATE users SET ${updates.join(', ')}, updatedAt = NOW() WHERE id = ?`,
    values
  );

  // Log activity
  await pool.execute(
    'INSERT INTO activity_logs (userId, action, entityType, entityId, description) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, 'user_updated', 'user', id, `User ${id} updated`]
  );

  res.json({
    success: true,
    message: 'User updated successfully'
  });
});

/**
 * Delete user (admin)
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Prevent deleting yourself
  if (parseInt(id) === req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'You cannot delete your own account'
    });
  }

  // Check if user exists
  const [users] = await pool.execute('SELECT id, name FROM users WHERE id = ?', [id]);

  if (users.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Soft delete - set isActive to false
  await pool.execute('UPDATE users SET isActive = FALSE WHERE id = ?', [id]);

  // Log activity
  await pool.execute(
    'INSERT INTO activity_logs (userId, action, entityType, entityId, description) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, 'user_deleted', 'user', id, `User ${users[0].name} deactivated`]
  );

  res.json({
    success: true,
    message: 'User deactivated successfully'
  });
});

