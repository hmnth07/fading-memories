# Fading Memories — The Full Story

## What Is This?

Fading Memories is a web app where users describe memories they're losing — not with photos, but with words. You answer six gentle questions about a memory (who was there, where you were, what was happening, the atmosphere, small details, and how it made you feel), and the app transforms your words into anime-style artwork using AI. Optionally, you can turn that image into an animated "living photo" GIF with particle effects like sakura petals or fireflies.

**Tagline**: "Before they fade completely, bring your memories back to life."

## Why This Exists

Most AI image generators ask you to be a prompt engineer. "masterpiece, best quality, 1girl, detailed background..." — nobody talks like that. This app flips it: you talk like a human remembering something, and the app does the translation behind the scenes. The emotional angle (fading memories, nostalgia, preservation) gives it a reason to exist beyond "yet another AI image generator."

## The Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 15 (App Router) | Server-side API route for Replicate, static landing page, clean routing |
| Language | TypeScript | Type safety across the form wizard, API, and library code |
| Styling | Tailwind CSS v4 + shadcn/ui | Rapid UI with consistent design tokens. shadcn gives us real components (Button, Card, Progress) without a heavy library |
| AI Model | Replicate + Flux Schnell | Fast image generation model. Originally planned for Animagine XL 3.1 but it was removed from Replicate |
| Database | Supabase | Only used for email signups (waitlist). Minimal footprint |
| GIF Engine | modern-gif + Canvas API | Client-side GIF encoding with Ken Burns zoom and particle overlays |
| Icons | Lucide React | Clean, consistent icon set |

## How the Codebase Connects

```
User lands on / (landing page)
  → Hero, HowItWorks, Testimonials, EmailSignup, Footer
  → CTA button → /create

User navigates to /create (client component)
  → MemoryForm (6-step wizard with progress bar)
  → Each step: MemoryStepComponent (question + textarea)
  → "Bring This Memory to Life" button

Client POSTs to /api/generate
  → Validates all 6 fields
  → composePrompt() converts human words → stylized prompt
  → Replicate API generates image via Flux Schnell
  → Returns { imageUrl, prompt }

Client shows ResultView
  → Display image, Download button
  → "Make it a Living Photo" → particle selector → GIF encoder
  → Canvas draws Ken Burns zoom + particles → modern-gif encodes → downloadable GIF
```

## The Prompt Composition Strategy

This is the most interesting engineering decision. Animagine XL 3.1 doesn't understand natural language well — it expects Danbooru-style tags like `elderly woman, kitchen, cooking, summer, warm lighting, nostalgic`.

The `prompt-composer.ts` file is essentially a translator:

1. **Quality prefix**: Always prepend `masterpiece, best quality, very aesthetic, absurdres`
2. **Keyword extraction**: For each of the 6 fields, we have lookup tables that map human words to Danbooru tags. "My grandmother" → `elderly woman, grandmother`. "Safe and warm" → `warm lighting, cozy, gentle, comfort`.
3. **Passthrough fallback**: If no keywords match, we pass the user's text through as-is (the model handles it okay for simple phrases)
4. **Details**: Split by commas/periods, take up to 5 short phrases
5. **Style suffix**: Always append `nostalgic, cinematic lighting, depth of field, detailed background`
6. **Deduplication**: Remove duplicate tags while preserving order

This means a user who writes "My grandmother and I, in her small kitchen, she was teaching me to cook, warm summer afternoon, flour on her apron and steam rising, I felt safe" gets:

`masterpiece, best quality, very aesthetic, absurdres, elderly woman, grandmother, kitchen, indoors, cooking, kitchen activity, summer, bright sunlight, warm, afternoon, golden hour, flour on her apron, steam rising, warm lighting, cozy, gentle, comfort, nostalgic, cinematic lighting, depth of field, detailed background`

## The GIF Animation Engine

The living photo feature works entirely client-side:

1. Load the generated image onto a Canvas (512x512 for reasonable GIF size)
2. For 48 frames (4 seconds at 12fps):
   - Apply Ken Burns effect: gradual zoom from 1.0x to 1.15x with slow pan
   - Draw particle overlay (sakura/dust/rain/snow/firefly) with per-frame physics
   - Capture frame data from canvas
3. Feed all frames to `modern-gif`'s Encoder which handles LZW compression and GIF format
4. Return as a downloadable Blob

The particle system is simple but effective — each particle type has its own size, speed, drawing method (ellipses for sakura, dots for dust/snow, lines for rain, radial gradients for fireflies), and movement pattern (sine waves for drifting, linear for rain).

## Rate Limiting

