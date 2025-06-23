# EmasKu - Gold Price Tracking Application

## Overview

EmasKu is a modern gold price tracking application built with a full-stack TypeScript architecture. It provides real-time gold price monitoring, historical data visualization, price calculations, and market analysis for Indonesian gold markets (IDR currency). The application features a mobile-first design with a React frontend and Express.js backend.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Styling**: Tailwind CSS with custom design tokens for gold-themed colors
- **Charts**: Recharts for price visualization
- **Mobile-First**: Responsive design optimized for mobile devices

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API design
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Development**: Hot module replacement with Vite integration

### Database Schema
Two main tables manage gold price data:
- **gold_prices**: Current gold prices with change indicators
- **price_history**: Historical price data for trend analysis

Supports multiple gold karat types (18K, 22K, 24K) with price per gram in IDR currency.

## Key Components

### Data Services
- **Gold Price Service**: Handles external API integration and data processing
- **Storage Layer**: Abstracted storage interface with in-memory fallback
- **Price Calculator**: Unit conversion and investment calculations

### Frontend Features
- **Real-time Price Display**: Live gold prices with change indicators
- **Interactive Charts**: Price history visualization with multiple timeframes
- **Unit Calculator**: Convert between grams, ounces, and kilograms
- **Price History**: Historical data analysis with filtering options
- **Market Status**: Real-time market open/close status

### API Endpoints
- `GET /api/gold-prices` - Latest gold prices for all karat types
- `GET /api/market-status` - Current market status and overall trends
- `GET /api/price-history/:karat` - Historical price data with date range
- `GET /api/chart-data/:karat` - Formatted data for chart visualization
- `POST /api/refresh-prices` - Manual price refresh trigger

## Data Flow

1. **Price Fetching**: External API integration with fallback to stored data
2. **Data Processing**: Currency conversion (USD to IDR) and karat calculations
3. **Storage**: Persistent storage in PostgreSQL with caching layer
4. **Real-time Updates**: 5-minute refresh intervals with manual refresh option
5. **Client Sync**: React Query manages client-side caching and synchronization

## External Dependencies

### Core Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: drizzle-orm with PostgreSQL dialect
- **UI Framework**: React with Radix UI primitives
- **Charts**: recharts for data visualization
- **Forms**: react-hook-form with zod validation
- **Dates**: date-fns for date manipulation

### Development Tools
- **Build**: Vite with React plugin
- **TypeScript**: Full type safety across the stack
- **Database Migrations**: drizzle-kit for schema management
- **Process Management**: tsx for TypeScript execution

## Deployment Strategy

### Replit Configuration
- **Runtime**: Node.js 20 with PostgreSQL 16
- **Build Process**: Vite build for client + esbuild for server
- **Development**: Hot reload with file watching
- **Production**: Optimized static asset serving

### Build Process
1. Client assets compiled with Vite to `dist/public`
2. Server code bundled with esbuild to `dist/index.js`
3. Static file serving integrated with Express
4. Environment-based configuration

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment mode (development/production)
- `GOLD_API_KEY` or `METALS_API_KEY`: External API authentication

## Changelog

Changelog:
- June 23, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.