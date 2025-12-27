import pool from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Get all products with filters
 */
export const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    category,
    search,
    minPrice,
    maxPrice,
    sortBy = 'createdAt',
    sortOrder = 'DESC',
    featured
  } = req.query;

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
    WHERE p.isActive = TRUE
  `;

  const params = [];

  if (category) {
    query += ' AND (c.slug = ? OR p.category = ?)';
    params.push(category, category);
  }

  if (search) {
    query += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.shortDescription LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  if (minPrice) {
    query += ' AND p.price >= ?';
    params.push(parseFloat(minPrice));
  }

  if (maxPrice) {
    query += ' AND p.price <= ?';
    params.push(parseFloat(maxPrice));
  }

  if (featured === 'true') {
    query += ' AND p.isFeatured = TRUE';
  }

  query += ' GROUP BY p.id';

  // Validate sortBy
  const allowedSorts = ['createdAt', 'price', 'name', 'views', 'averageRating'];
  const sortColumn = allowedSorts.includes(sortBy) ? sortBy : 'createdAt';
  const sortDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  query += ` ORDER BY p.${sortColumn} ${sortDirection}`;
  query += ' LIMIT ? OFFSET ?';
  params.push(limitNum, offset);

  const [products] = await pool.execute(query, params);

  // Get total count
  let countQuery = `
    SELECT COUNT(DISTINCT p.id) as total
    FROM products p
    LEFT JOIN categories c ON p.categoryId = c.id
    WHERE p.isActive = TRUE
  `;
  const countParams = [];

  if (category) {
    countQuery += ' AND (c.slug = ? OR p.category = ?)';
    countParams.push(category, category);
  }

  if (search) {
    countQuery += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.shortDescription LIKE ?)';
    const searchTerm = `%${search}%`;
    countParams.push(searchTerm, searchTerm, searchTerm);
  }

  if (minPrice) {
    countQuery += ' AND p.price >= ?';
    countParams.push(parseFloat(minPrice));
  }

  if (maxPrice) {
    countQuery += ' AND p.price <= ?';
    countParams.push(parseFloat(maxPrice));
  }

  if (featured === 'true') {
    countQuery += ' AND p.isFeatured = TRUE';
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
 * Get single product by ID or slug
 */
export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if id is numeric or slug
  const isNumeric = /^\d+$/.test(id);
  const whereClause = isNumeric ? 'p.id = ?' : 'p.slug = ?';

  const [products] = await pool.execute(
    `SELECT 
      p.*,
      c.name as categoryName,
      c.slug as categorySlug,
      COALESCE(AVG(r.rating), 0) as averageRating,
      COUNT(r.id) as reviewCount
    FROM products p
    LEFT JOIN categories c ON p.categoryId = c.id
    LEFT JOIN reviews r ON p.id = r.productId AND r.isApproved = TRUE
    WHERE ${whereClause} AND p.isActive = TRUE
    GROUP BY p.id`,
    [id]
  );

  if (products.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  const product = products[0];

  // Get reviews
  const [reviews] = await pool.execute(
    `SELECT r.*, u.name as userName
     FROM reviews r
     JOIN users u ON r.userId = u.id
     WHERE r.productId = ? AND r.isApproved = TRUE
     ORDER BY r.createdAt DESC
     LIMIT 10`,
    [product.id]
  );

  // Increment views
  await pool.execute(
    'UPDATE products SET views = views + 1 WHERE id = ?',
    [product.id]
  );

  // Log view activity if user is authenticated
  if (req.user) {
    await pool.execute(
      'INSERT INTO activity_logs (userId, action, entityType, entityId, ipAddress) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, 'view_product', 'product', product.id, req.ip]
    );
  }

  res.json({
    success: true,
    data: {
      product: {
        ...product,
        averageRating: parseFloat(product.averageRating).toFixed(1),
        reviewCount: parseInt(product.reviewCount),
        gallery: product.gallery ? JSON.parse(product.gallery) : [],
        reviews
      }
    }
  });
});

/**
 * Get featured products
 */
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 6;

  const [products] = await pool.execute(
    `SELECT 
      p.*,
      c.name as categoryName,
      COALESCE(AVG(r.rating), 0) as averageRating
    FROM products p
    LEFT JOIN categories c ON p.categoryId = c.id
    LEFT JOIN reviews r ON p.id = r.productId AND r.isApproved = TRUE
    WHERE p.isActive = TRUE AND p.isFeatured = TRUE
    GROUP BY p.id
    ORDER BY p.createdAt DESC
    LIMIT ?`,
    [limit]
  );

  res.json({
    success: true,
    data: {
      products: products.map(p => ({
        ...p,
        averageRating: parseFloat(p.averageRating).toFixed(1),
        gallery: p.gallery ? JSON.parse(p.gallery) : []
      }))
    }
  });
});

/**
 * Get categories
 */
export const getCategories = asyncHandler(async (req, res) => {
  const [categories] = await pool.execute(
    `SELECT c.*, COUNT(p.id) as productCount
     FROM categories c
     LEFT JOIN products p ON c.id = p.categoryId AND p.isActive = TRUE
     WHERE c.isActive = TRUE
     GROUP BY c.id
     ORDER BY c.sortOrder ASC, c.name ASC`
  );

  res.json({
    success: true,
    data: { categories }
  });
});

