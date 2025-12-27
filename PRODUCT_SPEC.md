# Product Specification Document: Mafilu

**Version:** 1.0
**Status:** Draft
**Last Updated:** December 27, 2025

---

## 1. Product Overview

### 1.1 Vision
Mafilu aims to be the premier "Indie-Netflix," a curated streaming platform specifically designed to empower amateur and independent filmmakers. It bridges the gap between chaotic video-sharing sites and exclusive major streaming services by providing a premium, art-house aesthetic environment where quality content is prioritized, evaluated, and monetized directly.

### 1.2 Mission
To democratize tracking and monetization for independent cinema while offering viewers a sanctuary of high-quality, curated storytelling.

### 1.3 Target Audience
*   **Viewers:** Cinephiles, indie film enthusiasts, supporters of independent art, users looking for unique content not found on mainstream platforms.
*   **Producers (Creators):** Independent filmmakers, film students, short film directors, amateur production teams seeking distribution and revenue.

---

## 2. User Roles & Permissions

### 2.1 Viewer (Standard User)
*   **Access:** Browse public library, watch trailers, view limited free content.
*   **Actions:** Sign up, subscribe (Free/Basic/Premium), Create Watchlist, Like/Rate movies, Share content, Manage Profile.
*   **Restriction:** Cannot upload content or access producer analytics.

### 2.2 Producer (Creator)
*   **Access:** All Viewer access + "Producer Studio".
*   **Actions:** Upload movies, Manage content metadata, View Analytics (Real-time views, Revenue, Demographics), Manage Earnings & Payouts, Customize Producer Profile.
*   **Requirement:** May require specific verification or subscription tier (Producer Pro).

### 2.3 Administrator
*   **Access:** Full system access + Admin Panel.
*   **Actions:** Content Moderation (Approve/Reject submissions), User Management (Ban/Suspend), Platform-wide Analytics, Payout Management, System Configuration.

---

## 3. Core Features & Functionality

### 3.1 Authentication & Onboarding
*   **Sign Up/Login:** Email/Password via Supabase Auth.
*   **Onboarding:** Role selection (Viewer/Producer), Genre preferences.
*   **Profile Management:** Avatar, Display Name, Bio, Subscription management.

### 3.2 Viewing Experience (The "Cinema" Feel)
*   **Homepage:** Curated hero slider, genre-based rows (Horizontal scrolling), "Continue Watching".
*   **Discover/Browse:** Advanced filtering (Genre, Year, Popularity), Search with instant results.
*   **Watch Page:**
    *   Full-width cinematic video player.
    *   Adaptive streaming (HLS) via Bunny.net.
    *   Movie Metadata: Title, Cast, Producer, Year, Duration, Quality (4K/HD).
    *   Social Actions: Like, Add to Watchlist, Share.
    *   "More Like This" recommendation grid.

### 3.3 Producer Studio (Dashboard)
*   **Overview:** Summary cards (Total Views, Monthly Revenue, Active Movies).
*   **Content Management:**
    *   Upload Wizard: Drag & drop video, cover art, metadata entry.
    *   Status Tracking: Draft, Pending Review, Published, Rejected.
*   **Analytics:** Interactive charts showing viewership trends over time.
*   **Earnings:** Projected revenue display, Payout history, Bank account configuration (Stripe Connect/Iyzico).

### 3.4 Monetization (Subscription Model)
*   **Tiers:**
    *   **Free:** Ad-supported (future), limited catalog, 720p.
    *   **Basic:** Full catalog, 1080p, 1 device.
    *   **Premium:** 4K UHD, 4 devices, Offline downloads (future), Early access.
*   **Producer Revenue Share:** Calculated based on total watch time share of the platform's subscription revenue pool (e.g., 70% to creators).

---

## 4. Technical Architecture

### 4.1 Tech Stack
*   **Frontend Check:** `Next.js 14+` (App Router), `React 19`, `TypeScript`.
*   **Styling:** `Tailwind CSS 4`, `Framer Motion` (Animations), `Lucide React` (Icons).
*   **Backend:** `Supabase` (BaaS - Auth, Database, Edge Functions, Realtime).
*   **Video Infrastructure:** `Bunny.net` Stream (Encoding, Storage, Global CDN).
*   **Payments:** `Stripe` (Global) or `Iyzico` (TR market specific).
*   **Deployment:** `Vercel` (Frontend), `Docker` (Containerized services if needed).

