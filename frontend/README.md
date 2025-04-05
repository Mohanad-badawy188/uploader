# File Uploader Frontend

Next.js-based frontend for the File Uploader & Management System.

## Features

- **Responsive UI**: Modern interface that works on desktop and mobile
- **Dashboard Analytics**: Visual representation of upload statistics
- **File Management**: Upload, view, and manage files
- **Secure Authentication**: Cookie-based authentication with middleware protection
- **Role-Based Access**: Different views and permissions for users and admins
- **Real-time Updates**: Immediate notifications for file processing events

## Tech Stack

- **Framework**: Next.js 15 (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Shadcn UI
- **Data Fetching**: SWR
- **Charts**: Chart.js with React-Chartjs-2
- **Authentication**: Custom auth context with cookies

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/                 # Source code
│   ├── app/             # Next.js app directory
│   │   ├── login/       # Login page
│   │   ├── upload/      # File upload page
│   │   ├── files/       # File listing and individual file pages
│   │   ├── users/       # User management (admin only)
│   │   ├── logs/        # System logs (admin only)
│   │   └── page.tsx     # Dashboard/home page
│   ├── components/      # React components
│   │   ├── common/      # Shared UI components
│   │   ├── dashboard/   # Dashboard-specific components
│   │   ├── files/       # File-related components
│   │   ├── ui/          # Shadcn UI components
│   │   └── users/       # User management components
│   ├── context/         # React contexts
│   │   └── AuthContext.tsx  # Authentication state management
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── middlewares/     # Client-side middleware
│   │   ├── withAuthClient.tsx  # Auth protection for authenticated users
│   │   └── withGuestClient.tsx # Routing for unauthenticated users
│   ├── types/           # TypeScript type definitions
│   └── constants/       # Application constants
└── next.config.js       # Next.js configuration
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Backend API running

### Installation

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file with the following variables:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
# or
yarn build
```

Then start the production server:

```bash
npm run start
# or
yarn start
```

## Authentication Flow

- **Guest Users**: Can access login and public routes only
- **Authenticated Users**: Can access file upload and personal files
- **Admin Users**: Have access to all routes including logs and user management

## Auth Middleware Implementation

The application uses a custom client-side authentication middleware:

- `withAuthClient.tsx`: Protects routes that require authentication
- `withGuestClient.tsx`: Handles redirection for unauthenticated users

## Available Scripts

- `npm run dev`: Run the development server
- `npm run build`: Build the application for production
- `npm run start`: Start the production server
- `npm run lint`: Run linting checks

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
