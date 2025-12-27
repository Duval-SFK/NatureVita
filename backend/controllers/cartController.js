import pool from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Get user cart
 */
export const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [cartItems] = await pool.execute(
    `SELECT 
      c.id,
      c.quantity,
      p.id as productId,
      p.name,
      p.slug,
      p.price,
      p.imageUrl,
      p.stock,
      p.isActive,
      (c.quantity * p.price) as subtotal
    FROM carts c
    JOIN products p ON c.productId = p.id
    WHERE c.userId = ? AND p.isActive = TRUE
    ORDER BY c.createdAt DESC`,
    [userId]
  );

  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

  res.json({
    success: true,
    data: {
      items: cartItems,
      total: total.toFixed(2)
    }
  });
});

/**
 * Add item to cart
 */
export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity = 1 } = req.body;

  // Validate product exists and is active
  const [products] = await pool.execute(
    'SELECT id, stock, isActive FROM products WHERE id = ?',
    [productId]
  );

  if (products.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  const product = products[0];

  if (!product.isActive) {
    return res.status(400).json({
      success: false,
      message: 'Product is not available'
    });
  }

  // Check stock
  if (product.stock < quantity) {
    return res.status(400).json({
      success: false,
      message: `Only ${product.stock} items available in stock`
    });
  }

  // Check if item already in cart
  const [existingItems] = await pool.execute(
    'SELECT id, quantity FROM carts WHERE userId = ? AND productId = ?',
    [userId, productId]
  );

  if (existingItems.length > 0) {
    const newQuantity = existingItems[0].quantity + quantity;

    if (product.stock < newQuantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }

    await pool.execute(
      'UPDATE carts SET quantity = ?, updatedAt = NOW() WHERE id = ?',
      [newQuantity, existingItems[0].id]
    );
  } else {
    await pool.execute(
      'INSERT INTO carts (userId, productId, quantity) VALUES (?, ?, ?)',
      [userId, productId, quantity]
    );
  }

  // Log activity
  await pool.execute(
    'INSERT INTO activity_logs (userId, action, entityType, entityId) VALUES (?, ?, ?, ?)',
    [userId, 'add_to_cart', 'product', productId]
  );

  res.json({
    success: true,
    message: 'Item added to cart'
  });
});

/**
 * Update cart item quantity
 */
export const updateCartItem = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    return res.status(400).json({
      success: false,
      message: 'Quantity must be at least 1'
    });
  }

  // Get cart item with product info
  const [cartItems] = await pool.execute(
    `SELECT c.*, p.stock, p.isActive
     FROM carts c
     JOIN products p ON c.productId = p.id
     WHERE c.id = ? AND c.userId = ?`,
    [id, userId]
  );

  if (cartItems.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Cart item not found'
    });
  }

  const cartItem = cartItems[0];

  if (!cartItem.isActive) {
    return res.status(400).json({
      success: false,
      message: 'Product is not available'
    });
  }

  if (cartItem.stock < quantity) {
    return res.status(400).json({
      success: false,
      message: `Only ${cartItem.stock} items available in stock`
    });
  }

  await pool.execute(
    'UPDATE carts SET quantity = ?, updatedAt = NOW() WHERE id = ?',
    [quantity, id]
  );

  res.json({
    success: true,
    message: 'Cart item updated'
  });
});

/**
 * Remove item from cart
 */
export const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const [result] = await pool.execute(
    'DELETE FROM carts WHERE id = ? AND userId = ?',
    [id, userId]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({
      success: false,
      message: 'Cart item not found'
    });
  }

  res.json({
    success: true,
    message: 'Item removed from cart'
  });
});

/**
 * Clear cart
 */
export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  await pool.execute(
    'DELETE FROM carts WHERE userId = ?',
    [userId]
  );

  res.json({
    success: true,
    message: 'Cart cleared'
  });
});

