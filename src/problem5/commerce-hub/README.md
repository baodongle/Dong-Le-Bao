# Commerce Hub

A modern e-commerce API built with Express.js, TypeScript, and Drizzle ORM.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Bun](https://bun.sh/) (latest version recommended)
- Node.js 18+ (for compatibility)
- PostgreSQL database (or access to a cloud provider like Neon)

## Tech Stack

- **Runtime**: Bun
- **Framework**: Express.js 5.x
- **Language**: TypeScript 5.9
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod
- **Logging**: Pino
- **Monorepo**: Nx
- **Architecture**: Clean Architecture

## Getting Started

### 1. Installation

Install dependencies using Bun:

```
bun install
```

### 2. Environment Configuration

Create a `.env` file in the project root with the following variables:

```env
HOST=localhost
PORT=3000
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
```

**Environment Variables:**

- `HOST` - Server host (default: localhost)
- `PORT` - Server port (default: 3000)
- `DATABASE_URL` - PostgreSQL connection string

### 3. Database Setup

Run database migrations:

```
bun nx run @commerce-hub/api:"db:push"
```

Generate database schema:

```
bun nx run @commerce-hub/api:"db:generate"
```

### 4. Running the Application

#### Development Mode

```
bun nx run @commerce-hub/api:serve:development
```

The API will be available at `http://localhost:3000` (or your configured HOST:PORT).

#### Production Build

```
bun nx run @commerce-hub/api:build:production
bun nx run @commerce-hub/api:serve:production
```

## Project Structure

This project follows **Clean Architecture** principles, separating concerns into distinct layers:

```
commerce-hub/
├── apps/
│   └── api/                    # Main API application
│       ├── src/
│       │   ├── domain/         # Enterprise Business Rules
│       │   │   ├── entities/   # Core business entities
│       │   │   └── repositories/ # Repository interfaces
│       │   │
│       │   ├── application/    # Application Business Rules
│       │   │   ├── use-cases/  # Application-specific business logic
│       │   │   └── services/   # Application services
│       │   │
│       │   ├── infrastructure/ # Frameworks & Drivers
│       │   │   ├── database/   # Database implementation (Drizzle ORM)
│       │   │   ├── http/       # HTTP server setup
│       │   │   └── config/     # Configuration & environment
│       │   │
│       │   ├── presentation/   # Interface Adapters
│       │   │   ├── controllers/ # Request handlers
│       │   │   ├── middlewares/ # Express middlewares
│       │   │   ├── routes/      # API routes
│       │   │   └── validators/  # Request/Response validation
│       │   │
│       │   └── main.ts         # Application entry point
│       │
│       └── tsconfig.json       # TypeScript configuration
│
├── .env                        # Environment variables
├── package.json                # Dependencies and scripts
├── tsconfig.json               # Root TypeScript configuration
├── nx.json                     # Nx workspace configuration
└── README.md                   # This file
```

### Architecture Layers

1. **Domain Layer** (Innermost)
   - Contains enterprise business rules
   - Entities and domain models
   - Repository interfaces (contracts)
   - No dependencies on outer layers
2. **Application Layer**
   - Contains application-specific business rules
   - Use cases (interactors)
   - Application services
   - Depends only on Domain layer
3. **Infrastructure Layer**
   - Implements interfaces from Domain layer
   - Database access (Drizzle ORM)
   - External services integration
   - Framework-specific code
4. **Presentation Layer** (Outermost)
   - HTTP controllers and routes
   - Request/Response DTOs
   - Input validation
   - Middleware configuration

## API Testing

Use the `api.http` file for testing endpoints with REST Client extensions in VS Code or JetBrains IDEs.

## Code Quality

This project uses:

- **ESLint** - Code linting with Sheriff configuration
- **Prettier** - Code formatting
- **TypeScript** - Type safety with strict mode

Run checks:

```
bun nx run @commerce-hub/api:lint        # Lint code
```

## Database Management

The project uses Drizzle ORM for database operations:

- Schema files are located in the infrastructure/database directory
- Migrations are managed via Drizzle Kit
- Use `bun nx run @commerce-hub/api:"db:studio"` to visually inspect and manage your database

## Security Features

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Express rate limiter
- **Compression** - Response compression

## Troubleshooting

### Connection Issues

- Verify your `DATABASE_URL` is correct
- Ensure your database is accessible from your network
- Check if SSL mode is required by your database provider

### Port Already in Use

- Change the `PORT` in your `.env` file
- Kill the process using the port: `lsof -ti:3000 | xargs kill` (macOS/Linux)
