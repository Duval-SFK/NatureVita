// API Service for backend communication

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3006/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getToken() {
    const user = localStorage.getItem('naturevita-user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.token || null;
    }
    return null;
  }

  // Make API request
  async request(endpoint, options = {}) {
    const token = this.getToken();
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(data) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Product endpoints
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products${queryString ? `?${queryString}` : ''}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async getFeaturedProducts(limit = 6) {
    return this.request(`/products/featured?limit=${limit}`);
  }

  async getCategories() {
    return this.request('/products/categories');
  }

  // Cart endpoints
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId, quantity = 1) {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(id, quantity) {
    return this.request(`/cart/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(id) {
    return this.request(`/cart/${id}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.request('/cart', {
      method: 'DELETE',
    });
  }

  // Order endpoints
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/orders${queryString ? `?${queryString}` : ''}`);
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  async cancelOrder(id) {
    return this.request(`/orders/${id}/cancel`, {
      method: 'PATCH',
    });
  }

  // Payment endpoints
  async initiatePayment(orderId) {
    return this.request('/payments/initiate', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
  }

  async getPaymentStatus(orderId) {
    return this.request(`/payments/status/${orderId}`);
  }

  // Review endpoints
  async createReview(reviewData) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async getProductReviews(productId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reviews/product/${productId}${queryString ? `?${queryString}` : ''}`);
  }

  // Message endpoints
  async sendMessage(messageData) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async getUserMessages() {
    return this.request('/messages');
  }

  // Admin endpoints
  async getDashboardStats(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/dashboard${queryString ? `?${queryString}` : ''}`);
  }

  async getAllOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/orders${queryString ? `?${queryString}` : ''}`);
  }

  async getOrderDetails(id) {
    return this.request(`/admin/orders/${id}`);
  }

  async updateOrderStatus(id, status) {
    return this.request(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getAllProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/products${queryString ? `?${queryString}` : ''}`);
  }

  async createProduct(productData) {
    return this.request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return this.request(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  }

  async getAllUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/users${queryString ? `?${queryString}` : ''}`);
  }

  async getUserDetails(id) {
    return this.request(`/admin/users/${id}`);
  }

  async updateUser(id, userData) {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getAllMessages(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/messages${queryString ? `?${queryString}` : ''}`);
  }

  async getMessageDetails(id) {
    return this.request(`/admin/messages/${id}`);
  }

  async replyToMessage(id, reply) {
    return this.request(`/admin/messages/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ reply }),
    });
  }

  async getAllReviews(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/reviews${queryString ? `?${queryString}` : ''}`);
  }

  async approveReview(id) {
    return this.request(`/admin/reviews/${id}/approve`, {
      method: 'PATCH',
    });
  }

  async getAllCategories() {
    return this.request('/admin/categories');
  }

  async createCategory(categoryData) {
    return this.request('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id, categoryData) {
    return this.request(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  // Translation endpoints
  async getTranslations(language = 'fr', context = null) {
    const params = new URLSearchParams({ language });
    if (context) params.append('context', context);
    return this.request(`/translations?${params.toString()}`);
  }

  // Promo code endpoints
  async validatePromoCode(code, amount) {
    return this.request('/promo-codes/validate', {
      method: 'POST',
      body: JSON.stringify({ code, amount }),
    });
  }

  async applyPromoCode(code) {
    return this.request('/promo-codes/apply', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  // Banner endpoints
  async getBanners(position = 'home') {
    return this.request(`/banners?position=${position}`);
  }

  // Admin promo codes
  async getAllPromoCodes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/promo-codes${queryString ? `?${queryString}` : ''}`);
  }

  async createPromoCode(promoCodeData) {
    return this.request('/admin/promo-codes', {
      method: 'POST',
      body: JSON.stringify(promoCodeData),
    });
  }

  async updatePromoCode(id, promoCodeData) {
    return this.request(`/admin/promo-codes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(promoCodeData),
    });
  }

  async deletePromoCode(id) {
    return this.request(`/admin/promo-codes/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin banners
  async getAllBanners(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/banners${queryString ? `?${queryString}` : ''}`);
  }

  async createBanner(bannerData) {
    return this.request('/admin/banners', {
      method: 'POST',
      body: JSON.stringify(bannerData),
    });
  }

  async updateBanner(id, bannerData) {
    return this.request(`/admin/banners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bannerData),
    });
  }

  async deleteBanner(id) {
    return this.request(`/admin/banners/${id}`, {
      method: 'DELETE',
    });
  }

  // Notification endpoints
  async getNotifications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/notifications${queryString ? `?${queryString}` : ''}`);
  }

  async markNotificationAsRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', {
      method: 'PATCH',
    });
  }

  async deleteNotification(id) {
    return this.request(`/notifications/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();

