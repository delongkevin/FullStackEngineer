// Global constants for API configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001',
  API_PREFIX: '/api/',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json'
  }
};

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Logged in successfully!',
  REGISTER: 'Account created successfully!',
  LOGOUT: 'Logged out successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  FAVORITE_ADDED: 'Added to favorites!',
  FAVORITE_REMOVED: 'Removed from favorites!',
  BOOKING_CREATED: 'Tour booked successfully!'
};

// Storage keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'userToken',
  USER_ID: 'userId',
  USER_DATA: 'userData',
  FAVORITES: 'favorites',
  LAST_SEARCH: 'lastSearch'
};

// Property types
export const PROPERTY_TYPES = [
  'House',
  'Apartment',
  'Condo',
  'Townhouse',
  'Land',
  'Commercial'
];

// Price ranges
export const PRICE_RANGES = [
  { label: 'Any', min: 0, max: Infinity },
  { label: 'Under $200k', min: 0, max: 200000 },
  { label: '$200k - $500k', min: 200000, max: 500000 },
  { label: '$500k - $1M', min: 500000, max: 1000000 },
  { label: 'Over $1M', min: 1000000, max: Infinity }
];

// Amenities list
export const AMENITIES = [
  'Pool',
  'Gym',
  'Parking',
  'Security',
  'Garden',
  'Balcony',
  'Air Conditioning',
  'Heating',
  'WiFi',
  'Smart Home',
  'Laundry',
  'Pet Friendly'
];

// Countries data
export const COUNTRIES = [
  { name: 'United States', code: 'US' },
  { name: 'Canada', code: 'CA' },
  { name: 'Mexico', code: 'MX' }
];

// US States
export const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

// App colors
export const COLORS = {
  PRIMARY: '#059669',
  SECONDARY: '#10b981',
  DANGER: '#ef4444',
  WARNING: '#f59e0b',
  SUCCESS: '#10b981',
  INFO: '#3b82f6',
  DARK: '#1f2937',
  GRAY: '#6b7280',
  LIGHT_GRAY: '#e5e7eb',
  VERY_LIGHT_GRAY: '#f9fafb',
  WHITE: '#ffffff',
  BLACK: '#000000'
};

// Spacing
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  XXL: 24
};

// Booking status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

// Default pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// Validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\d\-\+\s\(\)]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, // Min 8 chars, 1 upper, 1 lower, 1 number
  NAME: /^[a-zA-Z\s'-]{2,50}$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
};
