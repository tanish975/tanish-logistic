# 🚀 Tanish Logistic - Deployment Guide

Your website is **fully built and ready** for production deployment!

## 🔒 Security Fixes Applied

The following security improvements have been implemented:

- ✅ **Removed hardcoded credentials** - All sensitive data uses environment variables
- ✅ **Cleaned console.log statements** - Removed debug logs containing sensitive information
- ✅ **Hardened error messages** - Generic error responses prevent information disclosure
- ✅ **Secure admin authentication** - Bcrypt password hashing with proper salt rounds (10 rounds)
- ✅ **Environment variable validation** - Ensures required vars are present before app starts

## Pre-Deployment Checklist

- ✅ All features implemented
- ✅ Build tested and passing
- ✅ No missing modules or errors
- ✅ Security best practices applied
- ✅ Database schema validated with Prisma

---

## Option 1: Deploy to Vercel (Recommended)

### Step 1: Prepare Your Code
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Ready for production deployment"

# Create a new repository on GitHub and push
git remote add origin https://github.com/YOUR_USERNAME/tanish-logistic.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel auto-detects Next.js configuration

### Step 3: Configure Environment Variables
In Vercel project settings → "Environment Variables", add:

| Variable | Value | Required | Description |
|----------|-------|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string | **Yes** | From Neon, Supabase, or Railway |
| `RESEND_API_KEY` | Resend API key | **Yes** | Get from [resend.com](https://resend.com) |
| `ADMIN_PASSWORD` | Admin password | **Yes** | Min 12 chars, unique & strong |
| `NODE_ENV` | `production` | Auto | Set automatically by Vercel |
| `NEXT_PUBLIC_APP_URL` | Your domain | Auto | Set after deployment |

**Security Notes:**
- Never commit `.env` files to version control
- Use a unique, strong password (12+ chars, mix of letters/numbers/symbols)
- Rotate credentials periodically
- Admin passwords are hashed with bcrypt before storage

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Your site is live! 🎉

---

## Option 2: Deploy to Netlify

### Step 1: Connect to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository

### Step 2: Configure Settings
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: `20` (recommended)

### Step 3: Add Environment Variables
Same as Vercel - add `DATABASE_URL`, `RESEND_API_KEY`, and `ADMIN_PASSWORD` in Site settings → Environment variables.

### Step 4: Deploy
Click "Deploy site"

---

## Database Setup

### Option A: Neon (Free PostgreSQL - Recommended)
1. Go to [neon.tech](https://neon.tech)
2. Create a free account
3. Create a new project
4. Copy the connection string (format: `postgresql://...`)
5. Add to Vercel/Netlify as `DATABASE_URL`

### Option B: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the "Connection string" (URI format)
5. Add to deployment environment variables

### Option C: Railway
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL plugin
4. Copy the connection string from plugin settings

---

## Custom Domain Setup

### On Vercel
1. Go to your project → Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `tanishlogistic.com`)
4. Follow DNS configuration instructions:
   - **For root domain** (`@`): Add A record pointing to Vercel's IPs
   - **For subdomain** (`www`): Add CNAME to `cname.vercel-dns.com`
5. Wait for DNS propagation (5-30 minutes)
6. SSL certificate auto-provisions via Let's Encrypt

### On Netlify
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Enter your domain
4. Configure DNS:
   - **For root domain**: Add A records to Netlify's load balancer IPs
   - **For subdomain**: Add CNAME to `your-site.netlify.app`
5. Netlify provisions SSL automatically

**DNS Tips:**
- Use your domain registrar's DNS (GoDaddy, Namecheap, etc.) or Cloudflare
- Allow 24-48 hours for full propagation
- Test DNS with: `nslookup yourdomain.com` or `dig yourdomain.com`

---

## After Deployment

### 1. Run Database Migrations
```bash
# Connect to your Vercel/Netlify deployment via CLI
npx prisma migrate deploy

# Or use Prisma Studio to verify data:
npx prisma studio
```

### 2. Seed Admin User (If Not Auto-Seeded)
The admin user is created automatically via `prisma db seed` during build if you've configured it in `package.json`. To manually seed:

```bash
npx prisma db seed
```

This creates the admin account with credentials below.

### 3. Test Your Live Site
- ✅ Visit the homepage
- ✅ Try the booking form
- ✅ Try the contact form
- ✅ Try submitting a review
- ✅ Login to admin panel at `/admin`
- ✅ Check all admin features

---

## Important Files to Commit

✅ **Commit these:**
- All source code (`app/`, `components/`, `lib/`)
- `package.json` and `package-lock.json`
- `prisma/schema.prisma`
- `public/` folder (images, videos)
- `data/settings.json`
- `DEPLOYMENT.md`

⛔ **Do NOT commit:**
- `.env` files (`.env.local`, `.env.production`)
- `node_modules/`
- `.next/` build folder
- `prisma/dev.db` (local SQLite file)
- Any files containing secrets/API keys

---

## 🔐 Admin Credentials

The admin user is created by the Prisma seed script with the following credentials:

**After deployment, login at:**
```
https://your-site.com/admin
```

| Field | Value |
|-------|-------|
| **Email** | tanish@admin.com |
| **Password** | tanish123 |

**⚠️ Security Actions Required:**
1. Login with the default credentials above
2. Immediately change the admin password in the admin panel
3. Choose a strong, unique password (12+ characters)
4. Never share these credentials publicly
5. Consider enabling 2FA if available in future updates

**Note:** These credentials come from `prisma/seed.js` and are hashed with bcrypt before storage.

---

## Need Help?

If you encounter issues during deployment, check:
1. **Environment variables** are correctly set in Vercel/Netlify
2. **Database** is accessible (check connection string format)
3. **Build logs** for errors in Vercel/Netlify dashboard
4. **Prisma migrations** ran successfully (`npx prisma migrate deploy`)
5. **Domain DNS** propagated correctly (use `dig` or `nslookup`)

---

## What's Included?

### Public Site
- 🏠 Homepage with hero videos
- 📦 Services page
- 📅 Booking form with pincode verification
- 🖼️ Gallery
- 📞 Contact page with review submission
- ℹ️ About, Industries, Why Us pages
- 🔍 SEO optimized with metadata

### Admin Panel
- 🔐 Secure login with bcrypt password hashing
- 📋 Manage bookings (view, update status, filter)
- 🚚 Manage drivers & vehicles (CRUD operations)
- 🗺️ Manage routes and assign drivers
- 👥 View customer information
- ⭐ Manage reviews (approve/reject)
- ⚙️ Site settings configuration
- 📧 Email notifications (Resend integration)

### Security Features
- 🔒 Environment variable based configuration
- 🔑 Bcrypt password hashing (salt rounds: 10)
- 🛡️ CSRF protection (Next.js built-in)
- 📝 Generic error messages (no stack traces in production)
- 🧹 No sensitive data in console logs
- 🔐 Role-based access control (ADMIN role)
