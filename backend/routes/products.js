import express from 'express';
import {
  getProducts,
  getProduct,
  getFeaturedProducts,
  getCategories
} from '../controllers/productController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/:id', optionalAuth, getProduct);

export default router;

