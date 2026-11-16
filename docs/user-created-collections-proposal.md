# User-created and shared collections — proposal (not yet implemented)

## Product intent
Enable someone signed into Quested to curate an adventure collection, share a public view with others, and let each recipient independently track their own completion of the same destinations. This is about shared inspiration and collections, **not** a social feed, route planner, or group challenge scoreboard.

## First release: Create → Share → Save
1. A signed-in user creates a collection with a title, description, activity, and optional cover image from the licensed catalog library.
2. They add **existing published Quested discoveries** by searching the catalog; reorder entries and save as draft.
3. They choose **Private**, **Unlisted**, or (later, after moderation) **Public** visibility.
4. An unlisted collection gets a stable share URL. Recipients can open without signing in; signing in is required to save to "My Collections" or track visits.
5. **Save collection** subscribes to the source collection but does not copy or reset anyone's user_discoveries records. Each viewer's progress is independent.
6. Owner can edit the source. Recipients see source updates and can opt out by removing the saved collection. A future **Duplicate / Remix** action can create a new owned snapshot.

## Data model sketch
- `user_collections`: id (uuid), owner_id (auth.users), slug or share_id (unique random), title, description, category, visibility (`private|unlisted|public`), status (`draft|published`), created_at, updated_at.
- `user_collection_items`: collection_id, discovery_slug, sort_order, primary key(collection_id,discovery_slug). Validate discovery_slug against published catalog at application layer; plan for future catalog-backed discovery IDs.
- `user_collection_saves`: collection_id, user_id, created_at, primary key(collection_id,user_id).
- No copied completion state. Existing `user_discoveries(user_id,discovery_slug)` remains the source of truth for individual progress.

## Authorization and safety
- Enable RLS on all tables; reads: owner always, other authenticated/anonymous viewers only for published unlisted/public collections; no private leakage through share endpoints.
- Insert/update/delete: authenticated owner only; save/remove: authenticated recipient only. Enforce ownership on both SELECT and UPDATE/DELETE.
- Don't trust arbitrary user_id, collection_id, or authorization flags supplied by the browser.
- Limit creation/item counts and sanitize/escape descriptions; add report and takedown workflow before public discovery.
- Use opaque random share IDs; no guessable private share links. Unlisted = anyone possessing the link, not confidential/private.
- A shared collection is a curated list, *not* proof of trail conditions or navigation instructions. Require review before new user-submitted destinations are admitted to the global catalog.

## Scope boundary and product questions
- **MVP:** existing discoveries only, creator ownership, unlisted links, save-to-profile, independent progress, safe removal.
- **Later:** public discovery of user-curated collections, follow creators, remix, collaboration/invites, comments and leaderboards.
- Design questions: allow routes not already in the catalog? co-editors vs followers? how many public collections per user? custom cover photo licensing? creator name / optional public profile?
- Recommend no co-editing or user-uploaded GPX until moderation, data quality, and access controls are established.

## Acceptance tests
- Owner creates draft (invisible to unrelated users) and unlisted collection.
- Signed-out recipient opens shared URL and sees the destination list without seeing personal progress.
- Signed-in recipient saves collection, completes a discovery, and sees personal progress update without affecting creator.
- Owner edits membership; recipient sees updated list and unchanged completion history.
- Different users cannot edit, delete, or enumerate one another's private collections.
