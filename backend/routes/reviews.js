import express from 'express';
import {
  createReview,
  getProductReviews,
  getUserReviews
} from '../controllers/reviewController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/security.js';

const router = express.Router();

// Get product reviews (public)
router.get('/product/:productId', optionalAuth, getProductReviews);

// User reviews routes (require auth)
router.use(authenticate);
router.post('/', [
  body('productId').isInt().withMessage('Valid product ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').notEmpty().withMessage('Comment is required'),
  body('orderId').optional().isInt(),
  handleValidationErrors
], createReview);

router.get('/user', getUserReviews);

export default router;

