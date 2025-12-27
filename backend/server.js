import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import {
  securityHeaders,
  apiLimiter,
  authLimiter,
  corsOptions,
} from "./middleware/security.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/orders.js";
import paymentRoutes from "./routes/payments.js";
import adminRoutes from "./routes/admin.js";
import messageRoutes from "./routes/messages.js";
import reviewRoutes from "./routes/reviews.js";
import translationRoutes from "./routes/translations.js";
import promoCodeRoutes from "./routes/promo-codes.js";
import bannerRoutes from "./routes/banners.js";
import notificationRoutes from "./routes/notifications.js";

const app = express();
const PORT = process.env.PORT || 3006;

// Middleware
app.use(compression());
app.use(morgan("dev"));
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/products", apiLimiter, productRoutes);
app.use("/api/cart", apiLimiter, cartRoutes);
app.use("/api/orders", apiLimiter, orderRoutes);
app.use("/api/payments", apiLimiter, paymentRoutes);
app.use("/api/messages", apiLimiter, messageRoutes);
app.use("/api/reviews", apiLimiter, reviewRoutes);
app.use("/api/translations", apiLimiter, translationRoutes);
app.use("/api/promo-codes", apiLimiter, promoCodeRoutes);
app.use("/api/banners", apiLimiter, bannerRoutes);
app.use("/api/notifications", apiLimiter, notificationRoutes);
app.use("/api/admin", apiLimiter, adminRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
});

export default app;
