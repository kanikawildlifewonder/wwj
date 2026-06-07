# WWJ

Wildlife Wonder Jewellery storefront built with Next.js 16, Clerk, Supabase, Prisma, Tailwind CSS, and Zustand.

## Local Development

1. Create `.env.local` from [`.env.example`](V:\website\kanika website\wwj\.env.example).
2. Fill in Clerk, Supabase, and Prisma environment variables.
3. Start the app:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000).

## Database Setup

This app uses Supabase with Prisma and intentionally separates runtime and build-time connections:

- `DATABASE_URL`: pooled runtime connection
- `DIRECT_URL`: direct non-pooled Prisma build/migration connection

That split avoids build-time Prisma failures during multi-worker `next build`.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Deployment

See [DEPLOYMENT.md](V:\website\kanika website\wwj\DEPLOYMENT.md) for the current Vercel, Supabase, and Prisma deployment setup.
