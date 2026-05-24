# Golden Eggs Estate — API Documentation

Base URL: `http://localhost:4000/api/v1`

## Response format

**Success:** `{ "success": true, "message": "...", "data": {} }`  
**Paginated:** includes `meta: { page, limit, total, totalPages }`  
**Error:** `{ "success": false, "message": "...", "errors": [] }`

## Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Create account |
| POST | `/auth/login` | No | Sign in |
| POST | `/auth/refresh` | No | Refresh tokens |
| POST | `/auth/logout` | Yes | Sign out |
| GET | `/auth/me` | Yes | Current user |

## Properties

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/properties` | No | List (search, filter, sort, paginate) |
| GET | `/properties/:id` | No | Details |
| POST | `/properties` | Admin | Create (multipart images) |
| PATCH | `/properties/:id` | Admin | Update |
| DELETE | `/properties/:id` | Admin | Soft delete |

Query params: `page`, `limit`, `search`, `city`, `category`, `status`, `minPrice`, `maxPrice`, `featured`, `sort`

## Favorites

| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/favorites` | User |
| POST | `/favorites/:propertyId` | User |
| DELETE | `/favorites/:propertyId` | User |

## Reservations

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/reservations` | User |
| GET | `/reservations/mine` | User |
| GET | `/reservations` | Admin |
| PATCH | `/reservations/:id/status` | Admin |

## Reviews

| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/reviews/property/:propertyId` | No |
| POST | `/reviews` | User |

## Payments

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/payments/initialize` | User |
| POST | `/payments/verify` | User |
| POST | `/payments/simulate` | User (dev) |
| GET | `/payments/mine` | User |
| GET | `/payments` | Admin |

## Purchases

| GET | `/purchases/mine` | User |

## Notifications

| GET | `/notifications` | User |
| PATCH | `/notifications/:id/read` | User |
| PATCH | `/notifications/read-all` | User |

## Users (Admin)

| GET | `/users` | Admin |
| PATCH | `/users/:id` | Admin |
| DELETE | `/users/:id` | Admin |

## Analytics (Admin)

| GET | `/analytics/dashboard` | Admin |

## Health

| GET | `/health` | No |
