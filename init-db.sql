-- Initialize database for SocialBoost
-- This script sets up the basic database configuration

-- Ensure the database exists
CREATE DATABASE IF NOT EXISTS socialboost;

-- Connect to the socialboost database
\c socialboost;

-- Create extensions if they don't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE socialboost TO socialboost;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO socialboost;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO socialboost;

-- Set up proper timezone
SET timezone = 'UTC';