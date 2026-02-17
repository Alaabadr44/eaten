#!/bin/bash

# Fix Database Schema Sync Error
# This script manually migrates the 'eventCapacity' column from string enum to integer
# It connects directly to the postgres container to avoid backend restart loops

# Check if docker is available
if ! command -v docker &> /dev/null; then
    echo "Error: docker command not found."
    exit 1
fi

echo "Migrating 'booking' table schema in Postgres container..."

# SQL command to fix the data
SQL_COMMAND="
BEGIN;
-- Drop the enum dependency from the column if exists (might fail if already dropped, ignore error)
ALTER TABLE booking ALTER COLUMN \"eventCapacity\" TYPE text;

-- Update existing data mapping
UPDATE booking SET \"eventCapacity\" = '1' WHERE \"eventCapacity\" = 'LESS_THAN_5';
UPDATE booking SET \"eventCapacity\" = '2' WHERE \"eventCapacity\" = 'BETWEEN_5_AND_20';
UPDATE booking SET \"eventCapacity\" = '3' WHERE \"eventCapacity\" = 'MORE_THAN_20';

-- Handle any other values (set to default 2 if unknown)
UPDATE booking SET \"eventCapacity\" = '2' WHERE \"eventCapacity\" NOT IN ('1', '2', '3');

-- Cast to integer
ALTER TABLE booking ALTER COLUMN \"eventCapacity\" TYPE integer USING \"eventCapacity\"::integer;

-- Drop the old enum type
DROP TYPE IF EXISTS booking_eventcapacity_enum;
COMMIT;
"

# Try to finding the postgres container name
CONTAINER_NAME=$(docker ps --format '{{.Names}}' | grep postgres | head -n 1)

if [ -z "$CONTAINER_NAME" ]; then
    # Fallback to standard names if grep failed or container not running
    CONTAINER_NAME="eaten-postgres-1"
fi

echo "Targeting container: $CONTAINER_NAME"

docker exec -i "$CONTAINER_NAME" psql -U postgres -d catering_db -c "$SQL_COMMAND"

if [ $? -eq 0 ]; then
    echo "Migration SQL executed successfully."
    echo "Restarting backend container..."
    docker restart eaten-backend-1
else
    echo "Migration failed. Please check the error above."
    echo "Make sure the postgres container is running."
fi
