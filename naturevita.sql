-- Database schema for NatureVita E-commerce Platform
-- Generated on: 2025-10-14
-- Database: MySQL

-- Create database
CREATE DATABASE IF NOT EXISTS naturevita CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE naturevita;

-- Table: users
CREATE TABLE users (
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
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: products
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    price FLOAT NOT NULL,
    description TEXT NOT NULL,
    shortDescription VARCHAR(255) NULL,
    imageUrl VARCHAR(500) NULL,
    gallery JSON NULL,
    category VARCHAR(100) NULL,
    stock INT NOT NULL DEFAULT 0,
    isActive BOOLEAN DEFAULT TRUE,
    isFeatured BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: orders
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    orderNumber VARCHAR(50) NOT NULL UNIQUE,
    totalAmount FLOAT NOT NULL,
    status ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    paymentMethod VARCHAR(50) NULL,
    paymentId VARCHAR(255) NULL,
    shippingAddress JSON NULL,
    notes TEXT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Table: order_items
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL,
    price FLOAT NOT NULL,
    subtotal FLOAT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

-- Table: reviews
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    productId INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    isApproved BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY review_user_product_unique (userId, productId)
);

-- Table: messages
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
    reply TEXT NULL,
    repliedAt DATETIME NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: wishlists
CREATE TABLE wishlists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    productId INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY wishlist_user_product_unique (userId, productId)
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_userId ON orders(userId);
CREATE INDEX idx_orders_orderNumber ON orders(orderNumber);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_orderId ON order_items(orderId);
CREATE INDEX idx_order_items_productId ON order_items(productId);
CREATE INDEX idx_reviews_userId ON reviews(userId);
CREATE INDEX idx_reviews_productId ON reviews(productId);
CREATE INDEX idx_reviews_isApproved ON reviews(isApproved);
CREATE INDEX idx_wishlists_userId ON wishlists(userId);
CREATE INDEX idx_wishlists_productId ON wishlists(productId);

-- Trigger to generate orderNumber before insert
DELIMITER $$
CREATE TRIGGER generate_order_number
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
    IF NEW.orderNumber IS NULL OR NEW.orderNumber = '' THEN
        SET NEW.orderNumber = CONCAT('NV-', DATE_FORMAT(NOW(), '%y%m%d'), '-', LPAD(FLOOR(RAND() * 10000), 4, '0'));
    END IF;
END$$
DELIMITER ;

-- Insert sample data for testing
-- Sample admin user (password: admin123)
INSERT INTO users (name, email, password, role, phone, address, city, country, isActive) VALUES 
('Admin User', 'admin@naturevita.com', '$2a$12$rZ7znSJprkw9.EKbktRs9uYvhj5tKoD1QXfDKNn6PXnJElF9SaXaS', 'admin', '+237612345678', '123 Admin Street', 'Douala', 'Cameroon', TRUE),
('John Doe', 'john.doe@example.com', '$2a$12$rZ7znSJprkw9.EKbktRs9uYvhj5tKoD1QXfDKNn6PXnJElF9SaXaS', 'user', '+237612345679', '456 User Avenue', 'Yaounde', 'Cameroon', TRUE);

