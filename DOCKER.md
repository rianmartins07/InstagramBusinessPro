# SocialBoost Docker Setup Guide

This guide explains how to run SocialBoost using Docker containers for a complete production-ready setup.

## What's Included

The Docker setup provides:

- **PostgreSQL Database** - Persistent data storage with automatic schema setup
- **Redis Cache** - Session storage and caching (optional)
- **Application Server** - The main SocialBoost application
- **Nginx Proxy** - Reverse proxy with rate limiting and security headers
- **Health Checks** - Automatic service monitoring and restart

## Quick Start

### 1. Prerequisites

- Docker (v20.0 or higher)
- Docker Compose (v2.0 or higher)
- Your Stripe API keys

### 2. Clone and Setup

```bash
git clone <your-repo-url>
cd socialboost
```

### 3. Configure Environment

Copy the Docker environment template:
```bash
cp .env.docker .env
```

Edit `.env` file with your real Stripe API keys:
```bash
# Required: Update these with your real Stripe keys
STRIPE_SECRET_KEY=sk_test_your_real_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=pk_test_your_real_stripe_public_key

# Optional: Change the session secret for production
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
```

### 4. Run the Application

#### Option A: Automated Setup (Recommended)
```bash
./docker-run.sh
```

#### Option B: Manual Setup
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Setup database schema
docker-compose exec app npm run db:push
```

### 5. Access the Application

- **Application**: http://localhost:5000
- **Nginx Proxy**: http://localhost:80
- **Database**: postgresql://socialboost:socialboost123@localhost:5432/socialboost

## Docker Services

### Application Service (`app`)
- **Image**: Built from local Dockerfile
- **Port**: 5000
- **Health Check**: /api/health endpoint
- **Depends On**: Database and Redis

### Database Service (`db`)
- **Image**: postgres:15-alpine
- **Port**: 5432
- **Credentials**: socialboost/socialboost123
- **Volume**: Persistent data storage
- **Health Check**: pg_isready

### Redis Service (`redis`)
- **Image**: redis:7-alpine
- **Port**: 6379
- **Health Check**: Redis ping

### Nginx Service (`nginx`)
- **Image**: nginx:alpine
- **Ports**: 80 (HTTP), 443 (HTTPS)
- **Features**: Rate limiting, security headers, caching

## Useful Commands

### Viewing Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f db
```

### Managing Services
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart specific service
docker-compose restart app

# Rebuild and restart
docker-compose up -d --build
```

### Database Operations
```bash
# Access database shell
docker-compose exec db psql -U socialboost -d socialboost

# Run database migrations
docker-compose exec app npm run db:push

# Backup database
docker-compose exec db pg_dump -U socialboost socialboost > backup.sql

# Restore database
docker-compose exec -T db psql -U socialboost socialboost < backup.sql
```

### Application Operations
```bash
# Access application shell
docker-compose exec app sh

# View application status
docker-compose exec app npm run check

# Restart application only
docker-compose restart app
```

## Environment Variables

### Required Variables
- `STRIPE_SECRET_KEY` - Your Stripe secret key (sk_...)
- `VITE_STRIPE_PUBLIC_KEY` - Your Stripe publishable key (pk_...)
- `SESSION_SECRET` - Secure session encryption key

### Database Variables (Auto-configured)
- `DATABASE_URL` - PostgreSQL connection string
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` - Connection details

### Optional Variables
- `REDIS_URL` - Redis connection string
- `REPL_ID` - Replit application ID (if using Replit Auth)
- `REPLIT_DOMAINS` - Allowed domains for Replit Auth

## Production Deployment

### Security Considerations

1. **Change Default Passwords**
   ```bash
   # Update database credentials in docker-compose.yml
   POSTGRES_PASSWORD=your-secure-password
   ```

2. **Use Strong Session Secret**
   ```bash
   # Generate secure session secret
   openssl rand -hex 32
   ```

3. **Enable HTTPS**
   - Uncomment HTTPS server block in `nginx.conf`
   - Add SSL certificates to `./ssl/` directory
   - Update domain configuration

4. **Environment Variables**
   - Use Docker secrets or external secret management
   - Never commit real API keys to version control

### SSL/HTTPS Setup

1. Obtain SSL certificates (Let's Encrypt recommended)
2. Place certificates in `ssl/` directory:
   ```
   ssl/
   ├── cert.pem
   └── key.pem
   ```
3. Uncomment HTTPS server block in `nginx.conf`
4. Update `REPLIT_DOMAINS` with your real domain

### Monitoring and Logging

The Docker setup includes:
- Health checks for all services
- Automatic restart on failure
- Centralized logging via Docker logs
- Nginx access and error logs

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :5000
   
   # Stop conflicting services or change ports in docker-compose.yml
   ```

2. **Database Connection Failed**
   ```bash
   # Check database status
   docker-compose ps db
   
   # View database logs
   docker-compose logs db
   
   # Restart database
   docker-compose restart db
   ```

3. **Application Won't Start**
   ```bash
   # Check application logs
   docker-compose logs app
   
   # Verify environment variables
   docker-compose exec app env | grep STRIPE
   
   # Rebuild application
   docker-compose up -d --build app
   ```

4. **Stripe Integration Issues**
   ```bash
   # Verify Stripe keys are set correctly
   docker-compose exec app env | grep STRIPE
   
   # Test Stripe connectivity
   docker-compose exec app curl -H "Authorization: Bearer $STRIPE_SECRET_KEY" https://api.stripe.com/v1/charges
   ```

### Health Checks

Monitor service health:
```bash
# Check all service status
docker-compose ps

# View health check logs
docker-compose logs app | grep health

# Manual health check
curl http://localhost:5000/api/health
```

### Performance Tuning

1. **Database Performance**
   - Increase shared_buffers in PostgreSQL
   - Add database connection pooling
   - Monitor query performance

2. **Application Performance**
   - Increase Node.js memory limit
   - Enable application-level caching
   - Monitor CPU and memory usage

3. **Nginx Performance**
   - Adjust worker processes and connections
   - Enable gzip compression
   - Configure static file caching

## Scaling

### Horizontal Scaling
```yaml
# Scale application instances
docker-compose up -d --scale app=3

# Add load balancer configuration
# Update nginx.conf with multiple upstream servers
```

### Database Scaling
- Consider PostgreSQL read replicas
- Implement connection pooling (PgBouncer)
- Monitor database performance metrics

## Backup and Recovery

### Automated Backups
```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T db pg_dump -U socialboost socialboost > "backup_$DATE.sql"
```

### Recovery Process
```bash
# Stop application
docker-compose stop app

# Restore database
docker-compose exec -T db psql -U socialboost socialboost < backup_file.sql

# Start application
docker-compose start app
```

## Support

For Docker-specific issues:
1. Check the troubleshooting section above
2. Review Docker and Docker Compose logs
3. Verify environment variable configuration
4. Test individual services separately

For application issues, refer to the main README.md file.