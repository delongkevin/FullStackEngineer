// Real Estate Marketplace Backend - Property Listing & Booking API
// Comprehensive API for property listings, search, filtering, and booking management

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// In-memory data storage (upgradable to MongoDB/Firebase)
const users = new Map();
const properties = new Map();
const bookings = new Map();
const favorites = new Map();
const reviews = new Map();

function createAvatar(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
}

function serializeUser(user) {
  return user ? { ...user, password: undefined } : null;
}

function createUser({ userId, name, email, password, phone = '', avatar, userType = 'buyer', createdAt = new Date() }) {
  const user = {
    userId,
    name,
    email,
    password,
    phone,
    avatar: avatar || createAvatar(name),
    userType,
    createdAt,
    savedProperties: [],
    bookings: []
  };

  users.set(userId, user);
  return user;
}

// Mock property data
const initializeProperties = () => {
  const mockProperties = [
    {
      propertyId: 'prop_001',
      title: 'Luxury Modern Penthouse',
      address: '123 Park Avenue, New York, NY 10017',
      city: 'New York',
      state: 'NY',
      zipCode: '10017',
      bedrooms: 4,
      bathrooms: 3.5,
      sqft: 4500,
      type: 'penthouse',
      price: 2500000,
      rentPrice: 12000,
      forSale: true,
      forRent: false,
      description: 'Stunning penthouse with panoramic city views, modern architecture, and luxury amenities.',
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500',
        'https://images.unsplash.com/photo-1512917774080-9264f475edbf?w=500'
      ],
      latitude: 40.7689,
      longitude: -73.9830,
      amenities: ['Doorman', 'Gym', 'Pool', 'Spa', 'Rooftop Garden', 'Wine Cellar'],
      yearBuilt: 2020,
      propertyTax: 18500,
      hoaFees: 2500,
      parking: { included: true, spaces: 2 },
      agentId: 'agent_001',
      agentName: 'John Smith',
      agentEmail: 'john@realtor.com',
      agentPhone: '+1-555-0100',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      ratings: 4.8,
      reviewCount: 24,
      views: 1250
    },
    {
      propertyId: 'prop_002',
      title: 'Contemporary Beach House',
      address: '456 Malibu Road, Malibu, CA 90265',
      city: 'Malibu',
      state: 'CA',
      zipCode: '90265',
      bedrooms: 5,
      bathrooms: 4,
      sqft: 6200,
      type: 'house',
      price: 8500000,
      rentPrice: 25000,
      forSale: true,
      forRent: true,
      description: 'Stunning oceanfront property with direct beach access, modern finishes, and resort-style amenities.',
      images: [
        'https://images.unsplash.com/photo-1613490493976-fdf092f63d10?w=500',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500'
      ],
      latitude: 34.0195,
      longitude: -118.6817,
      amenities: ['Beach Access', 'Resort Pool', 'Hot Tub', 'Home Theater', 'Wine Room', 'Meditation Garden'],
      yearBuilt: 2019,
      propertyTax: 42000,
      hoaFees: 0,
      parking: { included: true, spaces: 4 },
      agentId: 'agent_002',
      agentName: 'Sarah Johnson',
      agentEmail: 'sarah@realtor.com',
      agentPhone: '+1-555-0101',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
      ratings: 4.9,
      reviewCount: 18,
      views: 980
    },
    {
      propertyId: 'prop_003',
      title: 'Downtown Luxury Apartment',
      address: '789 Michigan Avenue, Chicago, IL 60611',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60611',
      bedrooms: 3,
      bathrooms: 2.5,
      sqft: 3200,
      type: 'condo',
      price: 1200000,
      rentPrice: 5500,
      forSale: true,
      forRent: true,
      description: 'Luxury condo in prestigious downtown location with skyline views and premium finishes.',
      images: [
        'https://images.unsplash.com/photo-1512917774080-9264f475edbf?w=500',
        'https://images.unsplash.com/photo-1600210174832-63d09a5e2b5f?w=500'
      ],
      latitude: 41.8827,
      longitude: -87.6233,
      amenities: ['Concierge', 'Fitness Center', 'Doorman', 'Valet Parking', 'Sky Lounge'],
      yearBuilt: 2018,
      propertyTax: 15000,
      hoaFees: 1200,
      parking: { included: true, spaces: 1 },
      agentId: 'agent_001',
      agentName: 'John Smith',
      agentEmail: 'john@realtor.com',
      agentPhone: '+1-555-0100',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
      ratings: 4.7,
      reviewCount: 16,
      views: 2100
    }
  ];

  mockProperties.forEach(prop => {
    properties.set(prop.propertyId, prop);
  });
};