### 4.2 Database Schema (High-Level)
*   `profiles`: Extends auth.users with roles, avatars.
*   `movies`: Stores metadata, bunny_video_id, approval_status, producer_id.
*   `watchlists`: Junction table (user_id, movie_id).
*   `views`: Tracks viewing sessions for analytics/payouts.
*   `subscriptions`: Tracks Stripe/Payment status.
*   `producer_payouts`: Records financial transactions.

### 4.3 Integrations
*   **Bunny.net API:** Video uploads, Tus protocol, Webhook for encoding status.
*   **Stripe API:** Subscription lifecycles, Webhooks for payment success/fail.

---

## 5. Design System: "Deep Cinematic Night"

### 5.1 Principles
*   **Immersive:** Dark backgrounds to make content pop.
*   **Premium:** Glassmorphism, subtle glows, high-quality typography.
*   **Fluid:** Smooth transitions between pages and states.

### 5.2 Color Palette
*   **Backgrounds:** Deep Purple-Blacks (`#050208`, `#120621`, `#150A24`).
*   **Primary Accent:** Electric Purple (`#7C3AED`, `#8B5CF6`).
*   **Secondary Accent:** Hot Pink / Magenta (for badges/CTAs).
*   **Text:** Off-white (`#F5F3FF`) to reduce eye strain, Muted Lavender (`#A197B0`) for secondary text.

### 5.3 Typography
*   **Headlines:** `Cormorant Garamond` (Serif) - Artistic, cinematic feel.
*   **Body/UI:** `Outfit` (Sans-serif) - Clean, modern, legible.

---

## 6. Functional Requirements

### 6.1 Content Upload & Processing
*   System MUST support resumable uploads (TUS).
*   System MUST automatically transcode video into 1080p/720p/480p playlists.
*   System MUST generate or allow upload of a thumbnail and poster image.
*   System MUST hold new uploads in "Pending" state until Admin approval.

### 6.2 Streaming
*   Player MUST support adaptive bitrate streaming.
*   Player MUST save playback progress (resume capability).
*   Player MUST prevent unauthorized downloads (DRM/Signed URLs - optional for v1).

### 6.3 Search & discovery
*   Search MUST index titles, descriptions, and tags.
*   Results MUST update in real-time or near real-time.

---

## 7. Future Roadmap

### Phase 1: MVP (Current)
*   [x] Basic Auth & Profiles.
*   [x] Homepage & Browse implementation.
*   [x] Watch Page (Cinematic Redesign).
*   [x] Basic Producer Dashboard UI.
*   [ ] Real Video Data connection (remove mocks).

### Phase 2: Engagement & Social
*   [ ] User Reviews & Star Ratings.
*   [ ] "Follow Producer" functionality.
*   [ ] Interactive notifications.
*   [ ] Advanced Watch history.

### Phase 3: Advanced Monetization
*   [ ] Automated Payout Calculations.
*   [ ] Producer Pro Tier features.
*   [ ] Gift Subscriptions.

### Phase 4: Expansion
*   [ ] Mobile Applications (PWA first, then Native).
*   [ ] TV Apps (Tizen, WebOS, AppleTV).
*   [ ] AI-driven Recommendation Engine.
*   [ ] Multi-language support (i18n).

---

## 8. Non-Functional Requirements

### 8.1 Performance
*   **Lighthouse Score:** Target > 90 on Performance, Accessibility, SEO.
*   **Load Time:** First Contentful Paint < 1.5s.
*   **Video Start Time:** < 2s buffer time.

### 8.2 Security
*   **Row Level Security (RLS):** Strictly enforced in Supabase. Users can only edit their own profile. Producers can only edit their own movies.
*   **API Security:** All backend endpoints protected by Auth Middleware.
*   **Content Protection:** Signed URLs for video streaming to prevent hotlinking.

### 8.3 SEO
*   Dynamic `sitemap.xml` generation.
*   Open Graph tags (og:image, og:title) for every movie page.
*   Structured Data (Schema.org) for Movies and Videos.
