#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 SocialBoost Setup Script');
console.log('============================\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env template...');
  
  const envTemplate = `# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# PostgreSQL Connection Details (auto-generated from DATABASE_URL)
PGHOST=your-host
PGPORT=5432
PGUSER=your-username
PGPASSWORD=your-password
PGDATABASE=your-database

# Stripe Configuration
# Get these from https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key

# Session Security
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SESSION_SECRET=${require('crypto').randomBytes(32).toString('hex')}

# Replit Configuration (if using Replit)
REPL_ID=your-repl-id
ISSUER_URL=https://replit.com/oidc
REPLIT_DOMAINS=your-domain.replit.dev
`;

  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ .env file created with template');
  console.log('📋 Please update the values in .env file before continuing\n');
} else {
  console.log('✅ .env file already exists\n');
}

// Check for required environment variables
console.log('🔍 Checking environment variables...');
require('dotenv').config();

const requiredEnvVars = [
  'DATABASE_URL',
  'STRIPE_SECRET_KEY', 
  'VITE_STRIPE_PUBLIC_KEY',
  'SESSION_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.log('❌ Missing required environment variables:');
  missingEnvVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\n📝 Please update your .env file and run setup again');
  process.exit(1);
}

console.log('✅ All required environment variables are set\n');

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed\n');
} catch (error) {
  console.log('❌ Failed to install dependencies');
  console.log('Please run: npm install');
  process.exit(1);
}

// Setup database
console.log('🗄️  Setting up database...');
try {
  execSync('npm run db:push', { stdio: 'inherit' });
  console.log('✅ Database schema deployed\n');
} catch (error) {
  console.log('❌ Failed to setup database');
  console.log('Please check your DATABASE_URL and run: npm run db:push');
  process.exit(1);
}

console.log('🎉 Setup complete!');
console.log('==================\n');
console.log('Next steps:');
console.log('1. Run: npm run dev');
console.log('2. Open: http://localhost:5000');
console.log('3. Test the subscription flow');
console.log('\n📚 See README.md for more information');