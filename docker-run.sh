#!/bin/bash

# SocialBoost Docker Setup Script
echo "🐳 SocialBoost Docker Setup"
echo "=========================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.docker .env
    echo "⚠️  Please edit .env file with your Stripe API keys before continuing"
    echo "   Required: STRIPE_SECRET_KEY and VITE_STRIPE_PUBLIC_KEY"
    read -p "Press Enter after updating .env file..."
fi

# Build and start services
echo "🔨 Building Docker images..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check service health
echo "🔍 Checking service health..."
docker-compose ps

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until docker-compose exec -T db pg_isready -U socialboost -d socialboost; do
    echo "Database is unavailable - sleeping"
    sleep 1
done

echo "✅ Database is ready!"

# Run database migrations
echo "📊 Setting up database schema..."
docker-compose exec app npm run db:push

echo "🎉 SocialBoost is now running!"
echo ""
echo "🌐 Application: http://localhost:5000"
echo "🗄️  Database: postgresql://socialboost:socialboost123@localhost:5432/socialboost"
echo "📊 Nginx Proxy: http://localhost:80"
echo ""
echo "📝 Useful commands:"
echo "   View logs: docker-compose logs -f app"
echo "   Stop services: docker-compose down"
echo "   Restart app: docker-compose restart app"
echo "   Access database: docker-compose exec db psql -U socialboost -d socialboost"