import pool from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendEmail } from '../utils/email.js';

/**
 * Send contact message
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  const userId = req.user?.id || null;

  // Save message to database
  const [result] = await pool.execute(
    `INSERT INTO messages (userId, name, email, subject, message, status)
     VALUES (?, ?, ?, ?, ?, 'unread')`,
    [userId, name, email, subject, message]
  );

  const messageId = result.insertId;

  // Send notification email to admin (async)
  sendEmail(
    process.env.ADMIN_EMAIL || 'admin@naturevita.com',
    `Nouveau message: ${subject}`,
    `
      <h2>Nouveau message de contact</h2>
      <p><strong>De:</strong> ${name} (${email})</p>
      <p><strong>Sujet:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
    `Nouveau message de ${name} (${email}): ${subject}\n\n${message}`
  ).catch(err => console.error('Failed to send notification email:', err));

  // Log activity if user is authenticated
  if (userId) {
    await pool.execute(
      'INSERT INTO activity_logs (userId, action, entityType, entityId, description) VALUES (?, ?, ?, ?, ?)',
      [userId, 'message_sent', 'message', messageId, 'Contact message sent']
    );
  }

  res.status(201).json({
    success: true,
    message: 'Message sent successfully',
    data: { messageId }
  });
});

/**
 * Get user messages (for authenticated users)
 */
export const getUserMessages = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [messages] = await pool.execute(
    `SELECT id, subject, message, status, reply, repliedAt, createdAt
     FROM messages
     WHERE userId = ?
     ORDER BY createdAt DESC`,
    [userId]
  );

  res.json({
    success: true,
    data: { messages }
  });
});

