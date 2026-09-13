# 🐘 Wildlife Wonder Jewellery (WWJ) — Master Technical Handover & Credentials Guide

This document is the official, comprehensive technical handover manual and operational guide for **Wildlife Wonder Jewellery (WWJ)**. It details every architectural component, environment key, database schema, third-party service integration, required credential list, and production deployment procedure needed for smooth ownership transfer and long-term site administration.

---

## 📋 Table of Contents
1. [Required Credentials & Service Onboarding Checklist](#1-required-credentials--service-onboarding-checklist)
2. [Executive Technical Overview & Stack Architecture](#2-executive-technical-overview--stack-architecture)
3. [Environment Configuration Reference](#3-environment-configuration-reference)
4. [Database Architecture & Schema Specification](#4-database-architecture--schema-specification)
5. [Feature & Functionality Breakdown](#5-feature--functionality-breakdown)
6. [Third-Party Services & Integration Guide](#6-third-party-services--integration-guide)
7. [Production Deployment & Infrastructure Setup](#7-production-deployment--infrastructure-setup)
8. [Maintenance, Security & Operational Protocols](#8-maintenance-security--operational-protocols)

---

## 🔑 1. Required Credentials & Service Onboarding Checklist

To take full operational control of the WWJ platform, ensure that the following accounts, API keys, credentials, and access permissions are provided and handed over.

### **1.1 Service Accounts & Access Handover**

| Service | Access Type Required | Details / Purpose | Status / Action Needed |
| :--- | :--- | :--- | :--- |
| **Vercel** | Team Owner / Admin Access | Deployment platform for Next.js web application. | Transfer project ownership or add admin user. |
| **Supabase** | Organization Owner / Admin | PostgreSQL Database cluster host. | Add admin email to Supabase Organization. |
| **Clerk Auth** | Dashboard Admin / Owner | User authentication & admin privilege control. | Transfer Clerk application ownership. |
| **Cloudflare** | Account / DNS / R2 Admin | Object storage bucket & CDN DNS records. | Grant Cloudflare account access. |
| **Razorpay** | Merchant Dashboard Admin | Payment gateway processing INR orders. | Hand over Razorpay login & verify KYC status. |
| **Resend** | Account / Domain Admin | Transactional email delivery service. | Transfer Resend team account access. |
| **Domain Registrar** | DNS Control Panel Access | Domain DNS management (GoDaddy, Namecheap, etc.). | Provide DNS panel login or delegate nameservers. |

---

### **1.2 Complete Master Environment Credentials List**

Below is the exhaustive list of all 22 configuration parameters and secret keys required to operate the application in development and production environments:

```
================================================================================
                    WWJ MASTER ENVIRONMENT KEYS LIST
================================================================================

[1. CLERK AUTHENTICATION]
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY   : Frontend publishable key (pk_live_... / pk_test_...)
- CLERK_SECRET_KEY                    : Backend secret key (sk_live_... / sk_test_...)
- NEXT_PUBLIC_CLERK_SIGN_IN_URL       : Default: /login
- NEXT_PUBLIC_CLERK_SIGN_UP_URL       : Default: /register
- NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL : Default: /account
- NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL : Default: /account

[2. SUPABASE & DATABASE]
- DATABASE_URL                        : Pooled Postgres connection (Port 6543, pgbouncer=true)
- DIRECT_URL                          : Direct Postgres connection (Port 5432, for migrations/builds)
- PG_POOL_MAX                         : App pool connection limit (Default: 1 for serverless)
- NEXT_PUBLIC_SUPABASE_URL            : Supabase Project URL (https://<project-ref>.supabase.co)
- NEXT_PUBLIC_SUPABASE_ANON_KEY       : Browser-safe public API key
- SUPABASE_SERVICE_ROLE_KEY           : Server-only administrative key

[3. RAZORPAY PAYMENT GATEWAY]
- RAZORPAY_KEY_ID                     : Server backend Razorpay key ID (rzp_live_... / rzp_test_...)
- RAZORPAY_KEY_SECRET                 : Server backend Razorpay secret key
- NEXT_PUBLIC_RAZORPAY_KEY_ID        : Frontend browser Razorpay checkout key ID

[4. CLOUDFLARE R2 MEDIA STORAGE]
- R2_ACCOUNT_ID                       : Cloudflare 32-character account ID
- R2_ACCESS_KEY_ID                    : S3-compatible R2 access key ID
- R2_SECRET_ACCESS_KEY                : S3-compatible R2 secret key
- R2_BUCKET_NAME                      : R2 storage bucket name (e.g. wwj-media)
- R2_PUBLIC_URL                       : CDN domain URL (e.g. https://media.wildlifewonderjewellery.com)

[5. APPLICATION & EMAIL]
- NEXT_PUBLIC_SITE_URL                : Production website root URL (https://wildlifewonderjewellery.com)
- NEXT_PUBLIC_SITE_NAME               : Site title (Wildlife Wonder Jewellery)
- RESEND_API_KEY                      : Resend API Key for sending emails (re_...)
================================================================================
```

---

### **1.3 Business & Brand Assets Required**

| Asset Category | Required Items | Preferred Format / Notes |
| :--- | :--- | :--- |
| **Brand Identity** | Official High-Res Logo, Favicon, Vector Icons | SVG or PNG with transparent background |
| **Product Media** | High-Res Images & Product Videos | JPEG/WebP (Max 5MB), MP4/WebM (Max 50MB) |
| **Catalogs** | Printable PDF Catalogs / Lookbooks | PDF format (Max 20MB) |
| **Store Metadata** | Official Business Address, Contact Number, Support Email | To be configured in Admin Settings panel |
| **Social Links** | Instagram, Facebook, YouTube, Pinterest Handles | Configured in site footer & contact pages |
| **Legal Pages** | Privacy Policy, Terms of Service, Shipping & Return Policies | Standard Markdown/Text for legal compliance |

---

## 🛠️ 2. Executive Technical Overview & Stack Architecture

Wildlife Wonder Jewellery is engineered as a modern, high-speed luxury e-commerce web application utilizing full-stack serverless architecture.

```
                  +-----------------------------------+
                  |          CLIENT BROWSER           |
                  | Next.js Storefront / Admin Panel  |
                  +-----------------+-----------------+
                                    |
            +-----------------------+-----------------------+
            |                       |                       |
            v                       v                       v
   +-----------------+     +-----------------+     +-----------------+
   |   Clerk Auth    |     | Next.js Server  |     |  Zustand Store  |
   | (User/Admin ID) |     |  Actions API    |     | (Cart/Wishlist) |
   +-----------------+     +--------+--------+     +-----------------+
                                    |
        +------------------+--------+--------+------------------+
        |                  |                 |                  |
        v                  v                 v                  v
+---------------+  +---------------+  +---------------+  +---------------+
| Supabase DB   |  | Cloudflare R2 |  |   Razorpay    |  |  Resend API   |
| (PostgreSQL)  |  |  (S3 Media)   |  | (Payments)    |  | (Email Engine)|
+---------------+  +---------------+  +---------------+  +---------------+
```

### **Tech Stack Specifications**

| Subsystem | Technology | Architectural Rationale |
| :--- | :--- | :--- |
| **Core Framework** | **Next.js 16 (App Router)** | Hybrid SSG/SSR rendering guarantees instant page loads, excellent SEO indexing, and type-safe server actions. |
| **Language Engine** | **TypeScript 5** | End-to-end type safety eliminates runtime data structure mismatches across client and server logic. |
| **Styling & Theme** | **Tailwind CSS v4** | Custom-curated luxury color scheme (Deep Emerald `#071D16`, Warm Gold `#D6B87A`, Sand `#F7F1E5`). |
| **Animations** | **Motion (Framer Motion)** | Fluid page transitions, modal overlays, slide-out cart drawers, and luxury brand interactions. |
| **Database** | **PostgreSQL (Supabase)** | Enterprise-grade relational database for strict transactional consistency across products, orders, and CMS. |
| **ORM Layer** | **Prisma 7 (`@prisma/adapter-pg`)** | High-performance node-postgres connection pooling layer optimized for serverless deployments. |
| **User Management** | **Clerk Auth** | Turnkey user authentication, OAuth login provider management, and admin route protection (`requireAdmin`). |
| **Object Storage** | **Cloudflare R2** | High-speed media hosting with **zero egress costs**, replacing traditional costly cloud storage buckets. |
| **Payments** | **Razorpay** | Smooth Indian payment processing with server-side order generation in INR currency. |
| **Email Engine** | **Resend** | High deliverability transactional email service for customer order receipts and contact submissions. |
| **State Management** | **Zustand (`persist`)** | Lightweight client state for shopping cart (`wwj-cart`) and wishlist (`wwj-wishlist`) with local storage fallback. |

---

## ⚙️ 3. Environment Configuration Reference

### **3.1 Detailed Environment Variable Guide**

#### **Clerk Authentication**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Public key powering frontend Clerk auth modals.
- `CLERK_SECRET_KEY`: Server-side secret key used to verify user sessions and admin roles.
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL`: Redirect routes for login (`/login`) and signup (`/register`).
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`: Destination route after successful authentication (`/account`).

#### **Database Configuration**
- `DATABASE_URL`: Connection string pointing to Supabase PgBouncer (Port 6543). Enables connection pooling for server runtime execution.
- `DIRECT_URL`: Direct PostgreSQL connection string (Port 5432). Used strictly during `next build` static site generation, migrations, and Prisma introspection.
- `PG_POOL_MAX`: Controls the maximum active connection pool size per serverless container (default `1`).

#### **Razorpay Integration**
- `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`: Private server-side credentials for instantiating the Razorpay SDK to create payment orders.
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`: Browser-accessible key ID passed to the client-side Razorpay Checkout widget.

#### **Cloudflare R2 Media Storage**
- `R2_ACCOUNT_ID`: Your Cloudflare Account Identifier.
- `R2_ACCESS_KEY_ID` & `R2_SECRET_ACCESS_KEY`: AWS S3-compatible security credentials generated in Cloudflare R2 dashboard.
- `R2_BUCKET_NAME`: The targeted storage bucket name (e.g. `wwj-media`).
- `R2_PUBLIC_URL`: CDN URL domain serving uploaded images and videos (e.g. `https://media.wildlifewonderjewellery.com`).

#### **Resend Email Service**
- `RESEND_API_KEY`: API key beginning with `re_` used to authorize transactional email dispatches.

---

## 🗄️ 4. Database Architecture & Schema Specification

The database uses PostgreSQL hosted on Supabase and managed via Prisma ORM (`prisma/schema.prisma`).

```
+-------------------+       +-------------------+       +-------------------+
|      Product      |       |       Order       |       |     OrderItem     |
+-------------------+       +-------------------+       +-------------------+
| id (cuid)         |       | id (cuid)         |       | id (cuid)         |
| name              |       | clerkUserId       |       | orderId           |-----> Order.id
| description       |       | customerName      |       | productId         |-----> Product.id
| price             |       | customerEmail     |       | quantity          |
| images (String[]) |       | totalAmount       |       | price             |
| video             |       | status            |       +-------------------+
| mainCategory      |       | razorpayPaymentId |
| category          |       | razorpayOrderId   |       +-------------------+
| inStock           |       | razorpaySignature |       |       Event       |
| featured          |       | createdAt         |       +-------------------+
| createdAt         |       +-------------------+       | id (cuid)         |
| updatedAt         |                                   | title, slug       |
+-------------------+       +-------------------+       | category, status  |
                            |      Coupon       |       | featuredImage     |
+-------------------+       +-------------------+       | galleryImages     |
|    PageContent    |       | id (cuid)         |       | shortDescription  |
+-------------------+       | code (unique)     |       | fullDescription   |
| id (key)          |       | type (% / fixed)  |       | eventDate         |
| content (JSON)    |       | value             |       | partnerName       |
| updatedAt         |       | isActive          |       | relatedProducts   |
+-------------------+       +-------------------+       +-------------------+
```

---

## 💎 5. Feature & Functionality Breakdown

### **5.1 Customer Storefront (`app/(storefront)`)**

- **Homepage (`/`)**: Dynamic hero banners, collection highlights, brand story sections, and dynamic CMS content loaded directly from `PageContent`.
- **Product Catalog (`/shop`, `/collections`, `/products/[id]`)**: Filterable product lists, stock badges, multi-image galleries, and embedded product videos.
- **Cart & Wishlist Drawers (`store/cartStore.ts`)**: Persistent client-side cart drawer, promo code input, and wishlist collection stored in browser `localStorage`.
- **Razorpay Checkout (`/checkout`)**: Integrated checkout flow with guest order support, automatic price calculation in INR paise, database order record creation, and Resend confirmation emails.
- **Events & Conservation (`/events`, `/events/[slug]`)**: Dedicated showcase for wildlife conservation initiatives, exhibitions, partner logos, and related product links.
- **Customer Account (`/account`, `/account/orders`)**: Protected route for logged-in users to review order history, order statuses (`PROCESSING`, `SHIPPED`, `DELIVERED`), and delivery metrics.

---

### **5.2 Admin Management Suite (`app/admin`)**

- **Authentication Guard (`lib/auth-guard.ts`)**: All administrative server actions are protected with `requireAdmin()`, validating session tokens via Clerk.
- **Dashboard Overview (`/admin`)**: Real-time business metrics including total revenue, order count, active customer count, low-stock warnings, and a 7-day revenue trend chart (Recharts).
- **Product Management (`/admin/products`)**: Create, update, toggle stock availability, set featured status, and upload product images/videos directly to Cloudflare R2.
- **Order Processing (`/admin/orders`)**: Inspect customer orders, filter by status, update delivery progress, and review Razorpay payment IDs.
- **Event CMS (`/admin/events`)**: Publish news, exhibitions, and wildlife conservation stories with custom media and related product tags.
- **Coupon Manager (`/admin/coupons`)**: Generate promotional discount codes (Percentage or Fixed amount).
- **Page Content & Settings Editor (`/admin/pages`, `/admin/settings`)**: Edit hero text, store contact details, and brand messaging dynamically without code deployment.

---

## 📡 6. Third-Party Services & Integration Guide

### **6.1 Cloudflare R2 Upload Pipeline**
Media files uploaded in the Admin Panel pass through `app/actions/upload.ts`:
1. Server action validates admin session via `requireAdmin()`.
2. File type and size limits are verified (Images $\le 5\text{MB}$, Videos $\le 50\text{MB}$, PDFs $\le 20\text{MB}$).
3. AWS S3 SDK (`PutObjectCommand`) uploads the buffer to Cloudflare R2.
4. Public CDN URL is returned and saved to PostgreSQL database.

---

### **6.2 Razorpay Payment Flow**
1. Customer initiates checkout on `/checkout`.
2. Server Action `createRazorpayOrder(amount)` initializes Razorpay order in INR paise (`amount * 100`).
3. Razorpay Checkout modal opens on client browser.
4. Upon payment success, `createOrder()` persists order details, line items, and Razorpay signature to database.
5. `sendOrderConfirmationEmail()` dispatches receipt to store administration and customer.

---

## 🚀 7. Production Deployment & Infrastructure Setup

### **7.1 Step-by-Step Vercel Deployment**

1. Push latest codebase to Git repository.
2. Log into **Vercel** and import project repository.
3. Configure Build Settings:
   - **Framework**: Next.js
   - **Build Command**: `prisma generate && next build`
   - **Output Directory**: `.next`
4. Add all 22 Environment Variables under Vercel **Project Settings > Environment Variables**.
5. Trigger **Deploy**.

---

## 🔐 8. Maintenance, Security & Operational Protocols

1. **Database Connection Limits**: Always retain `DIRECT_URL` for build environments to avoid hitting PgBouncer connection caps.
2. **Media Assets**: Maintain image sizes under $5\text{MB}$ for optimal page speed and bandwidth performance.
3. **Security Audits**: Keep Clerk, Prisma, and Next.js packages updated regularly.
4. **Backups**: Ensure automatic daily database backups are enabled in Supabase Dashboard.

---

*Wildlife Wonder Jewellery — Technical Handover Document.*
