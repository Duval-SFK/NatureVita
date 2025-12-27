import pool from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Get all products (admin - includes inactive)
 */
export const getAllProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, category, isActive } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = parseInt(limit);

  let query = `
    SELECT 
      p.*,
      c.name as categoryName,
      c.slug as categorySlug,
      COALESCE(AVG(r.rating), 0) as averageRating,
      COUNT(r.id) as reviewCount
    FROM products p
    LEFT JOIN categories c ON p.categoryId = c.id
    LEFT JOIN reviews r ON p.id = r.productId AND r.isApproved = TRUE
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    query += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.sku LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  if (category) {
    query += ' AND (c.slug = ? OR p.category = ?)';
    params.push(category, category);
  }

  if (isActive !== undefined) {
    query += ' AND p.isActive = ?';
    params.push(isActive === 'true');
  }

  query += ' GROUP BY p.id ORDER BY p.createdAt DESC LIMIT ? OFFSET ?';
  params.push(limitNum, offset);

  const [products] = await pool.execute(query, params);

  // Get total count
  let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
  const countParams = [];

  if (search) {
    countQuery += ' AND (name LIKE ? OR description LIKE ? OR sku LIKE ?)';
    const searchTerm = `%${search}%`;
    countParams.push(searchTerm, searchTerm, searchTerm);
  }

  if (category) {
    countQuery += ' AND (categoryId = (SELECT id FROM categories WHERE slug = ?) OR category = ?)';
    countParams.push(category, category);
  }

  if (isActive !== undefined) {
    countQuery += ' AND isActive = ?';
    countParams.push(isActive === 'true');
  }

  const [countResult] = await pool.execute(countQuery, countParams);
  const total = countResult[0].total;

  res.json({
    success: true,
    data: {
      products: products.map(p => ({
        ...p,
        averageRating: parseFloat(p.averageRating).toFixed(1),
        reviewCount: parseInt(p.reviewCount),
        gallery: p.gallery ? JSON.parse(p.gallery) : []
      })),
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    }
  });
});

/**
 * Create product (admin)
 */
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    price,
    description,
    shortDescription,
    imageUrl,
    gallery,
    categoryId,
    category,
    stock,
    minStock,
    sku,
    weight,
    dimensions,
    isActive,
    isFeatured
  } = req.body;

  // Generate slug if not provided
  const productSlug = slug || name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Check if slug exists
  const [existing] = await pool.execute(
    'SELECT id FROM products WHERE slug = ?',
    [productSlug]
  );

  if (existing.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Product with this slug already exists'
    });
  }

  // Generate SKU if not provided
  const productSku = sku || `NV-${Date.now()}`;

  const [result] = await pool.execute(
    `INSERT INTO products 
     (name, slug, price, description, shortDescription, imageUrl, gallery, categoryId, category, stock, minStock, sku, weight, dimensions, isActive, isFeatured)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      productSlug,
      price,
      description,
      shortDescription || null,
      imageUrl || null,
      gallery ? JSON.stringify(gallery) : null,
      categoryId || null,
      category || null,
      stock || 0,
      minStock || 5,
      productSku,
      weight || null,
      dimensions || null,
      isActive !== undefined ? isActive : true,
      isFeatured || false
    ]
  );

  // Log activity
  await pool.execute(
    'INSERT INTO activity_logs (userId, action, entityType, entityId, description) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, 'product_created', 'product', result.insertId, `Product ${name} created`]
  );

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: { productId: result.insertId }
  });
});

/**
 * Update product (admin)
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Check if product exists
  const [products] = await pool.execute(
    'SELECT id, name FROM products WHERE id = ?',
    [id]
  );

  if (products.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Build update query dynamically
  const allowedFields = [
    'name', 'slug', 'price', 'description', 'shortDescription',
    'imageUrl', 'gallery', 'categoryId', 'category', 'stock',
    'minStock', 'sku', 'weight', 'dimensions', 'isActive', 'isFeatured'
  ];

  const updates = [];
  const values = [];

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      if (field === 'gallery' && Array.isArray(updateData[field])) {
        updates.push(`${field} = ?`);
        values.push(JSON.stringify(updateData[field]));
      } else {
        updates.push(`${field} = ?`);
        values.push(updateData[field]);
      }
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
    `UPDATE products SET ${updates.join(', ')}, updatedAt = NOW() WHERE id = ?`,
    values
  );

  // Log activity
  await pool.execute(
    'INSERT INTO activity_logs (userId, action, entityType, entityId, description) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, 'product_updated', 'product', id, `Product ${products[0].name} updated`]
  );

  res.json({
    success: true,
    message: 'Product updated successfully'
  });
});

/**
 * Delete product (admin)
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if product exists
  const [products] = await pool.execute(
    'SELECT id, name FROM products WHERE id = ?',
    [id]
  );

  if (products.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Check if product has orders
  const [orderItems] = await pool.execute(
    'SELECT id FROM order_items WHERE productId = ? LIMIT 1',
    [id]
  );

  if (orderItems.length > 0) {
    // Soft delete - set isActive to false
    await pool.execute(
      'UPDATE products SET isActive = FALSE WHERE id = ?',
      [id]
    );
  } else {
    // Hard delete if no orders
    await pool.execute('DELETE FROM products WHERE id = ?', [id]);
  }

  // Log activity
  await pool.execute(
    'INSERT INTO activity_logs (userId, action, entityType, entityId, description) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, 'product_deleted', 'product', id, `Product ${products[0].name} deleted`]
  );

  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
});

