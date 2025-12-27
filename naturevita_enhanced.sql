-- ============================================
-- NATUREVITA E-COMMERCE PLATFORM
-- Enhanced Database Schema
-- Version: 2.0
-- ============================================

CREATE DATABASE IF NOT EXISTS naturevita CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE naturevita;

-- ============================================
-- EXISTING TABLES (Enhanced)
-- ============================================

-- Table: users (Enhanced with email verification)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    phone VARCHAR(20) NULL,
    address VARCHAR(255) NULL,
    city VARCHAR(100) NULL,
    country VARCHAR(100) NULL,
    isActive BOOLEAN DEFAULT TRUE,
    isEmailVerified BOOLEAN DEFAULT FALSE,
    emailVerificationToken VARCHAR(255) NULL,
    resetPasswordToken VARCHAR(255) NULL,
    resetPasswordExpires DATETIME NULL,
    lastLogin DATETIME NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_isActive (isActive)
);

-- Table: categories (NEW)
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NULL,
    imageUrl VARCHAR(500) NULL,
    parentId INT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    sortOrder INT DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parentId) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_categories_slug (slug),
    INDEX idx_categories_parentId (parentId)
);

-- Table: products (Enhanced with categoryId)
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    price FLOAT NOT NULL,
    description TEXT NOT NULL,
    shortDescription VARCHAR(255) NULL,
    imageUrl VARCHAR(500) NULL,
    gallery JSON NULL,
    categoryId INT NULL,
    category VARCHAR(100) NULL, -- Keep for backward compatibility
    stock INT NOT NULL DEFAULT 0,
    minStock INT DEFAULT 5,
    sku VARCHAR(100) NULL UNIQUE,
    weight FLOAT NULL,
    dimensions VARCHAR(100) NULL,
    isActive BOOLEAN DEFAULT TRUE,
    isFeatured BOOLEAN DEFAULT FALSE,
    views INT DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_products_slug (slug),
    INDEX idx_products_categoryId (categoryId),
    INDEX idx_products_category (category),
    INDEX idx_products_isActive (isActive),
    INDEX idx_products_isFeatured (isFeatured),
    INDEX idx_products_sku (sku)
);

-- Table: carts (NEW)
CREATE TABLE IF NOT EXISTS carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY cart_user_product_unique (userId, productId),
    INDEX idx_carts_userId (userId),
    INDEX idx_carts_productId (productId)
);

-- Table: orders (Enhanced)
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    orderNumber VARCHAR(50) NOT NULL UNIQUE,
    totalAmount FLOAT NOT NULL,
    subtotal FLOAT NOT NULL,
    tax FLOAT DEFAULT 0,
    shippingCost FLOAT DEFAULT 0,
    discount FLOAT DEFAULT 0,
    promoCode VARCHAR(50) NULL,
    status ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    paymentMethod VARCHAR(50) NULL,
    paymentId VARCHAR(255) NULL,
    paymentStatus ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    shippingAddress JSON NULL,
    notes TEXT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_orders_userId (userId),
    INDEX idx_orders_orderNumber (orderNumber),
    INDEX idx_orders_status (status),
    INDEX idx_orders_paymentStatus (paymentStatus)
);

-- Table: order_items
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL,
    price FLOAT NOT NULL,
    subtotal FLOAT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_order_items_orderId (orderId),
    INDEX idx_order_items_productId (productId)
);

-- Table: payments (NEW)
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    userId INT NOT NULL,
    paymentMethod VARCHAR(50) NOT NULL,
    amount FLOAT NOT NULL,
    currency VARCHAR(10) DEFAULT 'XAF',
    transactionId VARCHAR(255) NULL UNIQUE,
    monetbilId VARCHAR(255) NULL,
    status ENUM('pending', 'completed', 'failed', 'cancelled', 'refunded') DEFAULT 'pending',
    metadata JSON NULL,
    errorMessage TEXT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_payments_orderId (orderId),
    INDEX idx_payments_userId (userId),
    INDEX idx_payments_transactionId (transactionId),
    INDEX idx_payments_status (status)
);