-- Sample products
INSERT INTO products (name, slug, price, description, shortDescription, imageUrl, category, stock, isActive, isFeatured) VALUES 
('Jinja Premium - Racine Séchée', 'jinja-premium-racine-sechee', 15000, 'Racine de Jinja premium séchée naturellement, reconnue pour ses propriétés énergisantes et ses bienfaits pour la santé masculine.', 'Racine de Jinja premium séchée naturellement', 'jinja-product.jpg', 'jinja', 50, TRUE, TRUE),
('Jinja Poudre Bio', 'jinja-poudre-bio', 12000, 'Poudre de Jinja finement moulue, idéale pour préparer vos tisanes et décoctions traditionnelles.', 'Poudre de Jinja finement moulue', 'jinja-product.jpg', 'jinja', 30, TRUE, FALSE),
('IRU Soap - Savon Clarifiant', 'iru-soap-savon-clarifiant', 8000, 'Savon artisanal IRU aux propriétés clarifiantes, parfait pour tous types de peau, formulé avec des ingrédients naturels.', 'Savon artisanal IRU aux propriétés clarifiantes', 'iru-soap.jpg', 'soap', 100, TRUE, TRUE),
('IRU Soap - Savon Exfoliant', 'iru-soap-savon-exfoliant', 9000, 'Savon exfoliant doux aux extraits naturels, élimine les cellules mortes et révèle la beauté naturelle de votre peau.', 'Savon exfoliant doux aux extraits naturels', 'iru-soap.jpg', 'soap', 75, TRUE, FALSE),
('Miel de Fleurs Sauvages', 'miel-fleurs-sauvages', 6000, 'Miel pur de fleurs sauvages, récolté dans nos ruches naturelles, riche en enzymes et antioxydants.', 'Miel pur de fleurs sauvages', 'honey-product.jpg', 'honey', 40, TRUE, TRUE),
('Miel d\'Acacia Premium', 'miel-acacia-premium', 8000, 'Miel d\'acacia cristallisé lentement, aux propriétés apaisantes et au goût délicat, parfait pour le bien-être quotidien.', 'Miel d\'acacia cristallisé lentement', 'honey-product.jpg', 'honey', 35, TRUE, FALSE);

-- Sample orders (orderNumber will be generated automatically)
INSERT INTO orders (userId, totalAmount, status, paymentMethod, shippingAddress) VALUES 
(2, 27000, 'processing', 'monetbil', '{"name": "John Doe", "address": "456 User Avenue", "city": "Yaounde", "country": "Cameroon", "phone": "+237612345679"}');

-- Sample order items
INSERT INTO order_items (orderId, productId, quantity, price, subtotal) VALUES 
(1, 1, 1, 15000, 15000),
(1, 3, 1, 8000, 8000),
(1, 5, 1, 6000, 6000);

-- Sample reviews
INSERT INTO reviews (userId, productId, rating, comment, isApproved) VALUES 
(2, 1, 5, 'Excellent produit! J\'ai ressenti une énergie incroyable après quelques jours d\'utilisation.', TRUE),
(2, 3, 4, 'Très bon savon, ma peau est devenue plus douce et éclatante. Livraison rapide également.', TRUE);

-- Sample messages
INSERT INTO messages (name, email, subject, message, status) VALUES 
('Alice Martin', 'alice.martin@example.com', 'Question sur les produits', 'Bonjour, j\'aimerais savoir si vos produits sont certifiés biologiques. Merci!', 'unread');

-- Sample wishlist items
INSERT INTO wishlists (userId, productId) VALUES 
(2, 2),
(2, 4);

-- Create views for common queries
CREATE VIEW user_orders AS
SELECT 
    o.id,
    o.orderNumber,
    o.totalAmount,
    o.status,
    o.paymentMethod,
    o.createdAt,
    u.name AS customerName,
    u.email AS customerEmail
FROM orders o
JOIN users u ON o.userId = u.id;

CREATE VIEW product_reviews AS
SELECT 
    r.id,
    r.rating,
    r.comment,
    r.isApproved,
    r.createdAt,
    u.name AS userName,
    p.name AS productName
FROM reviews r
JOIN users u ON r.userId = u.id
JOIN products p ON r.productId = p.id
WHERE r.isApproved = TRUE;

CREATE VIEW order_details AS
SELECT 
    o.id AS orderId,
    o.orderNumber,
    o.totalAmount,
    o.status,
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

-- Stored procedures for common operations
DELIMITER //

CREATE PROCEDURE GetUserOrderHistory(IN userId INT)
BEGIN
    SELECT 
        o.id,
        o.orderNumber,
        o.totalAmount,
        o.status,
        o.createdAt
    FROM orders o
    WHERE o.userId = userId
    ORDER BY o.createdAt DESC;
END //

CREATE PROCEDURE GetProductReviews(IN productId INT)
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

CREATE PROCEDURE UpdateProductStock(IN productId INT, IN quantity INT)
BEGIN
    UPDATE products 
    SET stock = stock - quantity 
    WHERE id = productId AND stock >= quantity;
END //

DELIMITER ;