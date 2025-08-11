# Finance Tracker Application

## Overview

A full-stack personal finance management application built with React, Express.js, and PostgreSQL. The application provides comprehensive financial tracking capabilities including transaction management, budget monitoring, category-based expense analysis, and visual analytics through charts and dashboards. Users can add, edit, and delete transactions, view spending patterns across different categories, and track their financial progress over time.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Radix UI primitives with custom Shadcn/ui components for consistent design
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework using ESM modules
- **API Design**: RESTful API with structured route handlers in `/api` namespace
- **Request Logging**: Custom middleware for API request/response logging with performance tracking
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes
- **Data Validation**: Zod schemas for request validation and type safety
- **Development**: Hot reloading with Vite integration for seamless development experience

### Data Storage
- **Database**: PostgreSQL with Neon Database serverless hosting
- **ORM**: Drizzle ORM with type-safe queries and migrations
- **Schema Design**: Three main entities - transactions, categories, and budgets
- **Data Types**: Decimal precision for monetary values, UUID primary keys, timestamp tracking
- **Development Storage**: In-memory storage implementation for development/testing

### Database Schema
- **Transactions**: Core financial records with amount, type (income/expense), category, date, and optional receipt URLs
- **Categories**: Predefined and custom expense/income categories with colors and icons
- **Budgets**: Category-specific spending limits with monthly/yearly periods

### Authentication & Session Management
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple
- **Security**: Credential-based authentication with secure cookie handling

### Development & Deployment
- **Development**: Concurrent client/server development with Vite middleware integration
- **Build Process**: Separate client (Vite) and server (esbuild) build pipelines
- **Static Assets**: Client build output served as static files in production
- **Environment**: Environment-based configuration for database connections and API endpoints

## External Dependencies

### Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form state management and validation
- **wouter**: Lightweight routing for single-page application navigation

### UI and Design System
- **@radix-ui/***: Comprehensive set of accessible UI primitives (dialogs, dropdowns, forms, etc.)
- **tailwindcss**: Utility-first CSS framework with custom design tokens
- **class-variance-authority**: Type-safe variant API for component styling
- **lucide-react**: Modern icon library for UI elements

### Data and Validation
- **drizzle-orm**: Type-safe ORM for PostgreSQL database interactions
- **drizzle-zod**: Integration between Drizzle schemas and Zod validation
- **zod**: Schema validation library for type-safe data handling
- **@neondatabase/serverless**: Serverless PostgreSQL database driver

### Charts and Visualization
- **recharts**: React charting library for financial data visualization
- **date-fns**: Date manipulation utilities for time-based analytics

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking for enhanced code quality
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **tsx**: TypeScript execution for Node.js server development