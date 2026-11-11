# Milestone 3 — Accounts, completion, and progress

- Public browsing remains available even before Supabase is configured.
- Google/Apple sign-in uses Supabase OAuth and a server-side PKCE callback.
- A user can record one completion per discovery, edit the completion or optional historical date, or remove it.
- Historical completions count in every collection containing the discovery.
- Row Level Security restricts all completion operations to the signed-in owner.
- My Quested displays completed discoveries and per-collection progress.

## Setup checklist
1. Create/select a Supabase project; run the SQL in `supabase/migrations/20261111050000_user_discoveries.sql`.
2. Configure Google and Apple OAuth credentials in Supabase's provider settings.
3. Set Supabase Auth Site URL to `https://quested-quested1.vercel.app` and allow `https://quested-quested1.vercel.app/auth/callback`. Add preview callback URLs when testing previews.
4. Add browser-safe `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to Vercel's environment variables. Never use a service-role key.
5. Test first login, completion create/update/delete, cross-collection progress, and RLS separation between two accounts.

Not included: GPS verification, following, milestone awards, offline storage.