const initializeUsers = () => {
  if (users.size > 0) {
    return;
  }

  createUser({
    userId: 'buyer_demo',
    name: 'Maya Brown',
    email: 'buyer@example.com',
    password: 'password123',
    phone: '+1 (555) 010-2000',
    userType: 'buyer',
    createdAt: new Date('2024-01-05')
  });

  createUser({
    userId: 'agent_001',
    name: 'John Smith',
    email: 'john@realtor.com',
    password: 'password123',
    phone: '+1 (555) 010-1000',
    userType: 'agent',
    createdAt: new Date('2023-11-20')
  });

  createUser({
    userId: 'agent_002',
    name: 'Sarah Johnson',
    email: 'sarah@realtor.com',
    password: 'password123',
    phone: '+1 (555) 010-1001',
    userType: 'agent',
    createdAt: new Date('2023-12-12')
  });

  createUser({
    userId: 'agent_003',
    name: 'Chris Lee',
    email: 'chris@realtor.com',
    password: 'password123',
    phone: '+1 (555) 010-1002',
    userType: 'agent',
    createdAt: new Date('2023-10-08')
  });
};

initializeProperties();
initializeUsers();

// Middleware
app.use(cors());
app.use(express.json());

// JWT Authentication Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ============= AUTH ROUTES =============

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (Array.from(users.values()).some(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  const userId = `user_${Date.now()}`;
  const user = createUser({ userId, name, email, password, phone });
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
  
  res.status(201).json({
    userId,
    name,
    email,
    token,
    user: serializeUser(user)
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = Array.from(users.values()).find(u => u.email === email);
  
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: '30d' });
  res.json({
    userId: user.userId,
    name: user.name,
    email: user.email,
    token,
    user: serializeUser(user)
  });
});

