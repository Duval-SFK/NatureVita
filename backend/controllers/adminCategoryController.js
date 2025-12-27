import pool from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Get all categories (admin)
 */
export const getAllCategories = asyncHandler(async (req, res) => {
  const [categories] = await pool.execute(
    `SELECT 
      c.*,
      COUNT(p.id) as productCount
    FROM categories c
    LEFT JOIN products p ON c.id = p.categoryId AND p.isActive = TRUE
    GROUP BY c.id
    ORDER BY c.sortOrder ASC, c.name ASC`
  );

  res.json({
    success: true,
    data: { categories }
  });
});

/**
 * Create category (admin)
 */
export const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, description, imageUrl, parentId, isActive, sortOrder } = req.body;

  // Generate slug if not provided
  const categorySlug = slug || name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Check if slug exists
  const [existing] = await pool.execute(
    'SELECT id FROM categories WHERE slug = ?',
    [categorySlug]
  );

  if (existing.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Category with this slug already exists'
    });
  }

  const [result] = await pool.execute(
    `INSERT INTO categories (name, slug, description, imageUrl, parentId, isActive, sortOrder)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      categorySlug,
      description || null,
      imageUrl || null,
      parentId || null,
      isActive !== undefined ? isActive : true,
      sortOrder || 0
    ]
  );

  // Log activity
  await pool.execute(
    'INSERT INTO activity_logs (userId, action, entityType, entityId, description) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, 'category_created', 'category', result.insertId, `Category ${name} created`]
  );

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: { categoryId: result.insertId }
  });
});

/**
 * Update category (admin)
 */
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Check if category exists
  const [categories] = await pool.execute(
    'SELECT id, name FROM categories WHERE id = ?',
    [id]
  );

  if (categories.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  // Build update query
  const allowedFields = ['name', 'slug', 'description', 'imageUrl', 'parentId', 'isActive', 'sortOrder'];
  const updates = [];
  const values = [];

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(updateData[field]);
    }
  }

  if (updates.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No valid fields to update'
    });
  }

  values.push(id);

  await pool.execute(
    `UPDATE categories SET ${updates.join(', ')}, updatedAt = NOW() WHERE id = ?`,
    values
  );

  // Log activity
  await pool.execute(
    'INSERT INTO activity_logs (userId, action, entityType, entityId, description) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, 'category_updated', 'category', id, `Category ${categories[0].name} updated`]
  );

  res.json({
    success: true,
    message: 'Category updated successfully'
  });
});

/**
 * Delete category (admin)
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if category exists
  const [categories] = await pool.execute(
    'SELECT id, name FROM categories WHERE id = ?',
    [id]
  );

  if (categories.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  // Check if category has products
  const [products] = await pool.execute(
    'SELECT id FROM products WHERE categoryId = ? LIMIT 1',
    [id]
  );

  if (products.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete category with associated products'
    });
  }

  // Check if category has children
  const [children] = await pool.execute(
    'SELECT id FROM categories WHERE parentId = ? LIMIT 1',
    [id]
  );

  if (children.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete category with subcategories'
    });
  }

  await pool.execute('DELETE FROM categories WHERE id = ?', [id]);

  // Log activity
  await pool.execute(
    'INSERT INTO activity_logs (userId, action, entityType, entityId, description) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, 'category_deleted', 'category', id, `Category ${categories[0].name} deleted`]
  );

  res.json({
    success: true,
    message: 'Category deleted successfully'
  });
});

