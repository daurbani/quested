# Milestone 2 — Starter Discovery Catalog & UI polish

## Catalog source and review status
The pre-existing `data/collections.csv`, `data/discoveries.csv`, and `data/milestones.csv` in the GitHub repository are **empty placeholders**, not usable datasets. They remain unchanged.

This iteration seeds an **editorial starter catalog**, rather than claiming to convert existing CSV content. It follows the agreed five MVP collections and adds 57 proposed place entries, one per collection membership. Catalog descriptions are short, non-navigational and provisional. Detailed coordinates, trail mileage, elevation, permit requirements, seasonal access, and difficulty are deliberately omitted pending review against authoritative sources.

The Oregon Volcanoes collection contains Mount Washington, Three Fingered Jack, and Mount Bailey. Cowhorn Mountain is excluded.

## Deliverables
- 5 collection pages with actual discoveries
- 57 discovery detail pages at `/discoveries/[slug]`
- Client-side search within each collection
- Home and collection card visual polish, discovery counts, and readable hero call-to-action
- Updated catalog validation

## Follow-ups
1. Confirm names, membership and descriptions; deduplicate or expand catalog as needed.
2. Verify official destination conditions and gather licensed photography.
3. Establish canonical coordinates and access information for GPS verification.
4. Supabase authentication, Quick Complete, historical visits, collection progress are later milestones.

## Commands
```bash
npm install
npm run validate:catalog
npm run build
```
