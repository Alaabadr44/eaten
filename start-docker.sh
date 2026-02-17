#!/bin/bash

# Define the source and destination files
EXAMPLE_FILE=".env.example"
ENV_FILE=".env"

# Check if .env exists
if [ ! -f "$ENV_FILE" ]; then
    echo "$ENV_FILE does not exist. Creating from $EXAMPLE_FILE..."
    if [ -f "$EXAMPLE_FILE" ]; then
        cp "$EXAMPLE_FILE" "$ENV_FILE"
        echo "$ENV_FILE created successfully."
    else
        echo "Error: $EXAMPLE_FILE not found. Cannot create $ENV_FILE."
        exit 1
    fi
else
    echo "$ENV_FILE already exists. using existing configuration."
fi

# Determine Docker Compose command
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    echo "Error: Docker Compose not found. Please install Docker Desktop or docker-compose."
    exit 1
fi

# Start Docker Compose in detached mode
echo "Starting Docker Compose using $DOCKER_COMPOSE_CMD..."
$DOCKER_COMPOSE_CMD up -d --build

# Wait for backend to be ready (naive wait)
echo "Waiting for backend to start..."
sleep 10

# Run admin creation script
echo "Creating default admin user..."
$DOCKER_COMPOSE_CMD exec -T backend node dist/scripts/create-admin

# Run service seeding script
echo "Seeding services..."
$DOCKER_COMPOSE_CMD exec -T backend node dist/scripts/create-services

# Run zone seeding script
echo "Seeding zones..."
$DOCKER_COMPOSE_CMD exec -T backend node dist/scripts/create-zones

# Follow logs
echo "Attaching to logs..."
$DOCKER_COMPOSE_CMD logs -f
