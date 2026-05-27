import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { products as catalogProducts } from '../data/products';

const API_BASE_URL = 'https://your-backend-domain.com/api';
const MOCK_DB_KEY = 'computer_store_mock_db_v1';
const MOCK_TOKEN_PREFIX = 'mock-token-';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('authToken');
    }
    return Promise.reject(error);
  },
);

function flattenProducts() {
  return Object.values(catalogProducts)
    .flat()
    .map((product) => ({
      ...product,
      reviews: [],
      createdAt: new Date().toISOString(),
    }));
}

function buildSeedDb() {
  const seededProducts = flattenProducts();
  const seededUser = {
    id: 'user_demo',
    name: 'Demo Shopper',
    email: 'demo@pcbuilderpro.com',
    password: 'password123',
    avatar: 'https://via.placeholder.com/100/007AFF/FFFFFF?text=Demo',
    createdAt: new Date().toISOString(),
  };

  return {
    users: [seededUser],
    products: seededProducts,
    orders: [],
    paymentIntents: [],
  };
}

async function readMockDb() {
  try {
    const raw = await SecureStore.getItemAsync(MOCK_DB_KEY);
    if (!raw) {
      const seeded = buildSeedDb();
      await SecureStore.setItemAsync(MOCK_DB_KEY, JSON.stringify(seeded));
      return seeded;
    }

    return JSON.parse(raw);
  } catch (_) {
    const seeded = buildSeedDb();
    await SecureStore.setItemAsync(MOCK_DB_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

async function writeMockDb(db) {
  await SecureStore.setItemAsync(MOCK_DB_KEY, JSON.stringify(db));
}

async function getCurrentMockUser(db) {
  const token = await SecureStore.getItemAsync('authToken');
  if (!token || !token.startsWith(MOCK_TOKEN_PREFIX)) {
    return null;
  }

  const userId = token.replace(MOCK_TOKEN_PREFIX, '');
  return db.users.find((user) => user.id === userId) || null;
}

function buildTracking(order) {
  const createdAt = new Date(order.createdAt);
  const estimated = new Date(createdAt.getTime() + 1000 * 60 * 60 * 24 * 4);

  return {
    trackingNumber: `TRK-${order.id.slice(-8).toUpperCase()}`,
    carrier: 'Demo Logistics',
    estimatedDelivery: estimated.toISOString(),
  };
}

async function fallbackAuthLogin(email, password) {
  const db = await readMockDb();
  const user = db.users.find((candidate) => candidate.email.toLowerCase() === String(email).toLowerCase());

  if (!user || user.password !== password) {
    throw new Error('Invalid email or password');
  }

  const token = `${MOCK_TOKEN_PREFIX}${user.id}`;
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
  };
}

async function fallbackAuthRegister(userData) {
  const db = await readMockDb();
  const existing = db.users.find((candidate) => candidate.email.toLowerCase() === String(userData.email).toLowerCase());

  if (existing) {
    throw new Error('Email already exists');
  }

  const newUser = {
    id: `user_${Date.now()}`,
    name: userData.name,
    email: userData.email,
    password: userData.password,
    avatar: `https://via.placeholder.com/100/007AFF/FFFFFF?text=${encodeURIComponent((userData.name || 'U').slice(0, 1).toUpperCase())}`,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  await writeMockDb(db);

  const token = `${MOCK_TOKEN_PREFIX}${newUser.id}`;
  return {
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
      createdAt: newUser.createdAt,
    },
  };
}

async function fallbackGetProfile() {
  const db = await readMockDb();
  const user = await getCurrentMockUser(db);

  if (!user) {
    throw new Error('Not authenticated');
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    createdAt: user.createdAt,
  };
}

async function fallbackUpdateProfile(profileData) {
  const db = await readMockDb();
  const user = await getCurrentMockUser(db);

  if (!user) {
    throw new Error('Not authenticated');
  }

  user.name = profileData.name || user.name;
  user.avatar = profileData.avatar || user.avatar;

  await writeMockDb(db);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    createdAt: user.createdAt,
  };
}

function filterProducts(productList, filters = {}) {
  let next = [...productList];

  if (filters.category && filters.category !== 'all') {
    next = next.filter((product) => product.category.toLowerCase().includes(String(filters.category).toLowerCase()));
  }

  if (filters.q || filters.search) {
    const query = String(filters.q || filters.search).toLowerCase();
    next = next.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query),
    );
  }

  if (filters.minPrice) {
    next = next.filter((product) => Number(product.price) >= Number(filters.minPrice));
  }

  if (filters.maxPrice) {
    next = next.filter((product) => Number(product.price) <= Number(filters.maxPrice));
  }

  if (filters.sort === 'price_asc') {
    next.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (filters.sort === 'price_desc') {
    next.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (filters.sort === 'name') {
    next.sort((a, b) => a.name.localeCompare(b.name));
  }

  return next;
}

async function fallbackGetProducts(filters = {}) {
  const db = await readMockDb();
  return filterProducts(db.products, filters);
}

async function fallbackGetProduct(productId) {
  const db = await readMockDb();
  const product = db.products.find((candidate) => candidate.id === productId);

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
}

async function fallbackGetReviews(productId) {
  const product = await fallbackGetProduct(productId);
  return product.reviews || [];
}

async function fallbackAddReview(productId, review) {
  const db = await readMockDb();
  const user = await getCurrentMockUser(db);
  const product = db.products.find((candidate) => candidate.id === productId);

  if (!user) {
    throw new Error('Not authenticated');
  }

  if (!product) {
    throw new Error('Product not found');
  }

  const nextReview = {
    id: `review_${Date.now()}`,
    user: { id: user.id, name: user.name },
    rating: Number(review.rating),
    title: review.title || '',
    comment: review.comment || '',
    createdAt: new Date().toISOString(),
  };

  if (!Array.isArray(product.reviews)) {
    product.reviews = [];
  }

  product.reviews.push(nextReview);
  await writeMockDb(db);
  return nextReview;
}

async function fallbackCreateOrder(orderData) {
  const db = await readMockDb();
  const user = await getCurrentMockUser(db);

  if (!user) {
    throw new Error('Not authenticated');
  }

  const order = {
    id: `order_${Date.now()}`,
    userId: user.id,
    items: orderData.items || [],
    shippingInfo: orderData.shippingInfo || {},
    paymentSummary: orderData.paymentSummary || {},
    subtotal: Number(orderData.subtotal || 0),
    shipping: Number(orderData.shipping || 0),
    tax: Number(orderData.tax || 0),
    total: Number(orderData.total || 0),
    status: 'ordered',
    createdAt: new Date().toISOString(),
  };

  db.orders.unshift(order);
  await writeMockDb(db);
  return order;
}

async function fallbackGetOrders() {
  const db = await readMockDb();
  const user = await getCurrentMockUser(db);

  if (!user) {
    throw new Error('Not authenticated');
  }

  return db.orders.filter((order) => order.userId === user.id);
}

async function fallbackGetOrder(orderId) {
  const orders = await fallbackGetOrders();
  const order = orders.find((candidate) => candidate.id === orderId);

  if (!order) {
    throw new Error('Order not found');
  }

  return order;
}

async function fallbackCancelOrder(orderId) {
  const db = await readMockDb();
  const user = await getCurrentMockUser(db);

  if (!user) {
    throw new Error('Not authenticated');
  }

  const order = db.orders.find((candidate) => candidate.id === orderId && candidate.userId === user.id);

  if (!order) {
    throw new Error('Order not found');
  }

  order.status = 'cancelled';
  await writeMockDb(db);
  return order;
}

async function fallbackTrackOrder(orderId) {
  const order = await fallbackGetOrder(orderId);
  return buildTracking(order);
}

async function fallbackCreatePaymentIntent(amount) {
  return {
    paymentIntent: `pi_mock_${Date.now()}`,
    ephemeralKey: `eph_mock_${Date.now()}`,
    customer: 'cus_mock_demo',
    amount,
  };
}

async function withFallback(primaryCall, fallbackCall) {
  try {
    return await primaryCall();
  } catch (_) {
    return fallbackCall();
  }
}

export const authAPI = {
  login: async (email, password) =>
    withFallback(
      async () => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
      },
      async () => fallbackAuthLogin(email, password),
    ),

  register: async (userData) =>
    withFallback(
      async () => {
        const response = await api.post('/auth/register', userData);
        return response.data;
      },
      async () => fallbackAuthRegister(userData),
    ),

  logout: async () => {
    await SecureStore.deleteItemAsync('authToken');
  },

  getProfile: async () =>
    withFallback(
      async () => {
        const response = await api.get('/auth/profile');
        return response.data;
      },
      async () => fallbackGetProfile(),
    ),

  updateProfile: async (profileData) =>
    withFallback(
      async () => {
        const response = await api.put('/auth/profile', profileData);
        return response.data;
      },
      async () => fallbackUpdateProfile(profileData),
    ),
};

