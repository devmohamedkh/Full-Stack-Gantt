# Gantt Chart Backend API

A NestJS backend API for managing activities in a Gantt chart application.

## Features

- RESTful API for CRUD operations on activities
- PostgreSQL database with TypeORM
- Input validation with class-validator
- CORS enabled for frontend integration
- Environment-based configuration
- Swagger/OpenAPI documentation

## Prerequisites

### For Local Development

- Node.js (v18 or higher)
- pnpm (v10 or higher)
- PostgreSQL (v12 or higher)

### For Docker Development

- Docker (v20 or higher)
- Docker Compose (v2 or higher)

## Setup

### Option 1: Docker Compose (Recommended)

The easiest way to run the entire stack (backend + PostgreSQL) is using Docker Compose.

1. **Create a `.env` file** in the project root (optional, defaults are provided):

```env
# Database Configuration
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=gantt_db
DB_PORT=5432

# Application Configuration
PORT=3000

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3001
```

2. **Start the services**:

```bash
docker-compose up -d
```

This will:

- Build the backend Docker image
- Start PostgreSQL database
- Start the backend API
- Create persistent volumes for database data

3. **View logs**:

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# PostgreSQL only
docker-compose logs -f postgres
```

4. **Stop the services**:

```bash
docker-compose down
```

5. **Stop and remove volumes** (clean slate):

```bash
docker-compose down -v
```

The API will be available at `http://localhost:3000/api`

### Option 2: Local Development

1. **Install Dependencies**

```bash
cd backend
pnpm install
```

2. **Database Setup**

Create a PostgreSQL database:

```sql
CREATE DATABASE gantt_db;
```

3. **Environment Configuration**

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=gantt_db

# Application Configuration
PORT=3000
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3001
```

4. **Run the Application**

Development mode:

```bash
pnpm start:dev
```

Production mode:

```bash
pnpm build
pnpm start:prod
```

The API will be available at `http://localhost:3000/api`

## API Documentation (Swagger)

Once the application is running, you can access the interactive Swagger documentation at:

**http://localhost:3000/api/docs**

The Swagger UI provides:

- Complete API endpoint documentation
- Interactive API testing interface
- Request/response schemas
- Example requests and responses
- Try-it-out functionality for all endpoints

You can test all API endpoints directly from the Swagger interface without needing external tools like Postman.

## API Endpoints

### Activities

- `GET /api/activities` - Get all activities
- `GET /api/activities?status=todo` - Get activities filtered by status
- `GET /api/activities/:id` - Get a single activity
- `POST /api/activities` - Create a new activity
- `PATCH /api/activities/:id` - Update an activity
- `DELETE /api/activities/:id` - Delete an activity

### Activity Status Values

- `todo`
- `in_progress`
- `completed`
- `blocked`

### Activity Type Values

- `task`
- `project`
- `milestone`

## Request/Response Examples

### Create Activity

**Request:**

```json
POST /api/activities
{
  "name": "Design UI Mockups",
  "description": "Create wireframes and mockups for the dashboard",
  "start": "2024-01-15T00:00:00Z",
  "end": "2024-01-20T23:59:59Z",
  "progress": 0,
  "status": "todo",
  "type": "task",
  "color": "#3498db",
  "order": 0
}
```

**Response:**

```json
{
  "id": "uuid",
  "name": "Design UI Mockups",
  "description": "Create wireframes and mockups for the dashboard",
  "start": "2024-01-15T00:00:00.000Z",
  "end": "2024-01-20T23:59:59.000Z",
  "progress": 0,
  "status": "todo",
  "type": "task",
  "color": "#3498db",
  "parentId": null,
  "order": 0,
  "createdAt": "2024-01-10T12:00:00.000Z",
  "updatedAt": "2024-01-10T12:00:00.000Z"
}
```

### Update Activity (e.g., drag/resize)

**Request:**