-- Table: promo_codes (NEW)
CREATE TABLE IF NOT EXISTS promo_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NULL,
    discountType ENUM('percentage', 'fixed') NOT NULL,
    discountValue FLOAT NOT NULL,
    minPurchase FLOAT NULL,
    maxDiscount FLOAT NULL,
    usageLimit INT NULL,
    usedCount INT DEFAULT 0,
    isActive BOOLEAN DEFAULT TRUE,
    validFrom DATETIME NULL,
    validUntil DATETIME NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_promo_codes_code (code),
    INDEX idx_promo_codes_isActive (isActive)
);

-- Table: reviews
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    productId INT NOT NULL,
    orderId INT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    isApproved BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE SET NULL,
    UNIQUE KEY review_user_product_unique (userId, productId),
    INDEX idx_reviews_userId (userId),
    INDEX idx_reviews_productId (productId),
    INDEX idx_reviews_isApproved (isApproved),
    INDEX idx_reviews_rating (rating)
);

-- Table: messages
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
    reply TEXT NULL,
    repliedBy INT NULL,
    repliedAt DATETIME NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (repliedBy) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_messages_status (status),
    INDEX idx_messages_userId (userId)
);

-- Table: wishlists
CREATE TABLE IF NOT EXISTS wishlists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    productId INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY wishlist_user_product_unique (userId, productId),
    INDEX idx_wishlists_userId (userId),
    INDEX idx_wishlists_productId (productId)
);

-- Table: email_verifications (NEW)
CREATE TABLE IF NOT EXISTS email_verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expiresAt DATETIME NOT NULL,
    isUsed BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_email_verifications_token (token),
    INDEX idx_email_verifications_userId (userId)
);

-- Table: activity_logs (NEW)
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NULL,
    action VARCHAR(100) NOT NULL,
    entityType VARCHAR(50) NULL,
    entityId INT NULL,
    description TEXT NULL,
    ipAddress VARCHAR(45) NULL,
    userAgent TEXT NULL,
    metadata JSON NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_activity_logs_userId (userId),
    INDEX idx_activity_logs_action (action),
    INDEX idx_activity_logs_entityType (entityType),
    INDEX idx_activity_logs_createdAt (createdAt)
);

-- Table: translations (NEW)
CREATE TABLE IF NOT EXISTS translations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key VARCHAR(255) NOT NULL,
    language VARCHAR(10) NOT NULL,
    value TEXT NOT NULL,
    context VARCHAR(100) NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY translation_key_language_unique (key, language),
    INDEX idx_translations_key (key),
    INDEX idx_translations_language (language)
);

-- Table: notifications (NEW)
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(500) NULL,
    isRead BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notifications_userId (userId),
    INDEX idx_notifications_isRead (isRead),
    INDEX idx_notifications_createdAt (createdAt)
);

-- Table: banners (NEW)
CREATE TABLE IF NOT EXISTS banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    imageUrl VARCHAR(500) NOT NULL,
    link VARCHAR(500) NULL,
    position VARCHAR(50) DEFAULT 'home',
    isActive BOOLEAN DEFAULT TRUE,
    sortOrder INT DEFAULT 0,
    validFrom DATETIME NULL,
    validUntil DATETIME NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_banners_position (position),
    INDEX idx_banners_isActive (isActive)
);

-- ============================================
-- TRIGGERS
-- ============================================

DELIMITER $$

-- Trigger to generate orderNumber
CREATE TRIGGER IF NOT EXISTS generate_order_number
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
    IF NEW.orderNumber IS NULL OR NEW.orderNumber = '' THEN
        SET NEW.orderNumber = CONCAT('NV-', DATE_FORMAT(NOW(), '%y%m%d'), '-', LPAD(FLOOR(RAND() * 10000), 4, '0'));
    END IF;
END$$

-- Trigger to update product views
CREATE TRIGGER IF NOT EXISTS update_product_views
AFTER INSERT ON activity_logs
FOR EACH ROW
BEGIN
    IF NEW.action = 'view_product' AND NEW.entityType = 'product' THEN
        UPDATE products SET views = views + 1 WHERE id = NEW.entityId;
    END IF;
END$$

DELIMITER ;

-- ============================================
-- VIEWS
-- ============================================

CREATE OR REPLACE VIEW user_orders AS
SELECT 
    o.id,
    o.orderNumber,
    o.totalAmount,
    o.status,
    o.paymentMethod,
    o.paymentStatus,
    o.createdAt,
    u.name AS customerName,
    u.email AS customerEmail
