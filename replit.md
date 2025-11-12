# Whiteboard Application

## Overview

A collaborative whiteboard application that allows users to create, manage, and draw on multiple digital canvases. The application provides drawing tools including pen, eraser, and shape tools (rectangle, circle, line) with customizable colors and brush sizes. Built with a focus on clean productivity aesthetics inspired by Linear and Figma/Miro design patterns.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tools**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR (Hot Module Replacement)
- Wouter for lightweight client-side routing
- Path aliases configured for clean imports (`@/`, `@shared/`, `@assets/`)

**UI Component System**
- shadcn/ui component library with Radix UI primitives for accessible, composable components
- Tailwind CSS for utility-first styling with custom design tokens
- CSS variables for theming support (light/dark modes)
- Custom design system based on "new-york" style variant

**State Management**
- TanStack Query (React Query) for server state management and data fetching
- Local React state for UI interactions and drawing canvas state
- History management (undo/redo) using past/future state arrays
- Local storage for theme preferences

**Canvas Drawing System**
- HTML5 Canvas API for rendering drawing elements
- Custom drawing element types: path, rectangle, circle, line
- Real-time drawing with mouse events
- Local state buffering with debounced server synchronization

### Backend Architecture

**Server Framework**
- Express.js as the HTTP server framework
- Custom route registration system separating API endpoints from server setup
- Development middleware for logging API requests with duration tracking

**API Design**
- RESTful API endpoints for whiteboard CRUD operations
- JSON request/response format
- Zod schema validation for request payloads
- Standard HTTP status codes (200, 201, 404, 500)

**Storage Layer**
- Abstracted storage interface (`IStorage`) for swappable data persistence
- In-memory storage implementation (`MemStorage`) as default
- UUID-based resource identification
- Whiteboard data stored as JSON arrays of drawing elements

### Data Storage Solutions

**Database Configuration**
- Drizzle ORM configured for PostgreSQL dialect
- Neon Database serverless PostgreSQL as the target database
- Schema defined with type-safe table definitions
- Migration system configured with `drizzle-kit`

**Schema Design**
- `whiteboards` table with:
  - `id` (varchar, primary key, auto-generated UUID)
  - `name` (text, required)
  - `data` (jsonb, defaults to empty array)
- Zod schema validation derived from Drizzle schema using `drizzle-zod`

**Current State**
- Application currently uses in-memory storage (`MemStorage`)
- Database infrastructure configured but not yet connected
- Migration files generated in `./migrations` directory
- Easy migration path: swap `MemStorage` for Drizzle-based implementation

### External Dependencies

**UI Libraries**
- Radix UI primitives (20+ component primitives for accessibility)
- Lucide React for icon components
- class-variance-authority (CVA) for variant-based component styling
- tailwind-merge and clsx for conditional className composition

**State Management**
- TanStack Query v5 for async state management
- React Hook Form with Hookform Resolvers for form handling
- Zod for runtime type validation

**Database & ORM**
- Drizzle ORM for type-safe database queries
- @neondatabase/serverless for PostgreSQL connection
- drizzle-zod for schema-to-Zod validation conversion

**Development Tools**
- TypeScript for static type checking
- ESBuild for server-side bundling
- tsx for TypeScript execution in development
- Replit-specific plugins for development experience (error overlay, cartographer, dev banner)

**Styling & Fonts**
- Tailwind CSS with PostCSS and Autoprefixer
- Google Fonts: Inter (UI text) and JetBrains Mono (monospace)
- Custom Tailwind configuration with extended color system and design tokens

**Session & Middleware**
- connect-pg-simple for PostgreSQL session store (configured but not actively used)
- Express middleware for JSON parsing and URL encoding