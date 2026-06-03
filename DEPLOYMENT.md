# Deployment Guide for WWJ

This guide will walk you through deploying your Wildlife Wonder Jewellery (WWJ) Next.js storefront to Vercel. 

## Prerequisites

1. A [Vercel](https://vercel.com/) account (you can sign up with your GitHub).
2. A [Clerk](https://clerk.com/) account (already set up, but you'll need your keys).
3. Your codebase pushed to a GitHub repository (already done!).

---

## Step 1: Import Project to Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click the **Add New...** button and select **Project**.
3. Under the "Import Git Repository" section, locate your `kanikawildlifewonder/wwj` repository.
4. Click **Import**.

## Step 2: Configure Environment Variables

Before clicking deploy, you **must** configure your Environment Variables so that authentication and other services work correctly in production. 

In the Vercel deployment configuration screen, open the **Environment Variables** accordion and add the following keys exactly as they appear in your `.env.local` file:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | *(Your live Clerk publishable key)* |
| `CLERK_SECRET_KEY` | *(Your live Clerk secret key)* |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/login` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/register` |

*Note: Make sure to use your **Live** Clerk keys for production, not the Test keys.*

## Step 3: Deploy

1. Once the environment variables are added, click **Deploy**.
2. Vercel will now build your project. This typically takes 1-2 minutes.
3. Once finished, you will be redirected to a success screen with fireworks! Click **Continue to Dashboard**.

## Step 4: Verify the Live Site

1. On your Vercel project dashboard, click the **Visit** button to open your live `.vercel.app` URL.
2. Verify that images load correctly.
3. Verify that you can navigate to the `/login` route.
4. If you have admin access, ensure you can access the `/admin` dashboard.

## Next Steps

- **Custom Domain:** When you're ready to use `wwj.com`, go to your Vercel Project Settings > Domains, and add your custom domain. Vercel will provide instructions on how to configure your DNS records.
- **Supabase Integration:** When you are ready to move away from mock data to a real database (Phase 9/Post-Launch), you will add your Supabase connection strings to the Vercel Environment Variables.
