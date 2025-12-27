import pool from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Get active banners
 */
export const getBanners = asyncHandler(async (req, res) => {
  const { position = 'home' } = req.query;

  const [banners] = await pool.execute(
    `SELECT * FROM banners 
     WHERE isActive = TRUE 
     AND position = ?
     AND (validFrom IS NULL OR validFrom <= NOW())
     AND (validUntil IS NULL OR validUntil >= NOW())
     ORDER BY sortOrder ASC, createdAt DESC`,
    [position]
  );

  res.json({
    success: true,
    data: { banners }
  });
});

/**
 * Get all banners (admin)
 */
export const getAllBanners = asyncHandler(async (req, res) => {
  const { position, isActive } = req.query;

  let query = 'SELECT * FROM banners WHERE 1=1';
  const params = [];

  if (position) {
    query += ' AND position = ?';
    params.push(position);
  }

  if (isActive !== undefined) {
    query += ' AND isActive = ?';
    params.push(isActive === 'true');
  }

  query += ' ORDER BY sortOrder ASC, createdAt DESC';

  const [banners] = await pool.execute(query, params);

  res.json({
    success: true,
    data: { banners }
  });
});

/**
 * Create banner (admin)
 */
export const createBanner = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    imageUrl,
    link,
    position,
    sortOrder,
    validFrom,
    validUntil
  } = req.body;

  if (!title || !imageUrl) {
    return res.status(400).json({
      success: false,
      message: 'Title and imageUrl are required'
    });
  }

  const [result] = await pool.execute(
    `INSERT INTO banners 
     (title, description, imageUrl, link, position, sortOrder, validFrom, validUntil)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      description || null,
      imageUrl,
      link || null,
      position || 'home',
      sortOrder || 0,
      validFrom || null,
      validUntil || null
    ]
  );

  res.status(201).json({
    success: true,
    message: 'Banner created successfully',
    data: { id: result.insertId }
  });
});

/**
 * Update banner (admin)
 */
export const updateBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    imageUrl,
    link,
    position,
    isActive,
    sortOrder,
    validFrom,
    validUntil
  } = req.body;

  const updateFields = [];
  const params = [];

  if (title !== undefined) {
    updateFields.push('title = ?');
    params.push(title);
  }
  if (description !== undefined) {
    updateFields.push('description = ?');
    params.push(description);
  }
  if (imageUrl !== undefined) {
    updateFields.push('imageUrl = ?');
    params.push(imageUrl);
  }
  if (link !== undefined) {
    updateFields.push('link = ?');
    params.push(link);
  }
  if (position !== undefined) {
    updateFields.push('position = ?');
    params.push(position);
  }
  if (isActive !== undefined) {
    updateFields.push('isActive = ?');
    params.push(isActive);
  }
  if (sortOrder !== undefined) {
    updateFields.push('sortOrder = ?');
    params.push(sortOrder);
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
    `UPDATE banners SET ${updateFields.join(', ')} WHERE id = ?`,
    params
  );

  res.json({
    success: true,
    message: 'Banner updated successfully'
  });
});

/**
 * Delete banner (admin)
 */
export const deleteBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await pool.execute('DELETE FROM banners WHERE id = ?', [id]);

  res.json({
    success: true,
    message: 'Banner deleted successfully'
  });
});

