# Real Estate App - API Documentation

## Base URL

```
http://localhost:3001
```

Production example:

```
https://api.your-domain.com
```

## Authentication

All protected endpoints require an `Authorization` header with a JWT token:

```
Authorization: Bearer <token>
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Endpoints

### Authentication

#### Refresh Token

```
POST /api/auth/refresh

Body:
{
  "refreshToken": "long-lived-refresh-token"
}

Response (200):
{
  "success": true,
  "data": {
    "token": "new-access-token",
    "refreshToken": "new-refresh-token"
  }
}

Errors:
- 401: Invalid refresh token
```

#### Logout

```
POST /api/auth/logout

Requires: Authentication

Response (200):
{
  "success": true,
  "data": {
    "message": "Logged out"
  }
}
```

#### Login

```
POST /api/auth/login

Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "userId": "user123",
    "user": {
      "id": "user123",
      "name": "John Doe",
      "email": "user@example.com"
    }
  }
}

Errors:
- 400: Invalid email or password
- 401: Email not found
- 422: Validation error
```

#### Register

```
POST /api/auth/register

Body:
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "phone": "+1 (555) 000-0000"
}

Response (201):
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "userId": "user123",
    "user": {
      "id": "user123",
      "name": "John Doe",
      "email": "user@example.com"
    }
  }
}

Errors:
- 400: Email already exists
- 422: Validation error
```

### Properties

#### Search Properties

```
GET /api/properties/search

Query Parameters:
- city: string (optional)
- state: string (optional)
- minPrice: number (optional)
- maxPrice: number (optional)
- bedrooms: number (optional)
- bathrooms: number (optional)
- type: string (optional) - house, apartment, condo, etc.
- amenities: string[] (optional)
- page: number (default: 1)
- limit: number (default: 10)

Response (200):
{
  "success": true,
  "data": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "properties": [
      {
        "propertyId": "prop123",
        "title": "Beautiful 4BR House",
        "description": "...",
        "price": 450000,
        "rentPrice": null,
        "forSale": true,
        "bedrooms": 4,
        "bathrooms": 2.5,
        "sqft": 2500,
        "city": "Austin",
        "state": "TX",
        "zipCode": "78704",
        "images": ["url1", "url2"],
        "amenities": ["pool", "gym"],
        "ratings": 4.5,
        "postedDate": "2024-01-15"
      }
    ]
  }
}

Errors:
- 400: Invalid query parameters
```

#### Get Property Details

```
GET /api/properties/:propertyId

Response (200):
{
  "success": true,
  "data": {
    "propertyId": "prop123",
    "title": "Beautiful 4BR House",
    "description": "...",
    "price": 450000,
    "rentPrice": null,
    "forSale": true,
    "bedrooms": 4,
    "bathrooms": 2.5,
    "sqft": 2500,
    "city": "Austin",
    "state": "TX",
    "zipCode": "78704",
    "address": "123 Main St",
    "images": ["url1", "url2", "url3"],
    "amenities": ["pool", "gym", "parking"],
    "ratings": 4.5,
    "reviews": 24,
    "postedDate": "2024-01-15",
    "agent": {
      "id": "agent123",
      "name": "Jane Smith",
      "phone": "+1 (555) 111-1111",
      "email": "jane@example.com"
    }
  }
}

Errors:
- 404: Property not found
```

#### Get Featured Properties

```
GET /api/properties/featured

Query Parameters:
- limit: number (default: 5)

Response (200):
{
  "success": true,
  "data": [
    { ... property object ... }
  ]
}
```

### Favorites

#### Get Favorites

```
GET /api/favorites

Requires: Authentication

Response (200):
{
  "success": true,
  "data": [
    { ... property object ... }
  ]
}

Errors:
- 401: Unauthorized
```

#### Add to Favorites

```
POST /api/favorites/:propertyId

Requires: Authentication

Response (201):
{
  "success": true,
  "data": {
    "message": "Added to favorites"
  }
}

Errors:
- 401: Unauthorized
- 404: Property not found
- 409: Already in favorites
```

#### Remove from Favorites

```
DELETE /api/favorites/:propertyId

Requires: Authentication

Response (200):
{
  "success": true,
  "data": {
    "message": "Removed from favorites"
  }
}

Errors:
- 401: Unauthorized
- 404: Property not found
```

### Bookings

#### Get Bookings

```
GET /api/bookings

Requires: Authentication

Query Parameters:
- status: pending|confirmed|cancelled|completed (optional)

