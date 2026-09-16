# Overview

This is a modern full-stack web application featuring a personal portfolio/showcase website. The project demonstrates a React-based frontend with a Node.js Express backend, showcasing web development and AI solutions expertise. The application includes sections for About, Skills, Timeline, Projects, Testimonials, Services, and Contact, with a cosmic-themed design system and responsive UI components.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **Styling**: Tailwind CSS with a custom cosmic theme design system using CSS variables
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Theme Support**: Built-in light/dark mode toggle with system preference detection

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for full-stack type safety
- **Database ORM**: Drizzle ORM configured for PostgreSQL with Neon Database serverless
- **Session Management**: Connect-pg-simple for PostgreSQL-backed session storage
- **Development**: Hot reloading with Vite middleware integration in development mode

## Component Structure
- **Modular Components**: Highly composable UI components following atomic design principles
- **Custom Hooks**: Reusable hooks for mobile detection, toast notifications, and theme management
- **Layout Components**: Header, Footer, FloatingNav for consistent navigation experience
- **Page Sections**: About, Skills, Timeline, Projects, Testimonials, Services, Contact as standalone components

## Design System
- **Cosmic Theme**: Custom design tokens with gradient backgrounds and cosmic-inspired color palette
- **Responsive Design**: Mobile-first approach with responsive navigation and layouts
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support through Radix UI
- **Animation**: CSS transitions and keyframe animations for interactive elements

## Development Workflow
- **Monorepo Structure**: Shared schema and utilities between client and server
- **Path Aliases**: Configured TypeScript paths for clean imports (@/, @shared/, @assets/)
- **Build Process**: Separate client and server builds with esbuild for server bundling
- **Type Safety**: End-to-end TypeScript with shared types between frontend and backend

# External Dependencies

## Database & Storage
- **Neon Database**: Serverless PostgreSQL database for production data storage
- **Drizzle ORM**: Type-safe database operations with schema migrations
- **Connect-pg-simple**: PostgreSQL session store for user session management

## UI & Styling
- **Radix UI**: Headless component primitives for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework with custom theme configuration
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe component variants and styling

## Development Tools
- **Vite**: Build tool with HMR and development server
- **ESBuild**: Fast JavaScript/TypeScript bundler for production builds
- **TanStack React Query**: Server state synchronization and caching
- **React Hook Form**: Form validation and state management
- **Zod**: Runtime type validation for form schemas

## Deployment & Runtime
- **Replit Platform**: Configured for Replit deployment with specific plugins and banners
- **Express.js**: Web server framework with middleware support
- **CORS & Security**: Request logging and error handling middleware