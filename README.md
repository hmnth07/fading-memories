# Fading Memories

> Before they fade completely, bring your memories back to life.

Describe fading memories in words and transform them into beautiful artwork. Answer six gentle questions about your memory, and AI brings it to life as an image — with optional animated "living photo" GIFs.

## Features

- **Guided Memory Capture**: 6-step wizard asks about who, where, what, atmosphere, details, and feeling
- **AI Image Generation**: Transforms your words into artwork via Flux Schnell
- **Living Photos**: Animated GIFs with Ken Burns effect + particle overlays (sakura, dust, rain, snow, fireflies)
- **Rate Limiting**: 5 free generations per day (localStorage-based)
- **Email Waitlist**: Supabase-powered email signup

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **AI**: Replicate (Flux Schnell model)
- **Database**: Supabase (email signups only)
- **GIF Encoding**: modern-gif + Canvas API

## Setup

1. **Clone and install**:
   ```bash
   git clone https://github.com/yourusername/fading-memories.git
   cd fading-memories
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```

   Fill in:
   - `REPLICATE_API_TOKEN` — from [replicate.com](https://replicate.com)
   - `NEXT_PUBLIC_SUPABASE_URL` — from your Supabase project
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from your Supabase project

3. **Set up Supabase** (optional, for email signups):

   Run this SQL in your Supabase SQL Editor:
   ```sql
   CREATE TABLE IF NOT EXISTS email_signups (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     email text UNIQUE NOT NULL,
     created_at timestamptz DEFAULT now(),
     metadata jsonb DEFAULT '{}'::jsonb
   );

   ALTER TABLE email_signups ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Anyone can insert email signups"
     ON email_signups FOR INSERT TO anon WITH CHECK (true);
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── create/page.tsx       # Memory creation wizard
│   └── api/generate/route.ts # Image generation endpoint
├── components/
│   ├── landing/              # Hero, HowItWorks, Testimonials, etc.
│   ├── create/               # MemoryForm, GeneratingState, ResultView
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── replicate.ts          # Replicate client config
│   ├── prompt-composer.ts    # Converts memory → image prompt
│   ├── gif-encoder.ts        # Canvas animation + GIF export
│   └── rate-limit.ts         # localStorage rate limiting
└── types/
    └── memory.ts             # TypeScript interfaces
```

## Deployment

Deploy to Vercel:

```bash
vercel
```

Set environment variables in Vercel dashboard.

## License

MIT