Response (200):
{
  "success": true,
  "data": [
    {
      "bookingId": "book123",
      "propertyId": "prop123",
      "propertyTitle": "Beautiful 4BR House",
      "tourDate": "2024-02-15",
      "tourTime": "14:00",
      "status": "confirmed",
      "notes": "Looking forward to the tour",
      "createdAt": "2024-01-10",
      "confirmedAt": "2024-01-10"
    }
  ]
}

Errors:
- 401: Unauthorized
```

#### Create Booking

```
POST /api/bookings

Requires: Authentication

Body:
{
  "propertyId": "prop123",
  "tourDate": "2024-02-15",
  "tourTime": "14:00",
  "notes": "Optional notes"
}

Response (201):
{
  "success": true,
  "data": {
    "bookingId": "book123",
    "propertyId": "prop123",
    "tourDate": "2024-02-15",
    "tourTime": "14:00",
    "status": "pending"
  }
}

Errors:
- 401: Unauthorized
- 404: Property not found
- 409: Time slot already booked
- 422: Validation error
```

#### Cancel Booking

```
DELETE /api/bookings/:bookingId

Requires: Authentication

Response (200):
{
  "success": true,
  "data": {
    "message": "Booking cancelled"
  }
}

Errors:
- 401: Unauthorized
- 404: Booking not found
```

### User

#### Get Current User Profile

```
GET /api/users/me

Requires: Authentication

Response (200):
{
  "success": true,
  "data": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 (555) 000-0000",
    "avatar": "https://avatar.url",
    "userType": "buyer|agent",
    "createdAt": "2024-01-01"
  }
}

Errors:
- 401: Unauthorized
```

#### Update User Profile

```
PUT /api/users/me

Requires: Authentication

Body:
{
  "name": "John Doe",
  "phone": "+1 (555) 000-0000"
}

Response (200):
{
  "success": true,
  "data": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 (555) 000-0000"
  }
}

Errors:
- 401: Unauthorized
- 422: Validation error
```

#### Get Property Statistics

```
GET /api/properties-stats

Requires: Authentication

Response (200):
{
  "success": true,
  "data": {
    "totalProperties": 24,
    "totalViews": 5430,
    "favoriteCount": 12,
    "bookingCount": 8,
    "averageRating": 4.5
  }
}

Errors:
- 401: Unauthorized
```

### System

#### Health Check

```
GET /api/health

Response (200):
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2026-04-06T00:00:00.000Z",
    "uptime": 12345
  }
}
```

#### API Version

```
GET /api/version

Response (200):
{
  "success": true,
  "data": {
    "version": "1.0.0",
    "build": "2026.04.06"
  }
}
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid or missing credentials |
| 403 | Forbidden - No permission |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation failed |
| 500 | Server Error - Internal error |

## Rate Limiting

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1234567890
```

## Pagination

**Default limit:** 10
**Max limit:** 100

Use `page` and `limit` query parameters.

Response includes:
- `total`: Total number of items
- `page`: Current page number
- `limit`: Number of items per page

## Sorting

Use `sort` query parameter:
```
sort=-createdAt  // Descending
sort=price       // Ascending
```

## Filtering

Use query parameters to filter:
```
GET /api/properties/search?city=Austin&state=TX&minPrice=400000
```

## Error Codes

| Code | Meaning |
|------|---------|
| INVALID_EMAIL | Email format is invalid |
| EMAIL_EXISTS | Email already registered |
| INVALID_PASSWORD | Password too weak |
| INVALID_CREDENTIALS | Email or password incorrect |
| UNAUTHORIZED | Not authenticated |
| NOT_FOUND | Resource not found |
| VALIDATION_ERROR | Input validation failed |
| SERVER_ERROR | Internal server error |

## Examples

### Search for properties in Austin

```bash
curl -X GET "http://localhost:3001/api/properties/search?city=Austin&state=TX" \
  -H "Content-Type: application/json"
```

### Refresh access token

```bash
curl -X POST "http://localhost:3001/api/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

### Login

```bash
curl -X POST "http://localhost:3001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get favorites (requires token)

```bash
curl -X GET "http://localhost:3001/api/favorites" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Book a tour

```bash
curl -X POST "http://localhost:3001/api/bookings" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "prop123",
    "tourDate": "2024-02-15",
    "tourTime": "14:00"
  }'
```

## Notes For Mobile Clients

1. For Android emulator, replace `localhost` with `10.0.2.2`.
2. Set request timeout to at least 10 seconds for mobile networks.
3. Treat `401` as session expiration and force re-authentication.
4. Retry safe GET requests with exponential backoff on transient network errors.
