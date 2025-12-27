import express from 'express';
import { body } from 'express-validator';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';
import { authenticate } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/security.js';

const router = express.Router();

// All cart routes require authentication
router.use(authenticate);

router.get('/', getCart);
router.post('/', [
  body('productId').isInt().withMessage('Valid product ID is required'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  handleValidationErrors
], addToCart);
router.put('/:id', [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  handleValidationErrors
], updateCartItem);
router.delete('/:id', removeFromCart);
router.delete('/', clearCart);

export default router;

