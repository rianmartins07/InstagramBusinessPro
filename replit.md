# SocialBoost - Instagram Marketing Automation Platform

## Overview

SocialBoost is a full-stack web application that automates Instagram marketing for businesses. It provides a comprehensive solution for managing Instagram business accounts, creating and scheduling posts, tracking analytics, and managing subscriptions. The platform is built with a modern tech stack focusing on user experience and scalability.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite for development and build processes
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon (PostgreSQL as a Service)
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage

### Key Design Decisions
- **Monorepo Structure**: Single repository with shared types and schemas
- **Full-Stack TypeScript**: Ensures type safety across the entire application
- **Component-First UI**: Modular UI components with consistent design system
- **Server-Side Rendering**: Vite handles both development and production builds

## Key Components

### Authentication System
- **Provider**: Replit Auth with OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **User Management**: Automatic user creation and profile management
- **Security**: HTTP-only cookies with secure session handling

### Database Schema
- **Users**: Core user information with subscription details
- **Business Profiles**: Business-specific information and Instagram connection status
- **Posts**: Content management with scheduling capabilities
- **Analytics**: Performance tracking and engagement metrics
- **Sessions**: Authentication session storage (required for Replit Auth)

### Instagram Integration
- **Connection**: OAuth2 flow for Instagram Business API
- **Post Management**: Create, schedule, and publish posts
- **Analytics**: Track engagement and performance metrics
- **Media Handling**: Support for image URLs and captions

### Subscription System
- **Payment Provider**: Stripe integration
- **Tiers**: Free, Starter ($9), Pro ($29), Enterprise ($99)
- **Usage Limits**: Monthly post limits based on subscription tier
- **Billing**: Automated subscription management

## Data Flow

### User Authentication Flow
1. User initiates login through Replit Auth
2. OAuth2 flow handles authentication
3. User session created and stored in PostgreSQL
4. User profile created or updated automatically
5. Client receives authenticated user data

### Post Creation Flow
1. User creates post through form interface
2. Form validation using Zod schemas
3. Post stored in database with draft status
4. Optional scheduling for future publication
5. Instagram API integration for publishing

### Instagram Connection Flow
1. User initiates Instagram connection
2. OAuth2 flow with Instagram Business API
3. Access tokens stored securely
4. Business profile updated with connection status
5. Ongoing API access for post management

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless database
- **Authentication**: Replit Auth service
- **Payments**: Stripe for subscription management
- **Instagram API**: Instagram Business API for post management

### Development Dependencies
- **UI Components**: Radix UI primitives with shadcn/ui
- **Icons**: Lucide React icon library
- **Date Handling**: date-fns for date manipulation
- **Form Validation**: Zod for schema validation
- **HTTP Client**: Fetch API with custom wrapper

### Build and Development Tools
- **Bundler**: Vite with React plugin
- **TypeScript**: Full-stack type safety
- **ESLint/Prettier**: Code quality and formatting
- **PostCSS**: CSS processing with Tailwind

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Neon PostgreSQL with connection pooling
- **Environment Variables**: Secure configuration management
- **Session Storage**: PostgreSQL sessions table

### Production Build
- **Frontend**: Vite build process generating optimized static assets
- **Backend**: esbuild for Node.js bundle optimization
- **Database Migrations**: Drizzle Kit for schema management
- **Static Assets**: Served through Express static middleware

### Environment Configuration
- **Database**: DATABASE_URL for PostgreSQL connection
- **Authentication**: Replit Auth configuration
- **Payments**: Stripe API keys
- **Instagram**: Instagram Business API credentials
- **Sessions**: SESSION_SECRET for secure session management

## Changelog

```
Changelog:
- July 01, 2025. Initial setup - Complete Instagram marketing automation platform
  - Full-stack TypeScript application with React frontend and Express backend
  - Database schema designed with users, business_profiles, posts, analytics tables
  - Stripe integration for subscription management (Free, Starter $9, Pro $29, Enterprise $99)
  - Instagram OAuth2 integration (mock implementation for demo)
  - Post creation, scheduling, and publishing features
  - Analytics dashboard with engagement tracking
  - Business profile management
  - Subscription status and usage monitoring
  - Comprehensive UI with shadcn/ui components
  - Fully functional authentication with Replit Auth
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
Project Requirements:
- Free tier must require credit card verification to prevent spam
- All tiers require payment method setup through Stripe
- Clear documentation for self-hosting and deployment
```