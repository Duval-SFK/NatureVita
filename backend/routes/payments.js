import express from 'express';
import {
  initiatePayment,
  monetbilWebhook,
  getPaymentStatus
} from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/security.js';

const router = express.Router();

// Webhook (no auth required, signature verification instead)
router.post('/webhook', monetbilWebhook);

// All other routes require authentication
router.use(authenticate);

router.post('/initiate', [
  body('orderId').isInt().withMessage('Valid order ID is required'),
  handleValidationErrors
], initiatePayment);

router.get('/status/:orderId', getPaymentStatus);

export default router;

