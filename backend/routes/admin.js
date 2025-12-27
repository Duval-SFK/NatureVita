import express from 'express';
import { authenticate, isAdmin } from '../middleware/auth.js';

// Dashboard
import { getDashboardStats } from '../controllers/adminController.js';

// Orders
import {
  getAllOrders,
  getOrderDetails,
  updateOrderStatus
} from '../controllers/adminController.js';

// Products
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/adminProductController.js';

// Users
import {
  getAllUsers,
  getUserDetails,
  updateUser,
  deleteUser
} from '../controllers/adminUserController.js';

// Messages
import {
  getAllMessages,
  getMessageDetails,
  replyToMessage,
  deleteMessage
} from '../controllers/adminMessageController.js';

// Reviews
import {
  getAllReviews,
  approveReview,
  deleteReview
} from '../controllers/adminReviewController.js';

// Categories
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/adminCategoryController.js';

// Promo Codes
import {
  getAllPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode
} from '../controllers/promoCodeController.js';

// Banners
import {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner
} from '../controllers/bannerController.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Orders
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderDetails);
router.patch('/orders/:id/status', updateOrderStatus);

// Products
router.get('/products', getAllProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Users
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Messages
router.get('/messages', getAllMessages);
router.get('/messages/:id', getMessageDetails);
router.post('/messages/:id/reply', replyToMessage);
router.delete('/messages/:id', deleteMessage);

// Reviews
router.get('/reviews', getAllReviews);
router.patch('/reviews/:id/approve', approveReview);
router.delete('/reviews/:id', deleteReview);

// Categories
router.get('/categories', getAllCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Promo Codes
router.get('/promo-codes', getAllPromoCodes);
router.post('/promo-codes', createPromoCode);
router.put('/promo-codes/:id', updatePromoCode);
router.delete('/promo-codes/:id', deletePromoCode);

// Banners
router.get('/banners', getAllBanners);
router.post('/banners', createBanner);
router.put('/banners/:id', updateBanner);
router.delete('/banners/:id', deleteBanner);

export default router;

