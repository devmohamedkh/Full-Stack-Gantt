#!/bin/sh
set -e

echo "Waiting for database to be ready..."
until nc -z ${DB_HOST:-postgres} ${DB_PORT:-5432}; do
  echo "Database is unavailable - sleeping"
  sleep 1
done

echo "Database is ready - running migrations..."

# Run migrations
if [ "$RUN_MIGRATIONS" = "true" ]; then
  node dist/migrations/run-migrations.js
else
  echo "Skipping migrations (RUN_MIGRATIONS not set to 'true')"
fi

echo "Starting application..."
exec node dist/main.js

