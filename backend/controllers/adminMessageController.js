import pool from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendEmail } from '../utils/email.js';

/**
 * Get all messages (admin)
 */
export const getAllMessages = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = parseInt(limit);

  let query = `
    SELECT 
      m.*,
      u.name as userName
    FROM messages m
    LEFT JOIN users u ON m.userId = u.id
    WHERE 1=1
  `;
  const params = [];

  if (status) {
    query += ' AND m.status = ?';
    params.push(status);
  }

  if (search) {
    query += ' AND (m.name LIKE ? OR m.email LIKE ? OR m.subject LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  query += ' ORDER BY m.createdAt DESC LIMIT ? OFFSET ?';
  params.push(limitNum, offset);

  const [messages] = await pool.execute(query, params);

  // Get total count
  let countQuery = 'SELECT COUNT(*) as total FROM messages WHERE 1=1';
  const countParams = [];

  if (status) {
    countQuery += ' AND status = ?';
    countParams.push(status);
  }

  if (search) {
    countQuery += ' AND (name LIKE ? OR email LIKE ? OR subject LIKE ?)';
    const searchTerm = `%${search}%`;
    countParams.push(searchTerm, searchTerm, searchTerm);
  }

  const [countResult] = await pool.execute(countQuery, countParams);
  const total = countResult[0].total;

  res.json({
    success: true,
    data: {
      messages,
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
 * Get message details (admin)
 */
export const getMessageDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [messages] = await pool.execute(
    `SELECT 
      m.*,
      u.name as userName,
      u.email as userEmail
    FROM messages m
    LEFT JOIN users u ON m.userId = u.id
    WHERE m.id = ?`,
    [id]
  );

  if (messages.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Message not found'
    });
  }

  // Mark as read if unread
  if (messages[0].status === 'unread') {
    await pool.execute(
      'UPDATE messages SET status = ? WHERE id = ?',
      ['read', id]
    );
    messages[0].status = 'read';
  }

  res.json({
    success: true,
    data: { message: messages[0] }
  });
});

/**
 * Reply to message (admin)
 */
export const replyToMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;

  if (!reply || reply.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Reply message is required'
    });
  }

  // Get message
  const [messages] = await pool.execute(
    'SELECT * FROM messages WHERE id = ?',
    [id]
  );

  if (messages.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Message not found'
    });
  }

  const message = messages[0];

  // Update message
  await pool.execute(
    `UPDATE messages 
     SET reply = ?, status = ?, repliedBy = ?, repliedAt = NOW()
     WHERE id = ?`,
    [reply, 'replied', req.user.id, id]
  );

  // Send reply email
  sendEmail(
    message.email,
    `Re: ${message.subject}`,
    `
      <h2>Réponse à votre message</h2>
      <p>Bonjour ${message.name},</p>
      <p>En réponse à votre message :</p>
      <blockquote>${message.message}</blockquote>
      <p><strong>Notre réponse :</strong></p>
      <p>${reply}</p>
      <p>Cordialement,<br>L'équipe NatureVita</p>
    `,
    `Réponse à votre message: ${message.subject}\n\n${reply}`
  ).catch(err => console.error('Failed to send reply email:', err));

  // Log activity
  await pool.execute(
    'INSERT INTO activity_logs (userId, action, entityType, entityId, description) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, 'message_replied', 'message', id, `Replied to message from ${message.name}`]
  );

  res.json({
    success: true,
    message: 'Reply sent successfully'
  });
});

/**
 * Delete message (admin)
 */
export const deleteMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [messages] = await pool.execute('SELECT id FROM messages WHERE id = ?', [id]);

  if (messages.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Message not found'
    });
  }

  await pool.execute('DELETE FROM messages WHERE id = ?', [id]);

  // Log activity
  await pool.execute(
    'INSERT INTO activity_logs (userId, action, entityType, entityId, description) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, 'message_deleted', 'message', id, 'Message deleted']
  );

  res.json({
    success: true,
    message: 'Message deleted successfully'
  });
});