FROM orders o
JOIN users u ON o.userId = u.id;

CREATE OR REPLACE VIEW product_reviews AS
SELECT 
    r.id,
    r.rating,
    r.comment,
    r.isApproved,
    r.createdAt,
    u.name AS userName,
    p.name AS productName,
    p.id AS productId
FROM reviews r
JOIN users u ON r.userId = u.id
JOIN products p ON r.productId = p.id
WHERE r.isApproved = TRUE;

CREATE OR REPLACE VIEW order_details AS
SELECT 
    o.id AS orderId,
    o.orderNumber,
    o.totalAmount,
    o.status,
    o.paymentStatus,
    o.createdAt,
    u.name AS customerName,
    u.email AS customerEmail,
    oi.productId,
    p.name AS productName,
    oi.quantity,
    oi.price,
    oi.subtotal
FROM orders o
JOIN users u ON o.userId = u.id
JOIN order_items oi ON o.id = oi.orderId
JOIN products p ON oi.productId = p.id;

CREATE OR REPLACE VIEW sales_statistics AS
SELECT 
    DATE(o.createdAt) AS saleDate,
    COUNT(o.id) AS totalOrders,
    SUM(o.totalAmount) AS totalRevenue,
    AVG(o.totalAmount) AS averageOrderValue,
    COUNT(DISTINCT o.userId) AS uniqueCustomers
FROM orders o
WHERE o.status IN ('paid', 'processing', 'shipped', 'delivered')
GROUP BY DATE(o.createdAt);

-- ============================================
-- STORED PROCEDURES
-- ============================================

DELIMITER //

CREATE PROCEDURE IF NOT EXISTS GetUserOrderHistory(IN userId INT)
BEGIN
    SELECT 
        o.id,
        o.orderNumber,
        o.totalAmount,
        o.status,
        o.paymentStatus,
        o.createdAt
    FROM orders o
    WHERE o.userId = userId
    ORDER BY o.createdAt DESC;
END //

CREATE PROCEDURE IF NOT EXISTS GetProductReviews(IN productId INT)
BEGIN
    SELECT 
        r.rating,
        r.comment,
        r.createdAt,
        u.name AS userName
    FROM reviews r
    JOIN users u ON r.userId = u.id
    WHERE r.productId = productId AND r.isApproved = TRUE
    ORDER BY r.createdAt DESC;
END //

CREATE PROCEDURE IF NOT EXISTS UpdateProductStock(IN productId INT, IN quantity INT)
BEGIN
    UPDATE products 
    SET stock = stock - quantity 
    WHERE id = productId AND stock >= quantity;
END //

CREATE PROCEDURE IF NOT EXISTS GetDashboardStats(IN startDate DATETIME, IN endDate DATETIME)
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM orders WHERE createdAt BETWEEN startDate AND endDate) AS totalOrders,
        (SELECT COUNT(*) FROM orders WHERE status = 'pending' AND createdAt BETWEEN startDate AND endDate) AS pendingOrders,
        (SELECT SUM(totalAmount) FROM orders WHERE status IN ('paid', 'processing', 'shipped', 'delivered') AND createdAt BETWEEN startDate AND endDate) AS totalRevenue,
        (SELECT COUNT(*) FROM users WHERE createdAt BETWEEN startDate AND endDate) AS newUsers,
        (SELECT COUNT(*) FROM products WHERE isActive = TRUE) AS activeProducts,
        (SELECT COUNT(*) FROM messages WHERE status = 'unread') AS unreadMessages;
END //

DELIMITER ;

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Admin user (password: admin123)
INSERT INTO users (name, email, password, role, phone, address, city, country, isActive, isEmailVerified) VALUES 
('Admin User', 'admin@naturevita.com', '$2a$12$rZ7znSJprkw9.EKbktRs9uYvhj5tKoD1QXfDKNn6PXnJElF9SaXaS', 'admin', '+237612345678', '123 Admin Street', 'Douala', 'Cameroon', TRUE, TRUE),
('John Doe', 'john.doe@example.com', '$2a$12$rZ7znSJprkw9.EKbktRs9uYvhj5tKoD1QXfDKNn6PXnJElF9SaXaS', 'user', '+237612345679', '456 User Avenue', 'Yaounde', 'Cameroon', TRUE, TRUE)
ON DUPLICATE KEY UPDATE name=name;

