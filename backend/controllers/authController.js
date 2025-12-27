import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import pool from '../config/database.js';
import { generateToken, generateRefreshToken } from '../utils/jwt.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Register new user
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address, city, country } = req.body;

  // Check if user already exists
  const [existingUsers] = await pool.execute(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );

  if (existingUsers.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Email already registered'
    });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 12);

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Create user
  const [result] = await pool.execute(
    `INSERT INTO users (name, email, password, phone, address, city, country, emailVerificationToken) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, email, hashedPassword, phone || null, address || null, city || null, country || null, verificationToken]
  );

  const userId = result.insertId;

  // Save verification token
  await pool.execute(
    'INSERT INTO email_verifications (userId, token, expiresAt) VALUES (?, ?, ?)',
    [userId, verificationToken, expiresAt]
  );

  // Log activity
  await pool.execute(
    'INSERT INTO activity_logs (userId, action, description, ipAddress, userAgent) VALUES (?, ?, ?, ?, ?)',
    [userId, 'user_registered', 'New user registration', req.ip, req.get('user-agent')]
  );

  // Send verification email
  await sendVerificationEmail({ name, email }, verificationToken);

  // Generate token (user can use app but needs to verify email for orders)
  const token = generateToken(userId, 'user');

  res.status(201).json({
    success: true,
    message: 'Registration successful. Please check your email to verify your account.',
    data: {
      user: {
        id: userId,
        name,
        email,
        role: 'user',
        isEmailVerified: false
      },
      token
    }
  });
});

/**
 * Login user
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const [users] = await pool.execute(
    'SELECT id, name, email, password, role, isActive, isEmailVerified FROM users WHERE email = ?',
    [email]
  );

  if (users.length === 0) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  const user = users[0];

  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Account is deactivated'
    });
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Update last login
  await pool.execute(
    'UPDATE users SET lastLogin = NOW() WHERE id = ?',
    [user.id]
  );

  // Log activity
  await pool.execute(
    'INSERT INTO activity_logs (userId, action, description, ipAddress, userAgent) VALUES (?, ?, ?, ?, ?)',
    [user.id, 'user_login', 'User logged in', req.ip, req.get('user-agent')]
  );

  // Generate tokens
  const token = generateToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      },
      token,
      refreshToken
    }
  });
});

/**
 * Verify email
 */
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  // Find verification record
  const [verifications] = await pool.execute(
    `SELECT ev.*, u.id as userId, u.email 
     FROM email_verifications ev
     JOIN users u ON ev.userId = u.id
     WHERE ev.token = ? AND ev.isUsed = FALSE AND ev.expiresAt > NOW()`,
    [token]
  );

  if (verifications.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired verification token'
    });
  }

  const verification = verifications[0];

  // Mark as verified
  await pool.execute(
    'UPDATE users SET isEmailVerified = TRUE, emailVerificationToken = NULL WHERE id = ?',
    [verification.userId]
  );

  await pool.execute(
    'UPDATE email_verifications SET isUsed = TRUE WHERE id = ?',
    [verification.id]
  );

  // Log activity
  await pool.execute(
    'INSERT INTO activity_logs (userId, action, description) VALUES (?, ?, ?)',
    [verification.userId, 'email_verified', 'User verified email address']
  );

  res.json({
    success: true,
    message: 'Email verified successfully'
  });
});

/**
 * Forgot password
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const [users] = await pool.execute(
    'SELECT id, name, email FROM users WHERE email = ?',
    [email]
  );

  if (users.length === 0) {
    // Don't reveal if email exists
    return res.json({
      success: true,
      message: 'If email exists, password reset link has been sent'
    });
  }

  const user = users[0];

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await pool.execute(
    'UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE id = ?',
    [resetToken, expiresAt, user.id]
  );

  // Send reset email
  await sendPasswordResetEmail(user, resetToken);

  // Log activity
  await pool.execute(
    'INSERT INTO activity_logs (userId, action, description, ipAddress) VALUES (?, ?, ?, ?)',
    [user.id, 'password_reset_requested', 'Password reset requested', req.ip]
  );

  res.json({
    success: true,
    message: 'If email exists, password reset link has been sent'
  });
});

/**
 * Reset password
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const [users] = await pool.execute(
    'SELECT id FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > NOW()',
    [token]
  );

  if (users.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token'
    });
  }

  const user = users[0];

  // Hash new password
  const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 12);

  // Update password
  await pool.execute(
    'UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id = ?',
    [hashedPassword, user.id]
  );

  // Log activity
  await pool.execute(
    'INSERT INTO activity_logs (userId, action, description, ipAddress) VALUES (?, ?, ?, ?)',
    [user.id, 'password_reset', 'Password reset completed', req.ip]
  );

  res.json({
    success: true,
    message: 'Password reset successful'
  });
});

/**
 * Get current user profile
 */
export const getProfile = asyncHandler(async (req, res) => {
  const [users] = await pool.execute(
    'SELECT id, name, email, phone, address, city, country, role, isEmailVerified, createdAt FROM users WHERE id = ?',
    [req.user.id]
  );

  res.json({
    success: true,
    data: { user: users[0] }
  });
});

/**
 * Update user profile
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, address, city, country } = req.body;
  const userId = req.user.id;

  await pool.execute(
    'UPDATE users SET name = ?, phone = ?, address = ?, city = ?, country = ? WHERE id = ?',
    [name, phone, address, city, country, userId]
  );

  // Log activity
  await pool.execute(
    'INSERT INTO activity_logs (userId, action, description) VALUES (?, ?, ?)',
    [userId, 'profile_updated', 'User updated profile']
  );

  // Get updated user
  const [users] = await pool.execute(
    'SELECT id, name, email, phone, address, city, country, role, isEmailVerified FROM users WHERE id = ?',
    [userId]
  );

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: { user: users[0] }
  });
});

/**
 * Change password
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  // Get current password
  const [users] = await pool.execute(
    'SELECT password FROM users WHERE id = ?',
    [userId]
  );

  const isValidPassword = await bcrypt.compare(currentPassword, users[0].password);

  if (!isValidPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS) || 12);

  await pool.execute(
    'UPDATE users SET password = ? WHERE id = ?',
    [hashedPassword, userId]
  );

  // Log activity
  await pool.execute(
    'INSERT INTO activity_logs (userId, action, description) VALUES (?, ?, ?)',
    [userId, 'password_changed', 'User changed password']
  );

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

/**
 * Refresh token
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token required'
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Get user
    const [users] = await pool.execute(
      'SELECT id, role, isActive FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0 || !users[0].isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    const user = users[0];

    // Generate new tokens
    const newToken = generateToken(user.id, user.role);
    const newRefreshToken = generateRefreshToken(user.id);

    res.json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token'
    });
  }
});

