# Golden Eggs Estate

Production-grade Real Estate Management System.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, Tailwind CSS, Axios, React Router, Context API |
| Backend | Node.js, Express, Prisma, PostgreSQL |
| Auth | JWT + refresh tokens, bcrypt |
| Images | Cloudinary (optional) |
| Payments | Paystack-ready (dev simulate included) |

## Architecture

Backend follows **clean architecture**: Routes → Controllers → Services → Repositories.

```
backend/src/modules/
  auth/ properties/ users/ favorites/ reservations/
  reviews/ notifications/ payments/ analytics/
```

## Quick start

### 1. PostgreSQL

Create database `golden_eggs_estates` or use Docker:

```bash
docker compose up postgres -d
```

### 2. Backend

```bash
cd backend
pnpm install
# Edit .env — DATABASE_URL and JWT secrets
pnpm db:push
pnpm db:seed
pnpm dev
```

API: http://localhost:4000/api/v1

**If edits or uploads do nothing:** an old API process may still be on port 4000. Stop it, then start fresh:

```powershell
cd backend
powershell -File scripts/kill-port.ps1
pnpm dev
```

You should see `Image uploads saved locally in uploads/ folder` in the log (not “placeholder URLs”).

### 3. Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

App: http://localhost:5173

### Seed accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@goldeneggsestate.com | Admin123! |
| User | user@goldeneggsestate.com | User12345! |

## Root commands

```bash
pnpm install          # from repo root (installs concurrently)
pnpm dev              # runs backend + frontend
pnpm db:migrate       # prisma migrate
pnpm db:seed          # seed data
```

## Environment (secrets only)

`backend/.env`:

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
- `CLOUDINARY_*` (optional)
- `PAYSTACK_*` (optional)
- `SMTP_*` (optional)

Ports and URLs are hardcoded in `backend/src/config/env.ts`.

## Docker

```bash
docker compose up --build
```

## Documentation

- [API Reference](./docs/API.md)
- [Architecture](./docs/architecture.md) (if present)

## Scalability notes

- Stateless API — scale horizontally behind a load balancer
- Move refresh tokens to Redis for multi-instance deployments
- Use managed PostgreSQL and Cloudinary CDN in production
- Add queue workers (Bull/BullMQ) for email and webhooks