-- Categories
INSERT INTO categories (name, slug, description, isActive, sortOrder) VALUES
('Jinja', 'jinja', 'Produits à base de Jinja', TRUE, 1),
('Savons', 'soap', 'Savons naturels IRU', TRUE, 2),
('Miel', 'honey', 'Miels naturels et purs', TRUE, 3),
('Compléments', 'supplements', 'Compléments alimentaires naturels', TRUE, 4),
('Cosmétiques', 'cosmetics', 'Produits cosmétiques naturels', TRUE, 5)
ON DUPLICATE KEY UPDATE name=name;

-- Products
INSERT INTO products (name, slug, price, description, shortDescription, imageUrl, categoryId, category, stock, isActive, isFeatured, sku) VALUES 
('Jinja Premium - Racine Séchée', 'jinja-premium-racine-sechee', 15000, 'Racine de Jinja premium séchée naturellement, reconnue pour ses propriétés énergisantes et ses bienfaits pour la santé masculine.', 'Racine de Jinja premium séchée naturellement', 'jinja-product.jpg', 1, 'jinja', 50, TRUE, TRUE, 'NV-JINJA-001'),
('Jinja Poudre Bio', 'jinja-poudre-bio', 12000, 'Poudre de Jinja finement moulue, idéale pour préparer vos tisanes et décoctions traditionnelles.', 'Poudre de Jinja finement moulue', 'jinja-product.jpg', 1, 'jinja', 30, TRUE, FALSE, 'NV-JINJA-002'),
('IRU Soap - Savon Clarifiant', 'iru-soap-savon-clarifiant', 8000, 'Savon artisanal IRU aux propriétés clarifiantes, parfait pour tous types de peau, formulé avec des ingrédients naturels.', 'Savon artisanal IRU aux propriétés clarifiantes', 'iru-soap.jpg', 2, 'soap', 100, TRUE, TRUE, 'NV-SOAP-001'),
('IRU Soap - Savon Exfoliant', 'iru-soap-savon-exfoliant', 9000, 'Savon exfoliant doux aux extraits naturels, élimine les cellules mortes et révèle la beauté naturelle de votre peau.', 'Savon exfoliant doux aux extraits naturels', 'iru-soap.jpg', 2, 'soap', 75, TRUE, FALSE, 'NV-SOAP-002'),
('Miel de Fleurs Sauvages', 'miel-fleurs-sauvages', 6000, 'Miel pur de fleurs sauvages, récolté dans nos ruches naturelles, riche en enzymes et antioxydants.', 'Miel pur de fleurs sauvages', 'honey-product.jpg', 3, 'honey', 40, TRUE, TRUE, 'NV-HONEY-001'),
('Miel d\'Acacia Premium', 'miel-acacia-premium', 8000, 'Miel d\'acacia cristallisé lentement, aux propriétés apaisantes et au goût délicat, parfait pour le bien-être quotidien.', 'Miel d\'acacia cristallisé lentement', 'honey-product.jpg', 3, 'honey', 35, TRUE, FALSE, 'NV-HONEY-002')
ON DUPLICATE KEY UPDATE name=name;

-- Promo codes
INSERT INTO promo_codes (code, description, discountType, discountValue, minPurchase, maxDiscount, usageLimit, isActive, validFrom, validUntil) VALUES
('WELCOME10', 'Code de bienvenue - 10% de réduction', 'percentage', 10, 10000, 5000, 100, TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 1 YEAR)),
('SAVE5000', 'Économisez 5000 FCFA', 'fixed', 5000, 20000, 5000, 50, TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 6 MONTH))
ON DUPLICATE KEY UPDATE code=code;

-- Translations (sample)
INSERT INTO translations (key, language, value, context) VALUES
('welcome', 'fr', 'Bienvenue', 'general'),
('welcome', 'en', 'Welcome', 'general'),
('add_to_cart', 'fr', 'Ajouter au panier', 'product'),
('add_to_cart', 'en', 'Add to cart', 'product'),
('checkout', 'fr', 'Passer la commande', 'order'),
('checkout', 'en', 'Checkout', 'order')
ON DUPLICATE KEY UPDATE value=value;

