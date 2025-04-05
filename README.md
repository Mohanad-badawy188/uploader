# File Uploader & Management System

A modern, full-stack application for secure file uploading, processing, and management with role-based access control.

## Features

- **User Authentication**: Secure login/signup with role-based access (Admin/User)
- **File Management**: Upload, view, process and manage files with status tracking
- **Dashboard**: Visual analytics of upload trends and success rates
- **Admin Controls**: User management and system logs for administrators
- **Real-time Notifications**: Get notified when file processing completes
- **Activity Tracking**: Monitor user actions across the platform

## Tech Stack

### Frontend

- Next.js 14 (React)
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- SWR for data fetching
- Chart.js for visualizations

### Backend

- NestJS (Node.js)
- Prisma ORM
- PostgreSQL database
- JWT Authentication
- WebSockets for real-time updates

## Project Structure

```
/
├── frontend/          # Next.js frontend application
├── backend/           # NestJS backend API and services
├── prisma/            # Database schema and migrations
└── README.md          # This file
```

## Getting Started

See the dedicated README files in each directory for detailed setup instructions:

- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Modern web browser

## Quick Start

1. Clone the repository
2. Set up the backend (see backend README)
3. Set up the frontend (see frontend README)
4. Run both services

## License

[MIT License](LICENSE)
