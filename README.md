# Mafilu - Independent Cinema Distribution Platform

<p align="center">
  <strong>A curated "Indie-Netflix" for amateur filmmakers with built-in evaluation and monetization.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#docker">Docker</a> •
  <a href="#project-structure">Structure</a>
</p>

---

## 🎬 Vision

Mafilu is a modern, curated streaming platform designed specifically for amateur filmmakers and independent cinema enthusiasts. Unlike chaotic video-sharing sites, Mafilu focuses on **quality**, **curation**, and **direct monetization** for creators.

## ✨ Features

### For Producers (Filmmakers)
- 📤 Direct video upload with resumable uploads (TUS protocol)
- 📊 Analytics dashboard with view counts and revenue tracking
- 💰 Automated monthly payouts based on viewership
- 🎬 Draft management and submission workflow

### For Viewers
- 🎥 Cinematic UI with smooth streaming experience
- 📱 Subscription-based access to curated content
- ⭐ Rating and review system
- 📋 Personal watchlist

### For Admins
- ✅ Review queue with approval/rejection workflow
- 🔧 Technical QC (Quality Control) tools
- 📈 Platform analytics and payout management

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS 4 |
| **Backend** | Supabase (PostgreSQL, Auth, Edge Functions) |
| **Video** | Bunny.net Stream API & Global CDN |
| **Payments** | Stripe / Iyzico Integration |
| **Cache** | Redis |
| **Container** | Docker with multi-stage builds |
| **CI/CD** | GitHub Actions |

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Supabase account
- Bunny.net account
- Stripe account

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/mafilu.git
   cd mafilu
   ```

2. **Copy environment variables**
   ```bash
   cp .env.example .env.local
   ```

3. **Configure your `.env.local`** with your API keys:
   - Supabase URL and keys
   - Bunny.net API key and library ID
   - Stripe publishable and secret keys

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open** [http://localhost:3000](http://localhost:3000)

## 🐳 Docker

### Development Mode

```bash
# Start with hot reload
docker compose --profile development up

# Or build fresh
docker compose --profile development up --build
```

### Production Mode

```bash
# Build and run production containers
docker compose --profile production up --build -d

# View logs
docker compose logs -f app
```

### Available Services

| Service | Port | Profile | Description |
|---------|------|---------|-------------|
| `app` | 3000 | production | Production Next.js app |
| `app-dev` | 3000 | development | Development with hot reload |
| `redis` | 6379 | all | Redis cache |
| `ai-service` | 8000 | ai | GPU-powered AI analysis |

## 📁 Project Structure

```
mafilu/
├── .github/workflows/     # CI/CD pipelines
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API routes
│   │   ├── (auth)/       # Auth pages
│   │   ├── (producer)/   # Producer dashboard
│   │   ├── (viewer)/     # Viewer pages
│   │   └── (admin)/      # Admin portal
│   ├── components/       # React components
│   ├── lib/              # Utility libraries
│   │   ├── supabase/     # Supabase client
│   │   ├── bunny/        # Bunny.net integration
│   │   ├── stripe/       # Payment processing
│   │   └── redis/        # Cache utilities
│   └── types/            # TypeScript definitions
├── supabase/
│   └── migrations/       # Database schema
├── services/
│   └── ai-analyzer/      # Future AI service
├── Dockerfile            # Production build
├── Dockerfile.dev        # Development build
└── docker-compose.yml    # Container orchestration
```

## 📊 Database Schema

The database includes the following main tables:

- **profiles** - User accounts with role-based access
- **movies** - Film submissions with Bunny.net integration
- **subscriptions** - User subscription management
- **producer_payouts** - Automated payout tracking
- **movie_reviews** - Rating and review system
- **movie_views** - Analytics and viewership tracking

See [`supabase/migrations/001_create_schema.sql`](supabase/migrations/001_create_schema.sql) for the complete schema.

## 🔐 Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `BUNNY_API_KEY` | Bunny.net API key |
| `BUNNY_LIBRARY_ID` | Bunny.net Stream library ID |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |

## 🧪 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run dev:turbo` | Start with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type checking |

## 📄 License

Custom Startup License - All Rights Reserved.

---

<p align="center">
  Made with ❤️ for independent filmmakers
</p>