```json
PATCH /api/activities/:id
{
  "start": "2024-01-16T00:00:00Z",
  "end": "2024-01-22T23:59:59Z"
}
```

## Data Model

### Activity Entity

- `id` (UUID) - Primary key
- `name` (string) - Activity name
- `description` (text, optional) - Activity description
- `start` (timestamp) - Start date
- `end` (timestamp) - End date
- `progress` (integer, 0-100) - Progress percentage
- `status` (enum) - Activity status
- `type` (enum) - Activity type
- `color` (string, optional) - Display color
- `parentId` (UUID, optional) - Parent activity for hierarchical tasks
- `order` (integer) - Display order
- `createdAt` (timestamp) - Creation timestamp
- `updatedAt` (timestamp) - Last update timestamp

## Development

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

## Database Migrations

This project uses TypeORM migrations for database schema management. Migrations allow you to version control your database schema and apply changes in a controlled manner.

### Migration Scripts

```bash
# Generate a new migration based on entity changes
pnpm migration:generate

# Create an empty migration file
pnpm migration:create

# Run pending migrations
pnpm migration:run

# Revert the last migration
pnpm migration:revert

# Show migration status
pnpm migration:show

# Run migrations in production (after build)
pnpm migration:run:prod
```

### Creating a New Migration

1. **Generate migration from entity changes:**

   ```bash
   pnpm migration:generate src/migrations/MigrationName
   ```

   This will compare your entities with the current database schema and generate the migration code.

2. **Create an empty migration:**
   ```bash
   pnpm migration:create src/migrations/MigrationName
   ```
   Then manually write the `up()` and `down()` methods.

### Running Migrations

**Local Development:**

```bash
pnpm migration:run
```

**Production/Docker:**
Migrations run automatically when `RUN_MIGRATIONS=true` is set in the environment. The Docker entrypoint script will run migrations before starting the application.

**Manual Production Run:**

```bash
# After building
pnpm build
pnpm migration:run:prod
```

### Migration Files

- Migration files are located in `src/migrations/`
- Each migration file follows the naming pattern: `{timestamp}-{MigrationName}.ts`
- Compiled migrations are output to `dist/migrations/`
- The `migrations` table in the database tracks which migrations have been applied

### Important Notes

- **Development**: By default, `synchronize` is enabled for development, which auto-creates tables. Use migrations for production.
- **Production**: Always use migrations in production. Set `DB_SYNCHRONIZE=false` and `RUN_MIGRATIONS=true`.
- **Docker**: Migrations run automatically on container startup if `RUN_MIGRATIONS=true`.
- **Backup**: Always backup your database before running migrations in production.

## Docker Commands

### Build and Start

```bash
# Start all services
docker-compose up -d

# Start and view logs
docker-compose up

# Rebuild and start
docker-compose up -d --build
```

### Stop and Cleanup

```bash
# Stop services
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers, networks, and volumes
docker-compose down -v
```

### Database Access

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d gantt_db

# Or use any PostgreSQL client with:
# Host: localhost
# Port: 5432
# Database: gantt_db
# Username: postgres
# Password: postgres (or your .env value)
```

### Backend Logs

```bash
# View logs
docker-compose logs -f backend

# View last 100 lines
docker-compose logs --tail=100 backend
```

## Notes

- **Database Schema Management**:
  - Development: `synchronize` is enabled by default (auto-creates/updates tables)
  - Production: Use migrations (`RUN_MIGRATIONS=true`, `DB_SYNCHRONIZE=false`)
  - Migrations run automatically in Docker when `RUN_MIGRATIONS=true`
- **CORS**: Configured to allow requests from the frontend URL specified in `.env`
- **Docker**:
  - Creates a persistent volume for PostgreSQL data
  - Backend service waits for PostgreSQL to be healthy before starting
  - Database data persists across container restarts (stored in `postgres_data` volume)
  - Migrations execute automatically on container startup