No backend rate limiting needed for the MVP. We use localStorage:
- Store `{ count: number, date: "YYYY-MM-DD" }`
- Reset count each new day
- Max 5 generations per day
- Yes, users can clear localStorage to bypass this. That's fine for an MVP.

## Architecture Decisions & Why

**Why Next.js instead of plain React?** The API route. We need a server-side endpoint to call Replicate (the API token must stay server-side). Next.js gives us that without deploying a separate backend.

**Why Animagine XL 3.1?** It's specifically trained on anime aesthetics and understands Danbooru tags well. Regular Stable Diffusion would work but wouldn't give the distinctive anime style that makes the output feel artistic rather than realistic.

**Why localStorage for rate limiting?** Proper rate limiting needs a database (IP tracking, user accounts). For an MVP where the product is free, client-side limits are "good enough" — the Replicate API token is the real cost control, and a user determined to bypass localStorage is a user engaged enough to convert later.

**Why modern-gif over gifshot/gif.js?** It's actively maintained, TypeScript-first, and has a clean Encoder API. Most alternatives are abandoned or have awkward APIs.

**Why lazy Supabase initialization?** The Supabase client throws if `supabaseUrl` is empty. During `next build`, env vars may not be set, so eagerly creating the client crashes the build. Lazy init (`getSupabase()`) defers creation to runtime when env vars are available.

## File-by-File Breakdown

```
src/
├── app/
│   ├── layout.tsx          — Root layout: Inter font, Navbar, metadata
│   ├── globals.css         — Tailwind v4 theme (rose/amber/sky gradients), custom animations
│   ├── page.tsx            — Landing page: composes 5 sections
│   ├── create/
│   │   ├── layout.tsx      — Just metadata for the /create route
│   │   └── page.tsx        — Client component: state machine (form → generating → result)
│   └── api/generate/
│       └── route.ts        — POST handler: validate → compose prompt → Replicate → return URL
├── components/
│   ├── ui/                 — shadcn/ui primitives (button, card, input, textarea, progress, label)
│   ├── landing/
│   │   ├── hero.tsx        — Animated gradient hero with floating orbs
│   │   ├── how-it-works.tsx — 3-step explainer (Describe → Generate → Download)
│   │   ├── testimonials.tsx — Social proof cards
│   │   ├── email-signup.tsx — Supabase email capture form
│   │   └── footer.tsx      — Dark footer with tagline
│   ├── create/
│   │   ├── memory-form.tsx  — 6-step wizard with progress bar and navigation
│   │   ├── memory-step.tsx  — Individual step: question + hint + textarea
│   │   ├── generating-state.tsx — Pulsing orb animation with rotating messages
│   │   └── result-view.tsx  — Image display + download + GIF creation flow
│   └── shared/
│       └── navbar.tsx       — Sticky nav with scroll-based transparency
├── lib/
│   ├── supabase.ts         — Lazy Supabase client
│   ├── replicate.ts        — Replicate client + model config + negative prompt
│   ├── prompt-composer.ts  — Memory answers → Danbooru tags translator
│   ├── rate-limit.ts       — localStorage 5/day counter
│   ├── gif-encoder.ts      — Canvas animation + modern-gif encoding
│   └── utils.ts            — cn() helper from shadcn
└── types/
    └── memory.ts           — MemoryFormData, GenerationResult, step definitions
```

## Lessons Learned

**Supabase createClient is strict.** It throws synchronously if the URL is empty — not a network error, a constructor error. This means you can't create it at module scope if env vars might be missing (like during builds). Lazy initialization is the pattern.

**Replicate output types are tricky.** The SDK returns `FileOutput` objects that extend `String`. You can't type them as `string` directly — `String(output[0])` is the safe way to extract the URL.

**Tailwind v4 CSS-first config.** No more `tailwind.config.ts` for theme colors. In v4, you define theme values inside `@theme inline {}` in your CSS file. Custom colors, animations, and font families all go there.

**GIF encoding is CPU-intensive.** 48 frames of canvas manipulation + LZW compression takes noticeable time in the browser. The 512px size (down from the 1024px source image) is a deliberate tradeoff for reasonable encoding time. Going lower would look bad; going higher would take too long.

**Danbooru tag quality matters enormously.** The same model produces wildly different results depending on whether you prefix `masterpiece, best quality` and whether you include the negative prompt. The negative prompt (`nsfw, lowres, bad, text, error, worst quality...`) is as important as the positive one.

## What's Next (If This MVP Works)

- User accounts (Supabase Auth) to save memory galleries
- Sharing: public URLs for generated memories
- Better prompt composition: use an LLM to translate instead of keyword lookup tables
- More animation effects: parallax layers, light leak overlays
- Mobile app wrapper (PWA or React Native)
- Monetization: premium effects, higher resolution, more daily generations
