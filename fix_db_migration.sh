#!/bin/bash

# Fix Database Schema Sync Error
# This script manually migrates the 'eventCapacity' column from string enum to integer
# It connects directly to the postgres container to avoid backend restart loops

# Determine Docker Compose command
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    echo "Error: Docker Compose not found."
    exit 1
fi

echo "Identifying Postgres container using $DOCKER_COMPOSE_CMD..."
CONTAINER_ID=$($DOCKER_COMPOSE_CMD ps -q postgres)

if [ -z "$CONTAINER_ID" ]; then
    echo "Error: Could not find running postgres container for this project."
    echo "Please make sure 'docker compose up' is running."
    exit 1
fi

echo "Found container ID: $CONTAINER_ID"

# Load environment variables from .env
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

# Use variables from .env or default to values from docker-compose.yml
DB_USER=${DB_USERNAME:-postgres}
DB_NAME=${DB_NAME:-catering_db}

echo "Using Database User: $DB_USER"
echo "Using Database Name: $DB_NAME"

echo "Migrating 'booking' table schema..."

# SQL command to fix the data
SQL_COMMAND="
BEGIN;
ALTER TABLE booking ALTER COLUMN \"eventCapacity\" TYPE text;
UPDATE booking SET \"eventCapacity\" = '1' WHERE \"eventCapacity\" = 'LESS_THAN_5';
UPDATE booking SET \"eventCapacity\" = '2' WHERE \"eventCapacity\" = 'BETWEEN_5_AND_20';
UPDATE booking SET \"eventCapacity\" = '3' WHERE \"eventCapacity\" = 'MORE_THAN_20';
UPDATE booking SET \"eventCapacity\" = '2' WHERE \"eventCapacity\" NOT IN ('1', '2', '3');
ALTER TABLE booking ALTER COLUMN \"eventCapacity\" TYPE integer USING \"eventCapacity\"::integer;
DROP TYPE IF EXISTS booking_eventcapacity_enum;
COMMIT;
"

docker exec -i "$CONTAINER_ID" psql -U "$DB_USER" -d "$DB_NAME" -c "$SQL_COMMAND"

if [ $? -eq 0 ]; then
    echo "Migration SQL executed successfully."
    echo "Restarting backend container..."
    $DOCKER_COMPOSE_CMD restart backend
else
    echo "Migration failed. Please check the error above."
fi
