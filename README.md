# 🧭 Gantt Chart Full Stack Application

A **Full Stack Gantt Chart Application** built with **NestJS (backend)**, **React (frontend)**, and **PostgreSQL (database)**. This project provides a complete setup for managing Gantt chart activities, user authentication, and API documentation.

---

## 🚀 Features

### Backend (NestJS)

-   RESTful API for CRUD operations on **users** and **activities**
-   PostgreSQL database with **TypeORM** ORM
-   **Class-validator** for input validation
-   **Swagger/OpenAPI** documentation
-   **Environment-based configuration**
-   **CORS** enabled for frontend integration

### Frontend (React)

-   Modern UI for Gantt chart management
-   API integration with backend endpoints
-   Responsive design and state management
-   Docker-ready configuration for deployment

---

## 🧩 Prerequisites

### For Local Development

-   Node.js (v18 or higher)
-   pnpm (v10 or higher)
-   PostgreSQL (v12 or higher)

### For Docker Development

-   Docker (v20 or higher)
-   Docker Compose (v2 or higher)

---

## ⚙️ Setup

### Option 1: 🐳 Docker Compose (Recommended)

Run the entire stack (backend + frontend + PostgreSQL) using Docker Compose.

#### 1. Copy the environment file

```bash
cp .env.example .env
```

Update environment variables as needed.

#### 2. Start services

```bash
docker-compose up -d
```

This will:

-   Build backend and frontend Docker images
-   Start PostgreSQL database
-   Expose services on configured ports

#### 3. Run Migrations and Seed Admin (Manual)

Before you can use the application, you need to run database migrations and seed the super admin account:

```bash
docker compose exec backend sh -c "cd app && pnpm migration:run"
docker compose exec backend sh -c "cd app && pnpm seed:super-admin"
```

> 💡 These commands must be executed inside the running backend container after services are up.

#### 4. View logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

#### 5. Stop and clean up

```bash
docker-compose down
```

#### 6. (Optional) Clean slate with volumes

```bash
docker-compose down -v
```

Backend API: [http://localhost:3000/api](http://localhost:3000/api)  
Frontend App: [http://localhost:3001](http://localhost:3001)  
Swagger Docs: [http://localhost:3000/docs](http://localhost:3000/docs)

---

### Option 2: 💻 Local Development

#### 1. Install Dependencies

```bash
cd backend
pnpm install
```

#### 2. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE gantt_db;
```

#### 3. Configure Environment

Copy `.env.example` and configure:

```bash
cp .env.example .env
```

#### 4. Run Migrations and Seed Admin (Manual)

Before running the app, manually run migrations and seed the super admin:

```bash
pnpm migration:run
pnpm seed:super-admin
```

> 💡 These commands must be executed once before the application can start properly.

#### 5. Start Application

Development:

```bash
pnpm start:dev
```

Production:

```bash
pnpm build
pnpm start:prod
```

Backend API: [http://localhost:3000/api](http://localhost:3000/api)

---

## 📘 API Documentation (Swagger)

Once running, access interactive documentation at:
➡️ **[http://localhost:3000/docs](http://localhost:3000/docs)**

The Swagger UI includes:

-   Endpoint documentation
-   Request/response schemas
-   Example payloads
-   Try-it-out testing interface

---

## 🧱 Database Migrations

This project uses **TypeORM migrations** to manage schema changes.

### Scripts

```bash
"migration:generate": "Generate a new migration file based on entity changes",
"migration:create": "Create an empty migration file",
"migration:run": "Run all pending migrations",
"migration:revert": "Revert the last executed migration",
"migration:show": "Show all migrations and their current status",
"migration:run:prod": "Run migrations in production environment",
"seed:super-admin": "Seed the database with a super admin user (development)",
"seed:super-admin:prod": "Seed the database with a super admin user (production)"
```

### Run Migrations

```bash
pnpm migration:run
```

### Seed Super Admin

```bash
pnpm seed:super-admin
```

> The seeded admin user can be used to log into the frontend after setup.

### Create or Generate Migrations

```bash
pnpm migration:create src/migrations/AddNewTable
pnpm migration:generate src/migrations/SyncEntities
```

---

## 🧪 Testing & Code Quality

### Run Tests

```bash
pnpm test
pnpm test:watch
pnpm test:cov
```

### Linting

```bash
pnpm lint
```

### Formatting

```bash
pnpm format
```

---

## 🐘 Database Access (Docker)

```bash
docker-compose exec postgres psql -U postgres -d gantt_db
```

Or connect via a client:

```
Host: localhost
Port: 5432
Database: gantt_db
Username: postgres
Password: postgres
```

---

## 🧭 Notes

-   **Migrations** must be run manually before starting the app.
-   **Admin user** must be seeded manually using the provided command.
-   **CORS** is configured for frontend integration.
-   **Database data** persists across restarts via Docker volumes.
