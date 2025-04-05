# File Uploader Backend API

NestJS-based backend for the File Uploader & Management System.

## Features

- **RESTful API**: Comprehensive endpoints for file and user management
- **Authentication**: JWT-based auth with role-based access control
- **File Processing**: Upload, store, and process various file types
- **Database Integration**: PostgreSQL with Prisma ORM
- **Real-time Events**: WebSockets for instant notifications
- **Logging**: System activity tracking for monitoring and debugging
- **Security**: Input validation, error handling, and protection against common attacks

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **WebSockets**: Socket.io
- **File Processing**: Custom pipelines for different file types

## API Endpoints

### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Files

- `GET /files` - Get all files (paginated)
- `GET /files/:id` - Get file by ID
- `POST /files/upload` - Upload new file
- `DELETE /files/:id` - Delete file

### Users

- `GET /users` - Get all users (Admin only)
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user (Admin only)
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user (Admin only)

### Notifications

- `GET /notifications` - Get user notifications
- `PATCH /notifications/:id` - Mark notification as read

### Logs

- `GET /logs` - Get system logs (Admin only)

## Project Structure

```
backend/
├── prisma/                   # Prisma schema and migrations
│   └── schema.prisma         # Database schema definition
├── src/                      # Source code
│   ├── main.ts               # Application entry point
│   ├── app.module.ts         # Main application module
│   ├── auth/                 # Authentication module
│   │   ├── dto/              # Data transfer objects
│   │   ├── guards/           # Authorization guards
│   │   └── strategies/       # JWT strategies
│   ├── file/                 # File handling module
│   │   ├── dto/              # File DTOs
│   │   ├── processors/       # File processing logic
│   │   └── file.service.ts   # File operations
│   ├── user/                 # User management module
│   ├── notification/         # Notification module
│   │   └── gateway/          # WebSocket gateway
│   ├── log/                  # Logging module
│   └── common/               # Shared utilities
│       ├── decorators/       # Custom decorators
│       ├── filters/          # Exception filters
│       ├── guards/           # Common guards
│       ├── interceptors/     # Request/response interceptors
│       └── utils/            # Utility functions
└── test/                     # End-to-end and unit tests
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- PostgreSQL database

### Installation

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file with the following variables:

   ```
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/fileuploader"

   # JWT
   JWT_SECRET="your-secret-key"
   JWT_EXPIRES_IN="7d"

   # Upload settings
   UPLOAD_DIR="./uploads"
   MAX_FILE_SIZE=15000000

   # Server
   PORT=3001
   ```

4. Run Prisma migrations:

   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run start:dev
   # or
   yarn start:dev
   ```

### Database Setup

1. Make sure PostgreSQL is running
2. Create a database named `fileuploader`
3. Run Prisma migrations to set up the schema:

   ```bash
   npx prisma migrate dev
   ```

4. (Optional) Seed the database with initial data:
   ```bash
   npm run seed
   # or
   yarn seed
   ```

## File Storage

Uploaded files are stored in the `./uploads` directory (configurable via environment variables). The application creates the following subdirectories:

- `./uploads/original` - Original uploaded files
- `./uploads/thumbnails` - Generated thumbnails (for images)

## Available Scripts

- `npm run start` - Start the production server
- `npm run start:dev` - Start the development server with hot-reload
- `npm run build` - Build the application
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run linting checks

## Authentication & Authorization

The backend uses JWT tokens for authentication:

1. User logs in with credentials
2. Server issues a JWT token
3. Client includes the token in the Authorization header
4. Server validates the token and extracts user data
5. Role-based authorization guards protect sensitive endpoints

## File Processing

When a file is uploaded, the following happens:

1. File is validated (size, type)
2. File is saved to disk
3. Background processing starts based on file type
4. For documents: text extraction
5. For images: thumbnail generation
6. Processing status updates via WebSockets
7. Notification is created when processing completes