app.get('/api/users/me', verifyToken, (req, res) => {
  const user = users.get(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(serializeUser(user));
});

app.put('/api/users/me', verifyToken, (req, res) => {
  const user = users.get(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { name, email, phone, avatar } = req.body;

  if (email && Array.from(users.values()).some((candidate) => candidate.email === email && candidate.userId !== req.userId)) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  const updatedUser = {
    ...user,
    name: name || user.name,
    email: email || user.email,
    phone: phone ?? user.phone,
    avatar: avatar || user.avatar
  };

  users.set(req.userId, updatedUser);
  res.json(serializeUser(updatedUser));
});

// ============= PROPERTY ROUTES =============

app.get('/api/properties', (req, res) => {
  const { type, minPrice, maxPrice, bedrooms, city, forSale, forRent, search } = req.query;
  
  let filtered = Array.from(properties.values());

  if (type) filtered = filtered.filter(p => p.type === type);
  if (minPrice) filtered = filtered.filter(p => p.price >= parseInt(minPrice));
  if (maxPrice) filtered = filtered.filter(p => p.price <= parseInt(maxPrice));
  if (bedrooms) filtered = filtered.filter(p => p.bedrooms >= parseInt(bedrooms));
  if (city) filtered = filtered.filter(p => p.city.toLowerCase().includes(city.toLowerCase()));
  if (forSale === 'true') filtered = filtered.filter(p => p.forSale);
  if (forRent === 'true') filtered = filtered.filter(p => p.forRent);
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(searchLower) ||
      p.address.toLowerCase().includes(searchLower) ||
      p.city.toLowerCase().includes(searchLower)
    );
  }

  res.json(filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.get('/api/properties/:propertyId', (req, res) => {
  const property = properties.get(req.params.propertyId);
  if (!property) return res.status(404).json({ error: 'Property not found' });
  
  property.views = (property.views || 0) + 1;
  res.json(property);
});

app.post('/api/properties', verifyToken, (req, res) => {
  const { title, address, city, state, zipCode, bedrooms, bathrooms, sqft, type, price, description, amenities } = req.body;

  const propertyId = `prop_${Date.now()}`;
  const property = {
    propertyId,
    title,
    address,
    city,
    state,
    zipCode,
    bedrooms,
    bathrooms,
    sqft,
    type,
    price,
    rentPrice: 0,
    forSale: true,
    forRent: false,
    description,
    images: [],
    latitude: 0,
    longitude: 0,
    amenities: amenities || [],
    yearBuilt: new Date().getFullYear(),
    propertyTax: 0,
    hoaFees: 0,
    parking: { included: false, spaces: 0 },
    agentId: req.userId,
    agentName: users.get(req.userId)?.name || 'Agent',
    agentEmail: users.get(req.userId)?.email || '',
    agentPhone: users.get(req.userId)?.phone || '',
    createdAt: new Date(),
    updatedAt: new Date(),
    ratings: 0,
    reviewCount: 0,
    views: 0
  };

  properties.set(propertyId, property);
  res.status(201).json(property);
});

app.put('/api/properties/:propertyId', verifyToken, (req, res) => {
  const property = properties.get(req.params.propertyId);
  if (!property) return res.status(404).json({ error: 'Property not found' });
  if (property.agentId !== req.userId) return res.status(403).json({ error: 'Unauthorized' });

  const updated = { ...property, ...req.body, updatedAt: new Date() };
  properties.set(req.params.propertyId, updated);
  res.json(updated);
});

// ============= FAVORITES ROUTES =============

app.post('/api/favorites/:propertyId', verifyToken, (req, res) => {
  const user = users.get(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const property = properties.get(req.params.propertyId);
  if (!property) return res.status(404).json({ error: 'Property not found' });

  if (!user.savedProperties) user.savedProperties = [];
  
  if (!user.savedProperties.includes(req.params.propertyId)) {
    user.savedProperties.push(req.params.propertyId);
  }

  users.set(req.userId, user);
  res.json({ success: true, saved: user.savedProperties });
});

app.delete('/api/favorites/:propertyId', verifyToken, (req, res) => {
  const user = users.get(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.savedProperties = (user.savedProperties || []).filter(id => id !== req.params.propertyId);
  users.set(req.userId, user);
  res.json({ success: true, saved: user.savedProperties });
});

app.get('/api/favorites', verifyToken, (req, res) => {
  const user = users.get(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const saved = (user.savedProperties || []).map(id => properties.get(id)).filter(Boolean);
  res.json(saved);
});

// ============= BOOKING ROUTES =============

app.post('/api/bookings', verifyToken, (req, res) => {
  const { propertyId, tourDate, tourTime, notes } = req.body;

  if (!propertyId || !tourDate || !tourTime) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const property = properties.get(propertyId);
  if (!property) return res.status(404).json({ error: 'Property not found' });

  const conflicting = Array.from(bookings.values()).find(
    (booking) =>
      booking.propertyId === propertyId &&
      booking.tourDate === tourDate &&
      booking.tourTime === tourTime &&
      booking.status !== 'cancelled'
  );

  if (conflicting) {
    return res.status(409).json({ error: 'This tour slot is already booked. Please pick another time.' });
  }

  const bookingId = `booking_${Date.now()}`;
  const booking = {
    bookingId,
    propertyId,
    userId: req.userId,
    buyerName: users.get(req.userId)?.name || 'Buyer',
    buyerEmail: users.get(req.userId)?.email || '',
    buyerPhone: users.get(req.userId)?.phone || '',
    propertyTitle: property.title,
    agentId: property.agentId,
    tourDate,
    tourTime,
    notes: notes || '',
    status: 'pending',
    createdAt: new Date(),
    confirmedAt: null
  };

  bookings.set(bookingId, booking);
  
  const user = users.get(req.userId);
  if (!user.bookings) user.bookings = [];
  user.bookings.push(bookingId);
  users.set(req.userId, user);

  res.status(201).json(booking);
});

app.get('/api/bookings', verifyToken, (req, res) => {
  const user = users.get(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const userBookings = (user.bookings || []).map(id => bookings.get(id)).filter(Boolean);
  res.json(userBookings);
});

app.put('/api/bookings/:bookingId', verifyToken, (req, res) => {
  const booking = bookings.get(req.params.bookingId);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const property = properties.get(booking.propertyId);
  if (property.agentId !== req.userId) return res.status(403).json({ error: 'Unauthorized' });

  booking.status = req.body.status;
  booking.confirmedAt = new Date();
  bookings.set(req.params.bookingId, booking);

  res.json(booking);
});

// ============= REVIEW ROUTES =============

app.post('/api/reviews', verifyToken, (req, res) => {
  const { propertyId, rating, comment } = req.body;

  if (!propertyId || !rating) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const property = properties.get(propertyId);
  if (!property) return res.status(404).json({ error: 'Property not found' });

  const reviewId = `review_${Date.now()}`;
  const review = {
    reviewId,
    propertyId,
    userId: req.userId,
    userName: users.get(req.userId)?.name || 'User',
    rating: parseInt(rating),
    comment: comment || '',
    createdAt: new Date()
  };

  reviews.set(reviewId, review);

  // Update property rating
  const propReviews = Array.from(reviews.values()).filter(r => r.propertyId === propertyId);
  const avgRating = propReviews.reduce((sum, r) => sum + r.rating, 0) / propReviews.length;
  property.ratings = parseFloat(avgRating.toFixed(1));
  property.reviewCount = propReviews.length;

  res.status(201).json(review);
});

app.get('/api/reviews/:propertyId', (req, res) => {
  const propReviews = Array.from(reviews.values()).filter(r => r.propertyId === req.params.propertyId);
  res.json(propReviews);
});

// ============= ANALYTICS ROUTES =============

app.get('/api/properties-stats', verifyToken, (req, res) => {
  const userProperties = Array.from(properties.values()).filter(p => p.agentId === req.userId);
  const totalViews = userProperties.reduce((sum, p) => sum + (p.views || 0), 0);
  const avgRating = userProperties.length > 0 
    ? (userProperties.reduce((sum, p) => sum + (p.ratings || 0), 0) / userProperties.length).toFixed(1)
    : 0;

  res.json({
    totalProperties: userProperties.length,
    totalViews,
    averageRating: avgRating,
    activeListing: userProperties.filter(p => p.forSale || p.forRent).length,
    totalReviews: userProperties.reduce((sum, p) => sum + (p.reviewCount || 0), 0)
  });
});

app.get('/api/market-trends', (req, res) => {
  const allProperties = Array.from(properties.values());
  const byCity = {};

  allProperties.forEach(p => {
    if (!byCity[p.city]) {
      byCity[p.city] = { count: 0, avgPrice: 0, prices: [] };
    }
    byCity[p.city].count++;
    byCity[p.city].prices.push(p.price);
  });

  Object.keys(byCity).forEach(city => {
    const prices = byCity[city].prices;
    byCity[city].avgPrice = (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(0);
    delete byCity[city].prices;
  });

  res.json(byCity);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Real estate API healthy', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Real estate API running on port ${PORT}`);
  console.log(`${properties.size} properties loaded`);
});
