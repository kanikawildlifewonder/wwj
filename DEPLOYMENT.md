# Deployment Guide for WWJ

This app is a Next.js 16 storefront deployed well on Vercel with Clerk, Supabase, and Prisma.

## Required Environment Variables

Add these in Vercel before deploying:

| Name | Purpose |
|------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk frontend auth |
| `CLERK_SECRET_KEY` | Clerk server auth |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Usually `/login` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Usually `/register` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Usually `/account` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Usually `/account` |
| `DATABASE_URL` | Supabase pooled runtime URL |
| `DIRECT_URL` | Supabase direct build/migration URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser-safe Supabase key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only Supabase admin key |
| `NEXT_PUBLIC_SITE_URL` | Production site URL |

Optional:

| Name | Purpose |
|------|---------|
| `PG_POOL_MAX` | Override app pool size |
| `RAZORPAY_KEY_ID` | Razorpay backend |
| `RAZORPAY_KEY_SECRET` | Razorpay backend |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay frontend |
| `RESEND_API_KEY` | Email sending |

## Important Prisma / Supabase Setup

WWJ now uses two database URLs intentionally:

- `DATABASE_URL` is the pooled Supabase connection used by the running app.
- `DIRECT_URL` is the direct Postgres connection used during build-time Prisma access.

This matters because `next build` can fan out across many workers, and using the pooled transaction URL there can cause noisy Prisma read failures during prerender. The app’s Prisma setup automatically prefers `DIRECT_URL` during build and falls back to `DATABASE_URL` at runtime.

## Deploy to Vercel

1. Import the repo into Vercel.
2. Add the environment variables above.
3. Run a deploy.
4. Confirm the build logs show a clean `next build`.
5. Verify `/`, `/shop`, `/products/[id]`, `/admin`, and `/login`.

## Post-Deploy Checks

- Confirm Clerk sign-in opens correctly.
- Confirm homepage content loads.
- Confirm featured products render on the homepage.
- Confirm `/shop` and product pages read live data.
- Confirm product image uploads work if Supabase Storage is configured.

## Notes

- If Prisma build-time reads fail again, check that `DIRECT_URL` is present in the deployment environment.
- If runtime queries fail, validate `DATABASE_URL` first.
- If storage uploads fail, check the Supabase bucket name and storage policies.
