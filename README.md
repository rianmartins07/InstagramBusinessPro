# SocialBoost - Instagram Marketing Automation Platform

A full-stack SaaS platform that automates Instagram marketing for businesses with subscription tiers, payment processing, and automated posting capabilities.

## Features

- **User Authentication**: Secure login with Replit Auth
- **Subscription Management**: Multiple tiers with Stripe integration
- **Instagram Integration**: OAuth2 connection for business accounts
- **Post Management**: Create, schedule, and publish content
- **Analytics Dashboard**: Track engagement and performance
- **Business Profiles**: Manage company information and branding

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS + shadcn/ui components
- TanStack Query for state management
- Wouter for routing

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL with Drizzle ORM
- Stripe for payments
- Replit Auth for authentication

## Prerequisites

Before running this project, you'll need:

1. **Node.js** (v18 or higher)
2. **PostgreSQL database** (we recommend Neon for serverless PostgreSQL)
3. **Stripe account** for payment processing
4. **Replit account** for authentication (if using Replit Auth)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# PostgreSQL Connection Details (auto-generated from DATABASE_URL)
PGHOST=your-host
PGPORT=5432
PGUSER=your-username
PGPASSWORD=your-password
PGDATABASE=your-database

# Stripe (Get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# Session Security
SESSION_SECRET=your-super-secret-session-key

# Replit Configuration (if deploying on Replit)
REPL_ID=your-repl-id
ISSUER_URL=https://replit.com/oidc
REPLIT_DOMAINS=your-domain.replit.dev
```

## Getting Started

You can run SocialBoost in two ways:

### Option A: Docker (Recommended for Production)

The fastest way to get SocialBoost running with all dependencies:

```bash
git clone <your-repo-url>
cd socialboost

# Quick setup with Docker
./docker-run.sh
```

See [DOCKER.md](DOCKER.md) for complete Docker setup instructions.

### Option B: Local Development

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd socialboost
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the environment variables template above and fill in your actual values:

#### Database Setup (Neon PostgreSQL)
1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Copy the connection string to `DATABASE_URL`

#### Stripe Setup
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your **Publishable key** (starts with `pk_`) to `VITE_STRIPE_PUBLIC_KEY`
3. Copy your **Secret key** (starts with `sk_`) to `STRIPE_SECRET_KEY`

#### Session Secret
Generate a secure random string for `SESSION_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Set Up Database Schema

Push the database schema to your PostgreSQL database:

```bash
npm run db:push
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Subscription Tiers

The platform offers 4 subscription tiers:

| Tier | Price | Posts/Month | Features |
|------|-------|-------------|----------|
| **Free** | $0 | 5 | Basic analytics, Post scheduling, Community support |
| **Starter** | $9 | 50 | Basic analytics, Post scheduling, Email support |
| **Pro** | $29 | 200 | Advanced analytics, AI content suggestions, Priority support |
| **Enterprise** | $99 | Unlimited | Custom analytics, Multiple accounts, Dedicated support |

> **Note**: All tiers, including Free, require credit card verification to prevent spam and ensure legitimate users.

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   ├── db.ts              # Database connection
│   └── replitAuth.ts      # Authentication setup
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema definitions
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server (both frontend and backend)
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run db:generate` - Generate database migrations

## API Endpoints

### Authentication
- `GET /api/auth/user` - Get current user
- `GET /api/login` - Start login flow
- `GET /api/logout` - Logout user

### Subscriptions
- `POST /api/create-subscription` - Create/upgrade subscription
- `POST /api/cancel-subscription` - Cancel subscription

### Posts
- `GET /api/posts` - Get user's posts
- `POST /api/posts` - Create new post
- `GET /api/posts/recent` - Get recent posts
- `GET /api/posts/scheduled` - Get scheduled posts

### Business Profile
- `GET /api/business-profile` - Get business profile
- `POST /api/business-profile` - Create/update business profile

### Analytics
- `GET /api/analytics/stats` - Get user statistics

## Deployment

### Deploy on Replit

1. Import this repository to Replit
2. Set up environment variables in Replit Secrets
3. The project will automatically run with the configured workflow

### Deploy Elsewhere

1. Build the project:
   ```bash
   npm run build
   ```

2. Set up environment variables on your hosting platform

3. Ensure PostgreSQL database is accessible

4. Start the production server:
   ```bash
   npm start
   ```

## Database Schema

The application uses PostgreSQL with the following main tables:

- **users** - User accounts and subscription info
- **business_profiles** - Business information and Instagram connections
- **posts** - Content posts and scheduling
- **analytics** - Performance tracking data
- **sessions** - User session storage

## Instagram Integration

The platform includes Instagram Business API integration for:

- OAuth2 authentication with Instagram
- Post publishing to Instagram Business accounts
- Analytics data retrieval
- Account management

> **Note**: Instagram Business API requires app review for production use. The current implementation includes mock endpoints for development and testing.

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify `DATABASE_URL` is correct
   - Ensure database is accessible from your network
   - Run `npm run db:push` to set up schema

2. **Stripe Integration Not Working**
   - Check that both `STRIPE_SECRET_KEY` and `VITE_STRIPE_PUBLIC_KEY` are set
   - Ensure keys are from the same Stripe account (test/live)
   - Verify keys have correct permissions

3. **Authentication Issues**
   - Ensure `SESSION_SECRET` is set and secure
   - Check Replit Auth configuration if using Replit
   - Verify database sessions table exists

4. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npx tsc --noEmit`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the troubleshooting section above
- Review the API documentation
- Contact the development team

---

Built with ❤️ using modern web technologies