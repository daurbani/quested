# Milestone 1 — Application Foundation

This branch adds a responsive Next.js + TypeScript + Tailwind application to the existing Quested repository. The original product documentation and CSV catalog remain unchanged.

## Setup

Install Node.js 22 or later, then run:

```bash
npm install
npm run validate:catalog
npm run dev
```

Visit http://localhost:3000. For production, run `npm run build`.

## Deployment

Import `daurbani/quested` into Vercel after merging this branch to main. Vercel should detect Next.js. No environment variables are required for this first milestone.

## Scope

The Home and five collection detail pages work with JSON collection definitions. Individual discoveries are placeholders, pending catalog curation in Milestone 2. Authentication, completion tracking, Supabase integration, and offline synchronization are not yet implemented.

### Catalog transition

The existing `data/*.csv` files are preserved. New app data is stored separately as `data/*.json`. Review and migrate verified catalog records before replacing the JSON placeholders.
