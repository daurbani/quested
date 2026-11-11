# Google OAuth setup — Quested beta

Status: Quested's Google button is implemented behind the public flag `NEXT_PUBLIC_ENABLE_GOOGLE_OAUTH=true`. Leave the flag unset or false until the provider is configured and real-browser sign-in has passed. Email sign-in continues to work.

## Owner: Google Cloud

1. Open https://console.cloud.google.com/auth/overview and choose or create a Cloud project for **Quested**.
2. Configure Google Auth Platform → Branding with the application name, support email, and contact email.
3. Choose **External** audience. If the application remains in *Testing*, add each invited beta tester as a Google test user. Otherwise, follow Google's publication requirements.
4. In Data Access choose only the identity scopes `openid`, `.../auth/userinfo.email`, `.../auth/userinfo.profile`. Do not request Drive/Gmail access.
5. In Clients, create an OAuth client ID with application type **Web application** named **Quested Web**.
6. Add Authorized JavaScript origin: `https://quested-quested1.vercel.app`.
7. Add Authorized redirect URI: `https://mdfhxtyydwhmhlfwdell.supabase.co/auth/v1/callback`. (Confirm the exact callback URL displayed in Supabase's Google provider settings.)
8. Securely store the Google **Client ID** and **Client Secret**. Do not put the secret in source code, Vercel public environment variables, or chat.

## Owner: Supabase

1. Open https://supabase.com/dashboard/project/mdfhxtyydwhmhlfwdell/auth/providers and select **Google**.
2. Enable the provider and enter the client ID and client secret in Supabase's secure Auth settings.
3. Check Auth → URL Configuration. Site URL should be `https://quested-quested1.vercel.app`; allow redirect `https://quested-quested1.vercel.app/auth/callback` (query parameters carry the return destination).
4. Do not remove email sign-in or edit any user completion rows.

## Once provider works

In Vercel project settings, set `NEXT_PUBLIC_ENABLE_GOOGLE_OAUTH=true` in Production (and optionally Preview for testing), then redeploy Quested. No Google client secret is needed in the Quested app or Vercel: Supabase hosts the Google OAuth client.

## Acceptance tests

- A fresh Google test account can sign in and land on `/welcome`.
- A signed-out visitor clicking Complete now on a discovery goes through Google and returns to that discovery without losing the pending visit.
- A previously registered Quested user signing in via the *same verified Google address* retains their discovery history. Verify account identity and linking; do not assume different addresses automatically merge.
- A returning Google user sees their previously saved visits.
- Email magic-link login continues to work.
- Only enable the public button once the above work end to end.

References:
- https://supabase.com/docs/guides/auth/social-sign-in/auth-google
- https://supabase.com/docs/guides/auth/auth-identity-linking
