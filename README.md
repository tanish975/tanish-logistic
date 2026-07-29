# Tanish Logistic

Professional logistics booking, customer inquiry, review, and admin management platform built with Next.js, React, Tailwind CSS, Prisma, PostgreSQL, and Resend.

The project powers the public website for Tanish Logistic and includes a protected admin dashboard for managing bookings, routes, reviews, site settings, users, drivers, vehicles, and operational reports.

## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Available Scripts](#available-scripts)
- [Application Pages](#application-pages)
- [Admin Dashboard](#admin-dashboard)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [File Storage and Local Data](#file-storage-and-local-data)
- [Email Workflow](#email-workflow)
- [Deployment](#deployment)
- [Maintenance Notes](#maintenance-notes)

## Overview

Tanish Logistic is a business logistics web application focused on B2B cargo and freight movement across India. Public users can explore services, submit transport bookings, send inquiries, check coverage, and leave reviews. Admin users can log in to a protected dashboard to manage operational records and monitor booking activity.

The application uses:

- Next.js pages router for frontend pages and backend API routes.
- Prisma ORM with PostgreSQL for users, bookings, drivers, vehicles, and reviews.
- Iron Session for secure cookie-based authentication.
- Resend for booking and contact email notifications.
- Tailwind CSS, Radix UI, lucide-react, Framer Motion, and chart libraries for the user interface.

## Core Features

### Public Website

- Responsive home page with video hero, company statistics, hub stations, FAQ, and call-to-action sections.
- Services page covering:
  - Intercity and interstate freight.
  - B2B cargo movement.
  - Fleet-based transport.
  - Contract logistics.
- Multi-step booking form for cargo, route, service, company, and contact details.
- Contact page with office details, contact form, service inquiry selection, and newsletter opt-in field.
- Public review submission with star rating and written feedback.
- Gallery, industries, why-us, about, and contact pages for brand and service presentation.
- Header and footer driven by global settings such as site name, logo, slogan, and theme colors.
- Pincode and logistics serviceability APIs for delivery coverage checks.

### Booking System

- Customer-facing booking form at `/book`.
- Creates human-readable booking IDs such as `TN0001`.
- Stores pickup, drop, cargo, address, date, service type, instructions, price, and status.
- Default booking status is `PENDING`.
- Sends notification email to admin and confirmation email to customer.
- Supports admin status updates through:
  - `PENDING`
  - `CONFIRMED`
  - `IN_TRANSIT`
  - `DELIVERED`
  - `CANCELLED`

### Admin Dashboard

- Protected admin login using email/password and iron-session cookies.
- Role-based access using `ADMIN` and `CUSTOMER`.
- Dashboard overview for booking activity.
- Booking management with:
  - Search by client or booking ID.
  - Status filtering.
  - Status updates.
  - Individual booking deletion.
  - Bulk deletion of cancelled bookings.
- Popular route reporting based on booking frequency.
- Customer list derived from booking records.
- Review moderation and review management.
- Site settings management for branding, colors, contact details, logo, and defaults.
- Driver and vehicle APIs for fleet-related records.
- User management APIs for admin-controlled account creation and deletion.
- Analytics API for booking volume, revenue, status counts, and recent booking activity.

## Tech Stack

- Framework: Next.js
- UI: React, Tailwind CSS, Radix UI components, lucide-react icons
- Animation: Framer Motion
- Forms: React Hook Form
- Charts and reports: Chart.js, react-chartjs-2, Recharts
- Database: PostgreSQL
- ORM: Prisma
- Authentication: iron-session, bcrypt
- Email: Resend and Nodemailer dependency support
- Uploads: formidable
- Notifications: Sonner and react-hot-toast

## Project Structure

```text
.
|-- data/                         # JSON-backed app data such as settings
|-- pages/                        # Next.js pages and API routes
|   |-- api/                      # Backend API endpoints
|   |-- admin.jsx                 # Protected admin dashboard
|   |-- book.jsx                  # Public booking workflow
|   |-- contact.jsx               # Contact and public review form
|   |-- index.jsx                 # Home page
|   `-- services.jsx              # Service descriptions
|-- prisma/
|   |-- schema.prisma             # Database schema
|   |-- seed.js                   # Admin/sample data seed
|   `-- migrations/               # Prisma migrations
|-- public/                       # Static assets, gallery, videos, uploads
|-- src/
|   |-- components/               # Layout, admin views, UI components
|   |-- lib/                      # Prisma client, session, settings, helpers
|   |-- faq.js                    # FAQ content
|   `-- index.css                 # Global styles
|-- package.json
|-- next.config.js
`-- tailwind.config.js
```

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js 18 or newer
- npm, or Yarn if preferred
- PostgreSQL database

### Installation

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

## Environment Variables

Create a `.env` or `.env.local` file in the project root.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
SECRET_COOKIE_PASSWORD="replace-with-at-least-32-characters"
RESEND_API_KEY="your-resend-api-key"
ADMIN_EMAIL="admin@example.com"
NODE_ENV="development"
```

### Variable Details

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma. |
| `SECRET_COOKIE_PASSWORD` | Strongly recommended | Secret used by iron-session to encrypt session cookies. Must be at least 32 characters. |
| `RESEND_API_KEY` | Required for email | API key used to send booking and contact emails. |
| `ADMIN_EMAIL` | Recommended | Email address that receives booking and inquiry notifications. |
| `NODE_ENV` | Usually automatic | Controls secure cookie behavior and production mode. |

Do not commit real `.env` values to version control.

## Database Setup

Generate the Prisma client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate deploy
```

For local development, you can use:

```bash
npx prisma migrate dev
```

Seed the database with an admin user, sample bookings, drivers, and vehicles:

```bash
npx prisma db seed
```

The seed file currently creates an admin account:

```text
Email: tanish@admin.com
Password: tanish123
```

Change this password before using the project in production.

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Starts the Next.js development server. |
| `npm run dev:https` | Starts the Next.js dev server with HTTPS. |
| `npm run build` | Generates Prisma client and builds the Next.js app for production. |
| `npm run start` | Starts the production Next.js server after build. |
| `npm run lint` | Runs Next.js linting. |
| `npm run export` | Builds and exports static output where supported. |
| `npm test` | Runs Jest tests if test files are available. |

## Application Pages

| Route | Purpose |
| --- | --- |
| `/` | Home page with hero videos, stats, hubs, FAQ, and CTA. |
| `/services` | Detailed logistics service offerings. |
| `/book` | Multi-step booking form for cargo transport. |
| `/contact` | Contact details, inquiry form, and public review form. |
| `/Gallery` | Gallery page for logistics/media assets. |
| `/industries` | Industry-focused content. |
| `/whyus` | Reasons to choose the company. |
| `/about` | Company information. |
| `/login` | Login page/component usage route. |
| `/admin` | Protected admin dashboard. |
| `/settings` | Site settings form, also embedded in admin settings. |

## Admin Dashboard

The admin dashboard is available at:

```text
/admin
```

Admin access requires:

1. A valid user in the `User` table.
2. Password verified with bcrypt.
3. User role set to `ADMIN`.
4. Active iron-session cookie.

### Admin Sections

| Section | Ability |
| --- | --- |
| Dashboard | View high-level booking statistics and recent activity. |
| Bookings | Search, filter, update status, delete bookings, and remove cancelled bookings. |
| Routes | See top booked pickup/drop route pairs. |
| Customers | View customer data derived from booking records. |
| Reviews | Manage customer reviews and moderation state. |
| Settings | Update branding, logo, slogan, colors, contact details, and defaults. |

## API Reference

### Authentication

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/login` | `POST` | Authenticates a user and creates a session. |
| `/api/logout` | `POST` | Destroys the active session. |
| `/api/user` | `GET` | Returns the current session user or authentication status. |

### Bookings

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/add-booking` | `POST` | Creates a booking and triggers email notifications. |
| `/api/get-bookings` | `GET` | Returns bookings for admin views. |
| `/api/update-booking` | `POST` | Updates a booking record. |
| `/api/update-booking-status` | `POST` or `PUT` | Updates booking status. |
| `/api/delete-booking` | `POST` | Deletes one booking or all cancelled bookings. |

### Customers, Routes, and Analytics

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/get-customers` | `GET` | Returns customer data derived from bookings. |
| `/api/routes` | `GET` | Returns top booked routes grouped by pickup and drop locations. |
| `/api/analytics` | `GET` | Returns revenue, booking volume, status counts, and recent bookings. |

### Reviews

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/reviews` | `GET` | Returns public reviews by default; `?all=true` is used for admin review lists. |
| `/api/reviews` | `POST` | Creates a review. |
| `/api/reviews` | `PUT` | Updates review moderation/status fields. |
| `/api/reviews` | `DELETE` | Deletes a review. |

### Settings and Uploads

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/settings/general` | `GET` | Returns saved site settings merged with defaults. |
| `/api/settings/general` | `POST` | Saves site settings to `data/settings.json`. |
| `/api/settings` | `GET` | Placeholder endpoint for settings status. |
| `/api/upload` | `POST` | Uploads a file to `public/uploads` and returns its public URL. |

### Fleet Management

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/drivers` | `GET` | Lists drivers. |
| `/api/drivers` | `POST` | Creates a driver. |
| `/api/drivers/[id]` | `GET` | Gets one driver. |
| `/api/drivers/[id]` | `PUT` | Updates one driver. |
| `/api/drivers/[id]` | `DELETE` | Deletes one driver. |
| `/api/vehicles` | `GET` | Lists vehicles. |
| `/api/vehicles` | `POST` | Creates a vehicle. |
| `/api/vehicles/[id]` | `GET` | Gets one vehicle. |
| `/api/vehicles/[id]` | `PUT` | Updates one vehicle. |
| `/api/vehicles/[id]` | `DELETE` | Deletes one vehicle. |

### Users

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/users/get-users` | `GET` | Lists users for authorized admins. |
| `/api/users/add-user` | `POST` | Creates a user with hashed password. |
| `/api/users/delete-user` | `POST` | Deletes a user, with protection against deleting the current account. |

### Contact, Pincode, and Utility

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/send-email` | `POST` | Sends contact form notification and confirmation emails. |
| `/api/check-pincode` | `GET` | Checks pincode serviceability using postal data/fallback behavior. |
| `/api/check-india-pincode` | `GET` | Validates Indian pincode coverage. |
| `/api/check-logistics` | `GET` | Checks logistics serviceability for a pincode. |
| `/api/get-payments` | `GET` | Placeholder payment list endpoint. |
| `/api/test-db` | `GET` | Tests database connectivity. |
| `/api/hello` | `GET` | Basic health/demo endpoint. |

## Data Models

The Prisma schema defines the following main models:

### User

Stores authentication and role information.

- `id`
- `email`
- `password`
- `name`
- `role`
- `createdAt`
- `updatedAt`

Roles:

- `ADMIN`
- `CUSTOMER`

### Booking

Stores customer booking requests and operational status.

- Booking identity: `id`, `bookingId`
- Customer details: `clientName`, `companyName`, `phone`, `email`
- Route details: `pickup`, `drop`, `pickupAddress`, `dropAddress`
- Cargo details: `cargo`, `cargoWeight`, `cargoValue`, `cargoDescription`
- Service details: `date`, `serviceType`, `specialInstructions`, `price`, `status`
- Optional relations: `driverId`, `vehicleId`

### Driver

Stores fleet driver records.

- `id`
- `name`
- `phone`
- `licenseNumber`
- booking relation

### Vehicle

Stores fleet vehicle records.

- `id`
- `make`
- `model`
- `licensePlate`
- `type`
- `capacity`
- booking relation

### Review

Stores customer reviews and moderation status.

- `id`
- `platform`
- `rating`
- `comment`
- `name`
- `date`
- `status`
- `isPublic`

## File Storage and Local Data

The project uses a combination of database records and JSON files:

- `data/settings.json` stores editable site settings.
- `data/bookings.json`, `data/drivers.json`, `data/users.json`, and related JSON files may exist as legacy or supporting data.
- `public/uploads` stores uploaded files such as logos.
- `public/gallery` stores gallery images.
- `public/hero-videos` stores homepage hero videos.

For production, prefer persistent storage for uploads and make sure the deployed environment does not discard runtime-created files.

## Email Workflow

Booking submissions use `/api/add-booking`.

After a booking is saved:

1. The system sends an admin notification to `ADMIN_EMAIL`.
2. The system sends a customer confirmation email when a customer email is provided.
3. Email sending is handled asynchronously so a booking can still be created if email delivery fails.

Contact form submissions use `/api/send-email`.

Email delivery requires a valid `RESEND_API_KEY`.

## Deployment

### Build

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

### Vercel Notes

This project includes Vercel-related files and can be deployed to Vercel. Configure the following in the deployment environment:

- `DATABASE_URL`
- `SECRET_COOKIE_PASSWORD`
- `RESEND_API_KEY`
- `ADMIN_EMAIL`

Before production deployment:

- Run database migrations against the production database.
- Seed only necessary production users.
- Replace the default admin password.
- Confirm the Resend sending domain and `from` addresses are verified.
- Use persistent storage for uploaded assets if the host has ephemeral filesystem behavior.

## Maintenance Notes

- Keep Prisma migrations committed whenever the database schema changes.
- Run `npx prisma generate` after schema updates.
- Avoid storing production secrets in committed files.
- Review `/api/settings/general` before production use because it writes settings to a local JSON file.
- Review access controls for admin-only endpoints before exposing the app publicly.
- The default seed credentials are for development only.
- `npm test` is configured for Jest, but meaningful coverage depends on adding test files.

## Recommended Production Checklist

- Replace seed admin password.
- Set a strong `SECRET_COOKIE_PASSWORD`.
- Verify email sending domain in Resend.
- Restrict admin-only APIs consistently.
- Configure database backups.
- Configure persistent upload storage.
- Run `npm run build` successfully before deployment.
- Test booking creation, email delivery, login/logout, settings update, and booking status changes.
