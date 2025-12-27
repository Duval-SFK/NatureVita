import express from 'express';
import {
  sendMessage,
  getUserMessages
} from '../controllers/messageController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/security.js';

const router = express.Router();

// Send message (optional auth - visitors can send messages)
router.post('/', [
  optionalAuth,
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required'),
  handleValidationErrors
], sendMessage);

// Get user messages (requires auth)
router.get('/', authenticate, getUserMessages);

export default router;

