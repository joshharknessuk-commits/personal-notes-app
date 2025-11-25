# Notes

A minimal daily notes app inspired by Japanese minimalism.

## Quick Start (Local)

```bash
# Install dependencies
pnpm install

# Push database schema
pnpm db:push

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

By default, uses a local SQLite file (`local.db`). Your notes stay on your machine.

## Deploy with Turso (Multi-device Access)

To access from phone/laptop/anywhere:

### 1. Create Turso Database

```bash
# Install Turso CLI
brew install tursodatabase/tap/turso  # or: curl -sSfL https://get.tur.so/install.sh | bash

# Sign up (uses GitHub)
turso auth signup

# Create database
turso db create notes-app

# Get credentials
turso db show notes-app --url
turso db tokens create notes-app
```

### 2. Add Credentials

Edit `.env.local`:

```bash
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token-here
```

### 3. Push Schema & Deploy

```bash
# Push schema to Turso
pnpm db:push

# Deploy to Vercel (free)
pnpm dlx vercel
```

Add the same environment variables in Vercel dashboard.

## Features

- Four single-line inputs: Build, Train, Study, Reflection
- Auto-saves on every keystroke
- One record per day
- SQLite database with Drizzle ORM
- Minimal design with generous whitespace

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- SQLite (local) or Turso (cloud)
- Drizzle ORM

## Cost

- Local: Free
- Turso: Free tier (9GB storage, 1B reads/month)
- Vercel: Free tier
