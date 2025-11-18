import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api`
  : 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect to login if user was previously authenticated
      const hadToken = localStorage.getItem('token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if the user had a token (was logged in)
      // Don't redirect for public pages accessed without authentication
      if (hadToken && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  logout: () => api.post('/auth/logout/'),
  getCurrentUser: () => api.get('/auth/user/'),
  applySeller: () => api.post('/auth/apply-seller/'),
};

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products/', { params }),
  getById: (id) => api.get(`/products/${id}/`),
  getFeatured: () => api.get('/products/featured/'),
  create: (data, config) => {
    // For FormData, let the browser set the Content-Type with boundary
    const headers = data instanceof FormData 
      ? { ...config?.headers }
      : { 'Content-Type': 'application/json', ...config?.headers };
    
    return api.post('/products/', data, { ...config, headers });
  },
  update: (id, data, config) => {
    // For FormData, let the browser set the Content-Type with boundary
    const headers = data instanceof FormData 
      ? { ...config?.headers }
      : { 'Content-Type': 'application/json', ...config?.headers };
    
    return api.put(`/products/${id}/`, data, { ...config, headers });
  },
  delete: (id) => api.delete(`/products/${id}/`),
  uploadImage: (id, formData) => 
    api.post(`/products/${id}/upload_image/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories/'),
  getBySlug: (slug) => api.get(`/categories/${slug}/`),
};

// Cart API
export const cartAPI = {
  get: () => api.get('/cart/'),
  addItem: (productId, quantity = 1) => 
    api.post('/cart/add/', { product_id: productId, quantity }),
  updateItem: (itemId, quantity) => 
    api.patch('/cart/update/', { item_id: itemId, quantity }),
  removeItem: (itemId) => 
    api.delete('/cart/remove/', { data: { item_id: itemId } }),
  clear: () => api.post('/cart/clear/'),
};

// Wishlist API
export const wishlistAPI = {
  get: () => api.get('/wishlist/'),
  addProduct: (productId) => 
    api.post('/wishlist/add/', { product_id: productId }),
  removeProduct: (productId) => 
    api.delete('/wishlist/remove/', { data: { product_id: productId } }),
};

// Orders API
export const ordersAPI = {
  getAll: () => api.get('/orders/'),
  getById: (id) => api.get(`/orders/${id}/`),
  create: (data) => api.post('/orders/', data),
  updateStatus: (id, status) => 
    api.patch(`/orders/${id}/update_status/`, { status }),
};

// Reviews API
export const reviewsAPI = {
  getAll: (params) => api.get('/reviews/', { params }),
  create: (data) => api.post('/reviews/', data),
  update: (id, data) => api.put(`/reviews/${id}/`, data),
  delete: (id) => api.delete(`/reviews/${id}/`),
};

// Admin API
export const adminAPI = {
  getUsers: (params) => api.get('/admin/list_users/', { params }),
  approveSeller: (userId) => api.post(`/admin/${userId}/approve_seller/`),
  getPendingProducts: () => api.get('/admin/pending_products/'),
  approveProduct: (productId) => api.post(`/admin/products/${productId}/approve/`),
  rejectProduct: (productId) => api.post(`/admin/products/${productId}/reject/`),
};

// Seller API
export const sellerAPI = {
  getDashboard: () => api.get('/seller/dashboard/'),
};

export default api;
