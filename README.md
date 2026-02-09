# Spark

Video reference library for creative teams. Submit, tag, and organize
video content from YouTube, Instagram, and TikTok.

## Setup

1. Clone the repo
2. Install dependencies:
   ```
   pnpm install
   ```
3. Set up Supabase:
   - Create a project at https://supabase.com (free tier)
   - Run `supabase/schema.sql` in the SQL editor
   - Copy project URL and anon key
4. Configure environment:
   ```
   cp .env.example .env.local
   # Fill in your Supabase credentials
   ```
5. Start the dev server:
   ```
   pnpm dev
   ```

Open http://localhost:3000

## Stack

- **Next.js 16** (App Router) — unified API routes and React
- **TypeScript** — strict mode throughout
- **Tailwind + shadcn/ui** — accessible, consistent design system
- **Supabase Postgres** — persistent storage, real relational DB

## Database Design

Three tables with a normalized schema:

- **assets** — stores URL (original + normalized), platform, timestamp
- **tags** — preset tag definitions, seeded on setup
- **asset_tags** — junction table linking assets to tags

A **view** (assets_with_tags) joins all three to avoid N+1 queries.
Indexes cover the two primary access patterns: duplicate lookup by
normalized_url and grid display ordered by created_at.

URL normalization strips tracking params and trailing slashes so
"youtube.com/watch?v=abc&utm_source=twitter" and
"youtube.com/watch?v=abc" resolve to the same asset.

## Trade-offs

- No video thumbnails or embeds (would integrate oEmbed APIs)
- No RLS policies (would add per-user row-level security with Supabase Auth)
- Tag creation is seed-only (would support user-defined tags)
- Asset creation uses sequential queries instead of a DB transaction
  (would use a Postgres function for atomicity in production)

## Next Steps

- oEmbed integration for video thumbnails and titles
- Supabase Auth + RLS for per-user libraries
- Full-text search across URLs and tags
- Cursor-based pagination for large libraries
- Drag-and-drop tag reordering
- E2E tests with Playwright

## Tools

Built with assistance from Claude AI.
