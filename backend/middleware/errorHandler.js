import pool from '../config/database.js';

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Log error to database
  if (req.user) {
    pool.execute(
      'INSERT INTO activity_logs (userId, action, description, ipAddress, userAgent, metadata) VALUES (?, ?, ?, ?, ?, ?)',
      [
        req.user.id,
        'error',
        err.message,
        req.ip,
        req.get('user-agent'),
        JSON.stringify({ stack: err.stack, url: req.url, method: req.method })
      ]
    ).catch(logError => console.error('Failed to log error:', logError));
  }

  // Send error response
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

/**
 * 404 Not Found handler
 */
export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};

/**
 * Async handler wrapper to catch errors
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

