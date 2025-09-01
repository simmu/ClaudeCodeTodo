# Todo App Backend

Express.js backend with TypeScript, Prisma, and PostgreSQL for the todo application.

## Features

- **Express Server**: TypeScript-based REST API server
- **Prisma ORM**: Database schema and migrations
- **PostgreSQL**: Primary database
- **JWT Authentication**: Secure user authentication
- **CORS & Security**: Helmet and CORS middleware
- **WebSocket Support**: Real-time updates
- **Validation**: Zod schema validation

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

3. **Set up PostgreSQL database:**
   - Install PostgreSQL
   - Create a database named `todoapp`
   - Update the `DATABASE_URL` in `.env`

4. **Run database setup:**
   ```bash
   npm run db:setup
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (authenticated)

### Todos
- `GET /api/todos` - Get user's todos (with filters)
- `GET /api/todos/:id` - Get specific todo
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `PATCH /api/todos/:id/toggle` - Toggle completion status

### Sync
- `POST /api/sync` - Sync todos between client and server
- `GET /api/sync/timestamp` - Get last sync timestamp
- `POST /api/sync/resolve-conflict` - Resolve sync conflicts

## Database Schema

### User
- `id` - UUID primary key
- `email` - Unique email address
- `name` - User's full name
- `password` - Hashed password
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Todo
- `id` - UUID primary key
- `title` - Todo title (required)
- `description` - Optional description
- `status` - pending, completed, archived
- `priority` - low, medium, high
- `dueDate` - Optional due date
- `tags` - Array of string tags
- `userId` - Foreign key to User
- `syncStatus` - synced, pending, conflict
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run db:setup` - Generate Prisma client and push schema
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:reset` - Reset database

## Project Structure

```
src/
├── server.ts              # Express server setup
├── routes/
│   ├── auth.ts           # Authentication routes
│   ├── todos.ts          # Todo CRUD routes
│   └── sync.ts           # Sync routes
├── middleware/
│   ├── auth.ts           # JWT authentication middleware
│   ├── validation.ts     # Request validation middleware
│   └── errorHandler.ts   # Error handling middleware
├── services/
│   ├── authService.ts    # Authentication business logic
│   ├── todoService.ts    # Todo business logic
│   └── syncService.ts    # Sync business logic
├── utils/
│   ├── db.ts             # Prisma client setup
│   └── websocket.ts      # WebSocket server setup
├── types/
│   └── shared.ts         # Shared type definitions
└── prisma/
    └── schema.prisma     # Database schema
```

## Environment Variables

Required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - JWT token expiration (default: 7d)
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS