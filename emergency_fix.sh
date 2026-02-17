#!/bin/bash

# Emergency Fix for Database Schema
# Explicitly targets 'eaten-postgres-1' container seen in your logs

CONTAINER_NAME="eaten-postgres-1"
DB_USER="postgres"
DB_NAME="catering_db"

echo "Attempting to fix database on container: $CONTAINER_NAME"

# Check if container is running
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo "Error: Container $CONTAINER_NAME is not running."
    echo "Please ensure 'docker compose up' is active (even if backend is crashing)."
    exit 1
fi

# SQL command
SQL_COMMAND="
BEGIN;
-- Relax column type
ALTER TABLE booking ALTER COLUMN \"eventCapacity\" TYPE text;

-- Migrate known values
UPDATE booking SET \"eventCapacity\" = '1' WHERE \"eventCapacity\" = 'LESS_THAN_5';
UPDATE booking SET \"eventCapacity\" = '2' WHERE \"eventCapacity\" = 'BETWEEN_5_AND_20';
UPDATE booking SET \"eventCapacity\" = '3' WHERE \"eventCapacity\" = 'MORE_THAN_20';

-- Fix any remaining non-numeric values to default '2'
UPDATE booking SET \"eventCapacity\" = '2' WHERE \"eventCapacity\" !~ '^[0-9]+$';

-- Cast to integer
ALTER TABLE booking ALTER COLUMN \"eventCapacity\" TYPE integer USING \"eventCapacity\"::integer;

-- Cleanup
DROP TYPE IF EXISTS booking_eventcapacity_enum;
COMMIT;
"

echo "Running migration SQL..."
docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -c "$SQL_COMMAND"

if [ $? -eq 0 ]; then
    echo "Migration SUCCESS."
    echo "Restarting backend..."
    docker restart eaten-backend-1
else
    echo "Migration FAILED."
fi
