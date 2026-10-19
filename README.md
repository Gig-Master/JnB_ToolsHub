# JnB Power Tools & Digital Electronics

A modern, full-stack e-commerce platform for Nairobi's trusted hardware and electronics store. 

This project started as a static React application with hardcoded data and has been transformed into a dynamic, database-driven application featuring a secure Admin Dashboard, cloud image storage, and live product search.

## 🚀 Tech Stack

**Frontend:**
- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [TanStack Start](https://tanstack.com/start) (Full-stack React framework)
- [TanStack Router](https://tanstack.com/router) (Type-safe routing)
- [TanStack Query](https://tanstack.com/query) (Async state management & caching)
- [Tailwind CSS](https://tailwindcss.com/) (Styling)

**Backend & Database:**
- [Node.js](https://nodejs.org/) / Server Functions (RPC)
- [PostgreSQL](https://supabase.com/) (Database)
- [Drizzle ORM](https://orm.drizzle.team/) (Type-safe SQL)
- [Supabase Storage](https://supabase.com/storage) (Cloud media storage)

## ✨ Key Features

- **Live Product Catalog:** Browse products dynamically pulled from the database.
- **Live Search & Filtering:** Filter by category, subcategory, in-stock status, and search by name/brand instantly.
- **Secure Admin Dashboard:** JWT-protected routes allow admins to manage inventory.
- **Full CRUD Operations:** Add, edit, and delete products through the UI.
- **Cloud Image Uploads:** Upload product images directly to Supabase Storage with required alt-text for SEO/accessibility.
- **Auto-generated Slugs:** Products automatically get unique, SEO-friendly URLs (e.g., `angle-grinder-850w`).
- **Responsive Design:** Beautiful, mobile-first UI built with Tailwind CSS.

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- Node.js (v20 or higher)
- A [Supabase](https://supabase.com) account (Free tier is fine)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/Gig-Master/Tool-hub.git
cd Tool-hub
npm install


##Environment Variables

# ── Database ──
# Use the Transaction Pooler URL (Port 6543) for the app runtime
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
# Use the Direct Connection or Session Pooler URL (Port 5432) for migrations
MIGRATION_DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# ── Supabase Storage (Server-Side Only) ──
SUPABASE_URL="https://[REF].supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# ── Admin Authentication ──
ADMIN_PASSWORD="ChooseAStrongPassword"
ADMIN_JWT_SECRET="GenerateA32CharRandomString"

##Database Setup

npm run db:generate
npm run db:migrate

##Seed Initial Data

npm run db:seed

##Start the Development Server

npm run dev

##Admin Dashboard

Access the secure admin panel to manage your store.

URL: /admin/login

Password: Use the ADMIN_PASSWORD you set in your .env.local file.

From the dashboard, you can:

Click Add Product to create a new listing.

Upload high-quality images (max 5MB, JPEG/PNG/WebP/AVIF).

Set categories, subcategories, pricing, and stock status.

Edit or delete existing products. (Deleting a product will automatically clean up its images from Supabase Storage).

##Database Schema (Drizzle ORM)

categories: Main product categories (e.g., Power Tools, Solar).

subcategories: Child categories linked to a parent category.

products: Core product details, pricing, and specifications (JSONB).

product_images: Cloud URLs, alt-text, and storage paths linked to products.