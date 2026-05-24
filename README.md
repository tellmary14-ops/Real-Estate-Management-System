# Golden Eggs Estate

Production-grade Real Estate Management System.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, Tailwind CSS, Axios, React Router, Context API |
| Backend | Node.js, Express, Prisma, PostgreSQL |
| Auth | JWT + refresh tokens, bcrypt |

## Architecture

Backend follows **clean architecture**: Routes → Controllers → Services → Repositories.

```
backend/src/modules/
  auth/ properties/ users/ favorites/ reservations/
  reviews/ notifications/ payments/ analytics/
```