export const productsAPI = {
  getAllProducts: async (filters = {}) =>
    withFallback(
      async () => {
        const response = await api.get('/products', { params: filters });
        return response.data;
      },
      async () => fallbackGetProducts(filters),
    ),

  getProduct: async (id) =>
    withFallback(
      async () => {
        const response = await api.get(`/products/${id}`);
        return response.data;
      },
      async () => fallbackGetProduct(id),
    ),

  getCategories: async () => categoriesFromCatalog(),

  searchProducts: async (query) =>
    withFallback(
      async () => {
        const response = await api.get('/products/search', { params: { q: query } });
        return response.data;
      },
      async () => fallbackGetProducts({ q: query }),
    ),

  getProductReviews: async (productId) =>
    withFallback(
      async () => {
        const response = await api.get(`/products/${productId}/reviews`);
        return response.data;
      },
      async () => fallbackGetReviews(productId),
    ),

  addProductReview: async (productId, review) =>
    withFallback(
      async () => {
        const response = await api.post(`/products/${productId}/reviews`, review);
        return response.data;
      },
      async () => fallbackAddReview(productId, review),
    ),
};

function categoriesFromCatalog() {
  const seen = new Set();
  return flattenProducts()
    .map((product) => product.category)
    .filter((category) => {
      const key = category.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
}

export const ordersAPI = {
  createOrder: async (orderData) =>
    withFallback(
      async () => {
        const response = await api.post('/orders', orderData);
        return response.data;
      },
      async () => fallbackCreateOrder(orderData),
    ),

  getOrders: async () =>
    withFallback(
      async () => {
        const response = await api.get('/orders');
        return response.data;
      },
      async () => fallbackGetOrders(),
    ),

  getOrder: async (id) =>
    withFallback(
      async () => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
      },
      async () => fallbackGetOrder(id),
    ),

  cancelOrder: async (id) =>
    withFallback(
      async () => {
        const response = await api.put(`/orders/${id}/cancel`);
        return response.data;
      },
      async () => fallbackCancelOrder(id),
    ),

  trackOrder: async (id) =>
    withFallback(
      async () => {
        const response = await api.get(`/orders/${id}/tracking`);
        return response.data;
      },
      async () => fallbackTrackOrder(id),
    ),
};

export const paymentAPI = {
  createPaymentIntent: async (amount) =>
    withFallback(
      async () => {
        const response = await api.post('/payments/create-intent', { amount });
        return response.data;
      },
      async () => fallbackCreatePaymentIntent(amount),
    ),

  confirmPayment: async (paymentData) =>
    withFallback(
      async () => {
        const response = await api.post('/payments/confirm', paymentData);
        return response.data;
      },
      async () => ({ success: true, paymentData }),
    ),
};

export default api;
