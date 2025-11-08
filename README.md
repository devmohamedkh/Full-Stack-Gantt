# Gantt Chart Full-Stack Application

A **full-stack Gantt chart application** with a NestJS backend and frontend (React). This application allows you to manage users (api only) and activities with full CRUD functionality.

---

## Features

### Backend (NestJS + PostgreSQL)

-   RESTful API for users and activities
-   PostgreSQL database with TypeORM
-   Input validation using `class-validator`
-   Environment-based configuration
-   CORS enabled for frontend integration
-   Swagger/OpenAPI documentation
-   Database migrations with TypeORM
-   Dockerized for easy deployment

### Frontend (React/Next.js)

-   Interactive Gantt chart UI
-   activity management
-   API integration with backend
-   Authentication and role-based access
-   Responsive and mobile-friendly design

---

## Prerequisites

### Local Development

-   Node.js v18+
-   pnpm v10+
-   PostgreSQL v12+

### Docker Development

-   Docker v20+
-   Docker Compose v2+

---

## Setup

### Option 1: Docker Compose (Recommended)

1. Copy `.env.example` to `.env` and update environment variables.

2. Start services:

```bash
docker-compose up -d
```

This will:

-   Build backend and frontend Docker images
-   Start PostgreSQL database
-   Start backend API
-   Start frontend
-   Create persistent volumes for database data

3. View logs:

```bash
docker-compose logs -f       # All services
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

4. Stop services:

```bash
docker-compose down
```

5. Stop and remove volumes (clean slate):

```bash
docker-compose down -v
```

The API will be available at `http://localhost:3000/api`

The frontend will be available at `http://localhost:3001` (or the port configured in `.env`)

Swagger docs: `http://localhost:3000/docs`

---

### Option 2: Local Development

#### Backend

1. Install dependencies:

```bash
cd backend
pnpm install
```

2. Create the PostgreSQL database:

```sql
CREATE DATABASE gantt_db;
```

3. Copy `.env.example` to `.env` and update environment variables.

4. Run the backend:

```bash
# Development
pnpm start:dev

# Production
pnpm build
pnpm start:prod
```

#### Frontend

1. Install dependencies:

```bash
cd frontend
pnpm install
```

2. Copy `.env.example` to `.env.local` and update environment variables.

3. Run the frontend:

```bash
# Development
pnpm dev

# Production build
pnpm build
pnpm start
```

---

## API Documentation (Swagger)

Once the backend is running, access Swagger UI:

```
http://localhost:3000/docs
```

Features:

-   Complete endpoint documentation
-   Interactive testing
-   Request/response schemas
-   Example requests
-   Try-it-out functionality

---

## Database Migrations

This project uses **TypeORM migrations** to manage database schemas.

### Migration Commands

```bash
# Generate migration from entity changes
pnpm migration:generate src/migrations/MigrationName

# Create empty migration
pnpm migration:create src/migrations/MigrationName

# Run migrations
pnpm migration:run

# Revert last migration
pnpm migration:revert

# Show migration status
pnpm migration:show
```

> **Production/Docker:** Migrations not ruining automatically you need to run `pnpm migration:run`

---

## Testing

```bash
pnpm test
pnpm test:watch
pnpm test:cov
```

---

## Linting & Formatting

```bash
pnpm lint
pnpm format
```

---

## Docker Commands

```bash
# Start services
docker-compose up -d

# Rebuild and start
docker-compose up -d --build

# Stop services
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers, networks, and volumes
docker-compose down -v
```

### Access PostgreSQL in Docker

```bash
docker-compose exec postgres psql -U postgres -d gantt_db
```

-   Host: `localhost`
-   Port: `5432`
-   Username: `postgres`
-   Password: as in `.env`
-   Database: `gantt_db`

---

## Notes

-   **Database**:

    -   Development: `synchronize=true` (auto-create tables)
    -   Production: Use migrations

-   **CORS**: Configured for frontend origin
-   **Docker**:

    -   Persistent PostgreSQL volume (`postgres_data`)
    -   Backend waits for DB before starting

---

This setup provides a **complete full-stack application**: backend API + frontend +
