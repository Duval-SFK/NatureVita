import express from 'express';
import { validatePromoCode, applyPromoCode } from '../controllers/promoCodeController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public route - validate promo code
router.post('/validate', validatePromoCode);

// Authenticated route - apply promo code (increment usage)
router.post('/apply', authenticate, applyPromoCode);

export default router;

