# Whiteboard App

A production-ready, self-hosted collaborative whiteboard web application built with Next.js and Excalidraw.

## Tech Stack

- **Frontend**: Next.js 13 (App Router), React 18, TypeScript, Tailwind CSS
- **Whiteboard**: Excalidraw (MIT licensed, 100% free)
- **Authentication**: NextAuth.js v4 (Credentials provider)
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod
- **Theme**: next-themes with shadcn-style design system
- **Deployment**: Docker Compose

## Features

- User registration and authentication with email/password
- Dashboard to manage whiteboards
- Full-featured whiteboard editor powered by Excalidraw
- Automatic and manual save of board state to PostgreSQL
- Public sharing with read-only links
- Board ownership and access control
- Dark mode support
- Docker-based self-hosting

## Local Development Setup

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL

### Installation

```bash
# Navigate to the project
cd whiteboard-app

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Update DATABASE_URL in .env to point to your PostgreSQL instance

# Run database migrations
pnpm prisma migrate dev

# Start the development server
pnpm dev
```

The app will be available at `http://localhost:3000`.

## Docker Setup

### Build and Run

```bash
docker compose up --build
```

This starts:
- PostgreSQL database on port 5432
- Next.js app on port 3000

### Stop

```bash
docker compose down
```

### Stop and Remove Volumes

```bash
docker compose down -v
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/whiteboard?schema=public` |
| `NEXTAUTH_SECRET` | Secret for signing JWT tokens | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Base URL of the app | `http://localhost:3000` |

## Database Migration

```bash
# Create a new migration
pnpm prisma migrate dev --name <migration_name>

# Apply pending migrations
pnpm prisma migrate deploy

# Reset database (WARNING: deletes all data)
pnpm prisma migrate reset

# Open Prisma Studio (database GUI)
pnpm prisma studio
```

## Creating an Account

1. Navigate to `http://localhost:3000`
2. Click "Get started" or "Create free account"
3. Fill in name, email, and password
4. Click "Create account"
5. Sign in with your credentials

## Creating a Board

1. Sign in to your account
2. Go to the Dashboard
3. Click "New Board"
4. You will be redirected to the board editor

## How Sharing Works

1. On the board page, click "Share"
2. The board becomes publicly accessible via `/share/{publicId}`
3. Anyone with the link can view the board in read-only mode
4. Click "Unshare" to make the board private again
5. The share link will no longer work after unsharing

## License

This project uses **Excalidraw** which is MIT licensed - completely free for any use, commercial or personal. No license keys required.

## Known Limitations

- No real-time collaboration (single-user editing)
- No board versioning or history
- Assets (images) are stored inline in the state JSON
- No folder organization for boards
- No search functionality

## Future Improvements

- Real-time collaboration with WebSockets
- Board versioning and undo history
- Image asset upload to storage
- Board folders and tags
- Search and filter boards
- Custom board templates
- Role-based access control for shared boards
