import pool from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Validate promo code
 */
export const validatePromoCode = asyncHandler(async (req, res) => {
  const { code, amount } = req.body;

  if (!code) {
    return res.status(400).json({
      success: false,
      message: 'Promo code is required'
    });
  }

  const [promoCodes] = await pool.execute(
    `SELECT * FROM promo_codes 
     WHERE code = ? 
     AND isActive = TRUE 
     AND (validFrom IS NULL OR validFrom <= NOW())
     AND (validUntil IS NULL OR validUntil >= NOW())`,
    [code.toUpperCase()]
  );

  if (promoCodes.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Invalid or expired promo code'
    });
  }

  const promoCode = promoCodes[0];

  // Check usage limit
  if (promoCode.usageLimit && promoCode.usedCount >= promoCode.usageLimit) {
    return res.status(400).json({
      success: false,
      message: 'Promo code has reached its usage limit'
    });
  }

  // Check minimum purchase
  if (promoCode.minPurchase && amount < promoCode.minPurchase) {
    return res.status(400).json({
      success: false,
      message: `Minimum purchase of ${promoCode.minPurchase} FCFA required`
    });
  }

  // Calculate discount
  let discount = 0;
  if (promoCode.discountType === 'percentage') {
    discount = (amount * promoCode.discountValue) / 100;
    if (promoCode.maxDiscount) {
      discount = Math.min(discount, promoCode.maxDiscount);
    }
  } else {
    discount = promoCode.discountValue;
  }

  res.json({
    success: true,
    data: {
      code: promoCode.code,
      discount,
      discountType: promoCode.discountType,
      description: promoCode.description
    }
  });
});

/**
 * Get all promo codes (admin)
 */
export const getAllPromoCodes = asyncHandler(async (req, res) => {
  const { isActive } = req.query;

  let query = 'SELECT * FROM promo_codes WHERE 1=1';
  const params = [];

  if (isActive !== undefined) {
    query += ' AND isActive = ?';
    params.push(isActive === 'true');
  }

  query += ' ORDER BY createdAt DESC';

  const [promoCodes] = await pool.execute(query, params);

  res.json({
    success: true,
    data: { promoCodes }
  });
});

/**
 * Create promo code (admin)
 */
export const createPromoCode = asyncHandler(async (req, res) => {
  const {
    code,
    description,
    discountType,
    discountValue,
    minPurchase,
    maxDiscount,
    usageLimit,
    validFrom,
    validUntil
  } = req.body;

  if (!code || !discountType || !discountValue) {
    return res.status(400).json({
      success: false,
      message: 'Code, discountType, and discountValue are required'
    });
  }

  // Check if code already exists
  const [existing] = await pool.execute(
    'SELECT id FROM promo_codes WHERE code = ?',
    [code.toUpperCase()]
  );

  if (existing.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Promo code already exists'
    });
  }

  const [result] = await pool.execute(
    `INSERT INTO promo_codes 
     (code, description, discountType, discountValue, minPurchase, maxDiscount, usageLimit, validFrom, validUntil)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      code.toUpperCase(),
      description || null,
      discountType,
      discountValue,
      minPurchase || null,
      maxDiscount || null,
      usageLimit || null,
      validFrom || null,
      validUntil || null
    ]
  );

  res.status(201).json({
    success: true,
    message: 'Promo code created successfully',
    data: { id: result.insertId }
  });
});

/**
 * Update promo code (admin)
 */
export const updatePromoCode = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    description,
    discountType,
    discountValue,
    minPurchase,
    maxDiscount,
    usageLimit,
    isActive,
    validFrom,
    validUntil
  } = req.body;

  const updateFields = [];
  const params = [];

  if (description !== undefined) {
    updateFields.push('description = ?');
    params.push(description);
  }
  if (discountType !== undefined) {
    updateFields.push('discountType = ?');
    params.push(discountType);
  }
  if (discountValue !== undefined) {
    updateFields.push('discountValue = ?');
    params.push(discountValue);
  }
  if (minPurchase !== undefined) {
    updateFields.push('minPurchase = ?');
    params.push(minPurchase);
  }
  if (maxDiscount !== undefined) {
    updateFields.push('maxDiscount = ?');
    params.push(maxDiscount);
  }
  if (usageLimit !== undefined) {
    updateFields.push('usageLimit = ?');
    params.push(usageLimit);
  }
  if (isActive !== undefined) {
    updateFields.push('isActive = ?');
    params.push(isActive);
  }
  if (validFrom !== undefined) {
    updateFields.push('validFrom = ?');
    params.push(validFrom);
  }
  if (validUntil !== undefined) {
    updateFields.push('validUntil = ?');
    params.push(validUntil);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No fields to update'
    });
  }

  updateFields.push('updatedAt = NOW()');
  params.push(id);

  await pool.execute(
    `UPDATE promo_codes SET ${updateFields.join(', ')} WHERE id = ?`,
    params
  );

  res.json({
    success: true,
    message: 'Promo code updated successfully'
  });
});

/**
 * Delete promo code (admin)
 */
export const deletePromoCode = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await pool.execute('DELETE FROM promo_codes WHERE id = ?', [id]);

  res.json({
    success: true,
    message: 'Promo code deleted successfully'
  });
});

/**
 * Apply promo code to order (increment usage count)
 */
export const applyPromoCode = asyncHandler(async (req, res) => {
  const { code } = req.body;

  await pool.execute(
    'UPDATE promo_codes SET usedCount = usedCount + 1 WHERE code = ?',
    [code.toUpperCase()]
  );

  res.json({
    success: true,
    message: 'Promo code applied successfully'
  });
});

