# 🚀 Tanish Logistic - Deployment Guide

Your website is **fully built and ready** for production deployment!

## Pre-Deployment Checklist

- ✅ All features implemented
- ✅ Build tested and passing
- ✅ No missing modules or errors

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
4. Configure environment variables:

### Step 3: Add Environment Variables
In Vercel project settings, add these variables:

| Variable | Value | Where to Get |
|----------|-------|--------------|
| `DATABASE_URL` | PostgreSQL connection string | From your database provider (e.g., Neon, Supabase, Railway) |
| `RESEND_API_KEY` | API key for emails | Get from [resend.com](https://resend.com) |
| `ADMIN_PASSWORD` | Your admin password | Choose a strong password |

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
- Node version: `18` or `20`

### Step 3: Add Environment Variables
Same as Vercel - add `DATABASE_URL`, `RESEND_API_KEY`, and `ADMIN_PASSWORD`

### Step 4: Deploy
Click "Deploy site"

---

## Database Setup

### Option A: Neon (Free PostgreSQL)
1. Go to [neon.tech](https://neon.tech)
2. Create a free account
3. Create a new project
4. Copy the connection string
5. Add to Vercel as `DATABASE_URL`

### Option B: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string

### Option C: Railway
1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Add PostgreSQL plugin
4. Copy the connection string

---

## After Deployment

### 1. Run Database Migrations
```bash
npx prisma migrate deploy
```

### 2. Test Your Live Site
- ✅ Visit the homepage
- ✅ Try the booking form
- ✅ Try the contact form
- ✅ Try submitting a review
- ✅ Login to admin panel
- ✅ Check all admin features

---

## Important Files to Commit

✅ All source code
✅ package.json
✅ prisma/schema.prisma
✅ public/ folder (images, videos)
✅ data/settings.json

⚠️ Do NOT commit:
- .env files
- node_modules
- .next build folder

---

## Your Admin Credentials

After deployment, you can login at:
```
https://your-site.com/admin
```

**Default username:** tksunaria@gmail.com
**Password:** Tanishlogistic09

---

## Need Help?

If you encounter any issues during deployment, check:
1. Environment variables are correctly set
2. Database is accessible
3. Build logs for errors

---

## What's Included?

### Public Site
- 🏠 Homepage with hero videos
- 📦 Services page
- 📅 Booking form with pincode verification
- 🖼️ Gallery
- 📞 Contact page with review submission
- ℹ️ About, Industries, Why Us pages

### Admin Panel
- 🔐 Secure login
- 📋 Manage bookings
- 🚚 Manage drivers & vehicles
- 🗺️ Manage routes
- 👥 View customers
- ⭐ Manage reviews (approve/reject)
