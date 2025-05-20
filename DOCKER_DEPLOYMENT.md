# Docker Deployment Guide for CarPulse Application

This document provides instructions for deploying the CarPulse application using Docker.

## Prerequisites

- Docker Desktop installed on your machine
- Docker Compose installed (included with Docker Desktop)
- Git to clone the repository

## Production Deployment

To deploy the application in production mode:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd carpulse
   ```

2. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

   This will:
   - Create and start the MariaDB database
   - Build and start the Spring Boot backend
   - Build and start the React frontend with Nginx

3. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:8080
   - Database: localhost:3306

4. To stop the application:
   ```bash
   docker-compose down
   ```

5. To stop the application and remove volumes (will delete database data):
   ```bash
   docker-compose down -v
   ```

## Development Deployment

For development with live reloading:

1. Start the development environment:
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080
   - Database: localhost:3306

3. Development features:
   - Frontend code changes will automatically reload
   - Backend code changes require a restart of the backend service:
     ```bash
     docker-compose -f docker-compose.dev.yml restart backend
     ```

4. To stop the development environment:
   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```

## Troubleshooting

### Database Connection Issues

If the backend cannot connect to the database:

1. Ensure the database container is running:
   ```bash
   docker ps | grep carpulse-db
   ```

2. Check database logs:
   ```bash
   docker logs carpulse-db
   ```

3. Make sure the database credentials in the application match those in the Docker Compose file.

### Frontend Cannot Connect to Backend

If the frontend cannot reach the backend:

1. Ensure the backend container is running:
   ```bash
   docker ps | grep carpulse-backend
   ```

2. Check backend logs:
   ```bash
   docker logs carpulse-backend
   ```

3. Verify CORS settings in the backend to allow requests from the frontend.

### Container Building Issues

If container building fails:

1. Try building with verbose output:
   ```bash
   docker-compose build --no-cache --progress=plain
   ```

2. Ensure Docker has sufficient resources allocated (memory, CPU).

## Updating the Application

To update to a new version:

1. Pull the latest code:
   ```bash
   git pull
   ```

2. Rebuild and restart containers:
   ```bash
   docker-compose up -d --build
   ```

## Production Considerations

For a real production environment, consider:

1. Using a reverse proxy like Traefik or Nginx for SSL termination
2. Setting up proper secrets management for database credentials
3. Implementing backup strategies for the database volume
4. Setting up monitoring and logging solutions
5. Using Docker Swarm or Kubernetes for high availability 