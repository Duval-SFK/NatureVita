import pool from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Get user notifications
 */
export const getUserNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { isRead, limit = 50 } = req.query;

  let query = `
    SELECT * FROM notifications 
    WHERE userId = ?
  `;
  const params = [userId];

  if (isRead !== undefined) {
    query += ' AND isRead = ?';
    params.push(isRead === 'true');
  }

  query += ' ORDER BY createdAt DESC LIMIT ?';
  params.push(parseInt(limit));

  const [notifications] = await pool.execute(query, params);

  // Get unread count
  const [unreadCountResult] = await pool.execute(
    'SELECT COUNT(*) as count FROM notifications WHERE userId = ? AND isRead = FALSE',
    [userId]
  );

  res.json({
    success: true,
    data: {
      notifications,
      unreadCount: parseInt(unreadCountResult[0].count)
    }
  });
});

/**
 * Mark notification as read
 */
export const markAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  await pool.execute(
    'UPDATE notifications SET isRead = TRUE WHERE id = ? AND userId = ?',
    [id, userId]
  );

  res.json({
    success: true,
    message: 'Notification marked as read'
  });
});

/**
 * Mark all notifications as read
 */
export const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  await pool.execute(
    'UPDATE notifications SET isRead = TRUE WHERE userId = ? AND isRead = FALSE',
    [userId]
  );

  res.json({
    success: true,
    message: 'All notifications marked as read'
  });
});

/**
 * Delete notification
 */
export const deleteNotification = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  await pool.execute(
    'DELETE FROM notifications WHERE id = ? AND userId = ?',
    [id, userId]
  );

  res.json({
    success: true,
    message: 'Notification deleted'
  });
});

