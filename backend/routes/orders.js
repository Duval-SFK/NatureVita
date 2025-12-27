import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrder,
  cancelOrder
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/security.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/', [
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('shippingAddress.name').notEmpty().withMessage('Name is required'),
  body('shippingAddress.address').notEmpty().withMessage('Address is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.country').notEmpty().withMessage('Country is required'),
  body('shippingAddress.phone').notEmpty().withMessage('Phone is required'),
  body('promoCode').optional().isString(),
  body('notes').optional().isString(),
  handleValidationErrors
], createOrder);

router.get('/', getUserOrders);
router.get('/:id', getOrder);
router.patch('/:id/cancel', cancelOrder);

export default router;

