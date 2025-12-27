import express from 'express';
import {
  getTranslations,
  getAllTranslations,
  upsertTranslation,
  deleteTranslation,
  bulkImportTranslations
} from '../controllers/translationController.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public route - get translations by language
router.get('/', getTranslations);

// Admin routes
router.use(authenticate);
router.use(isAdmin);

router.get('/all', getAllTranslations);
router.post('/', upsertTranslation);
router.post('/bulk', bulkImportTranslations);
router.delete('/:id', deleteTranslation);

export default router;

