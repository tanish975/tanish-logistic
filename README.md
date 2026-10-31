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
- Creates non-sequential booking references such as `TN` followed by a random hexadecimal identifier.
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

- Node.js 20.9 or newer (Next.js 16 requirement)
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
SECRET_COOKIE_PASSWORD=""  # Supply a unique random value of at least 32 characters.
RESEND_API_KEY="your-resend-api-key"
ADMIN_EMAIL="admin@example.com"
# Required for production logo uploads; keep this server-side and secret.
BLOB_READ_WRITE_TOKEN=""
# ADMIN_PASSWORD is set securely only when deliberately seeding an admin.
```

### Variable Details

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma. |
| `SECRET_COOKIE_PASSWORD` | Yes | Unique, random iron-session secret of at least 32 characters. Rotating it invalidates all sessions. |
| `RESEND_API_KEY` | Required for email | API key used to send booking and contact emails. |
| `ADMIN_EMAIL` | Required for booking notifications and seeding | Recipient(s) for booking notifications; seeding requires one valid address. Contact notifications currently use their configured recipient in the contact API. |
| `ADMIN_PASSWORD` | Only for deliberate seeding | Unique admin passphrase of at least 16 characters and at most 72 UTF-8 bytes. No fallback is provided. |
| `BLOB_READ_WRITE_TOKEN` | Required for production logo uploads | Server-only token for a **public** Vercel Blob store. Logos are public; never upload private documents. |
| `TRUST_PROXY_IP_HEADERS` | Optional | Set to `1` only behind a trusted non-Vercel proxy that strips and replaces client-supplied forwarding headers. |
| `NODE_ENV` | Usually automatic | Controls secure cookie behavior and production mode. |

Do not commit real `.env` values to version control.

## Database Setup

Generate the Prisma client:

```bash
npx prisma generate
```

**Before any deployment:** the security release adds `User.sessionVersion`, persistent `SiteSettings`, and missing booking/review schema objects. Historical migrations include destructive operations and may not match a database previously changed with `db push`. Back up and inspect the actual migration baseline, then rehearse on a disposable database copy before applying anything to production. Never use `db push --accept-data-loss` as a shortcut. See [Security operations](docs/SECURITY-OPERATIONS.md).

On a new empty database or after an operator has verified the migration plan, apply migrations using:

```bash
npx prisma migrate deploy
```

For a disposable development database you can use `npx prisma migrate dev`. Generate a client after schema changes with `npx prisma generate`.

The seed script has **no default credentials**. Set a single `ADMIN_EMAIL` and a strong `ADMIN_PASSWORD` through your local environment or secret manager before deliberately running `npx prisma db seed`. Existing admin passwords are not changed by seeding. The operator-only `node scripts/create-admin.js` uses the same explicit email and password policy, but creates or resets the selected account as an administrator; run it only from a trusted environment when intentionally provisioning access. Sample bookings, drivers and vehicles are skipped unless `SEED_SAMPLE_DATA=1`, and sample seeding is refused in production. Do not seed or provision a live database without an approved plan and backup.

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
| `/api/reviews` | `GET` | Admin-only review list; `?all=true` includes pending and rejected reviews. |
| `/api/reviews` | `POST` | Submits a review as pending and non-public; only an admin can approve it. |
| `/api/reviews` | `PUT` | Updates review moderation/status fields. |
| `/api/reviews` | `DELETE` | Deletes a review. |

### Settings and Uploads

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/settings/general` | `GET` | Admin-only settings including non-public configuration defaults. |
| `/api/settings/general` | `POST` | Saves allowlisted, non-secret settings to PostgreSQL. |
| `/api/settings` | `GET` | Returns public branding settings only. |
| `/api/upload` | `POST` | Admin-only logo upload; validates and re-encodes images before public storage. |

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
| `/api/get-payments` | `GET` | Admin-only placeholder payment list endpoint. |
| `/api/test-db` | `GET` | Admin-only database connectivity check; no record counts. |
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

- PostgreSQL stores bookings, users, fleet records, reviews, and editable site settings. If no settings row exists yet, allowlisted values from `data/settings.json` are used as initial defaults. Existing serverless filesystem edits are not automatically migrated; export and review them before upgrading.
- Production logo uploads require a public Vercel Blob store and `BLOB_READ_WRITE_TOKEN`. Only decoded/re-encoded PNG, JPEG, GIF and WebP images up to 3 MB are accepted; SVG and PDF uploads are rejected. Local development can use ignored `public/uploads`.
- The legacy unused booking, driver, vehicle, payment and user JSON exports were removed from the current Git tree and ignored locally. Their old Git history is still public; review exposure and rotate any related credentials. No history rewrite has been performed.
- `public/gallery` and `public/hero-videos` contain static public assets.

## Email Workflow

Booking submissions use `/api/add-booking`.

After a booking is saved:

1. The system sends an admin notification to `ADMIN_EMAIL`.
2. The system sends a customer confirmation email when a customer email is provided.
3. Delivery is awaited; if email fails after saving, the booking remains successful and the customer is warned rather than encouraged to submit a duplicate.

Contact form submissions use `/api/send-email`.

Email delivery requires a valid `RESEND_API_KEY`.

### Public submission and sign-in spam protection

- On Vercel, contact, booking, public review and sign-in requests use [BotID Basic](https://vercel.com/docs/botid), explicitly configured as `basic` (not paid Deep Analysis). BotID needs Vercel's request context and OIDC enabled for the project. A detected bot is rejected before either email is sent; if verification is unavailable the form returns an error with a telephone fallback rather than sending unverified emails.
- The API also validates and escapes inputs, checks an optional hidden honeypot, and limits an IP to five attempts per ten minutes. The limit is **per server instance**, not a shared global limit; it and the honeypot alone will not stop distributed or sophisticated spam. There is no language or gibberish filter that could silently discard genuine enquiries.
- On non-Vercel hosts, BotID is not available and only the secondary protections apply. In development BotID normally returns a human verdict, so local tests cannot prove live bot detection. If building outside Vercel for a Vercel deployment, set `NEXT_PUBLIC_CONTACT_BOTID=1` at build time so the browser protection is included.
- After an authorized deployment, test on a Vercel preview with OIDC enabled: confirm that a genuine browser can submit and that a direct request without the browser challenge is rejected. A genuine submission sends both the admin notification and the customer confirmation, so use a controlled email configuration and test addresses. Monitor for false positives; if abuse continues, consider a shared rate limiter or additional firewall rules.

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
- `BLOB_READ_WRITE_TOKEN` (for public logo uploads)

Before production deployment, follow the [security operations checklist](docs/SECURITY-OPERATIONS.md): inspect and rehearse the database migration, rotate exposed or weak credentials, configure MFA and shared edge rate limits, connect public logo storage, and test the actual Vercel BotID/CSP behavior with controlled test accounts and email addresses. Do not assume the local mock tests prove production behavior.

## Maintenance Notes

- Keep Prisma migrations committed and validate them against a backup or disposable clone before deployment.
- Keep secrets in the hosting provider's secret manager, never in source files, public settings, or browser code.
- Run `npm test`, `npm run build`, and `npm audit` after dependency or code changes.
- Review [Security operations](docs/SECURITY-OPERATIONS.md) for known infrastructure limitations, exposure history, and incident-response steps.
