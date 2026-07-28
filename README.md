# Hostel Finder

Full-stack hostel discovery and booking MVP built with Next.js, Express, MongoDB, and JWT authentication.

## Features

- Registration, login, HTTP-only session cookie, profiles, profile images, and password changes
- Hostel search by text, city, and price; hostel details and amenities
- Saved-hostel shortlist, date-aware booking capacity, cancellation, and booking history
- Verified-guest reviews with aggregate ratings
- Live user dashboard counts and upcoming stays
- Owner workspace for property submissions, approval feedback, inventory, booking, payment, and revenue management
- Role-protected admin operations for users and owners, listing approval, bookings and payments, reviews, announcements, reports, CSV exports, and an audit trail

## Admin operations

Administrators can:

- Search and filter users by role or status, create users and owners, edit roles, suspend/reactivate accounts, and inspect account details
- Review owner-submitted hostels, approve or reject them with feedback, assign owners, edit inventory, feature listings, and archive/reactivate listings without deleting booking history
- Search and filter reservations by guest, hostel, booking status, payment status, or payment method, then update booking and payment states
- Moderate reviews with automatic rating recalculation
- Send in-app announcements to all active accounts
- View revenue, occupancy, demand, and booking reports, and export booking data as CSV
- Review the immutable-facing activity log for sensitive administrator actions

Suspended accounts are rejected on every authenticated API request, including requests made with tokens issued before suspension. Administrator password resets revoke existing sessions. The final active administrator cannot be suspended or demoted, and administrators cannot remove their own access.

## Frontend architecture

The frontend uses the Next.js App Router with React server components for
data-driven pages and client components for interactive forms, dialogs, filters,
and optimistic controls. Server actions form the boundary between UI components
and the Express API. Authentication tokens are stored in an HTTP-only
`auth_token` cookie and attached to API requests on the server.

The application contains three main interface areas:

- Guest workspace: discovery, saved hostels, bookings, notifications, and profile
- Owner workspace: property submissions, moderation feedback, and reservations
- Admin workspace: accounts, listings, bookings, reviews, announcements, reports,
  and audit activity

Navigation supports English and Nepali labels, and prices use NPR formatting.
The Profile page includes personal information, profile-image upload, and
password management. `/password` remains as a compatibility redirect to the
Profile password section.

The `/forgot-password` route currently provides the frontend recovery
experience. A production password-reset API and email delivery service must be
connected before it can send real reset instructions.

## Folder structure

```text
hostel_finder/
├── actions/                 # Server actions for auth, hostels, owners and admin
├── app/
│   ├── (auth)/              # Login, registration and forgot-password pages
│   ├── admin/               # Protected administration workspace
│   ├── api/                 # Frontend route handlers and API proxies
│   ├── bookings/            # Guest reservations and demo payment UI
│   ├── dashboard/           # Authenticated guest overview
│   ├── hostels/             # Search results and hostel details
│   ├── notifications/       # User notification center
│   ├── owner/               # Protected property-owner workspace
│   ├── profile/             # Profile and password management
│   ├── saved/               # Saved-hostel shortlist
│   ├── globals.css          # Global Tailwind styles
│   └── layout.tsx           # Root application layout
├── components/              # Shared navigation, hostel and booking components
├── lib/
│   ├── api/                 # Authenticated API request helpers
│   ├── context/             # Authentication and locale providers
│   ├── payments/            # Payment contract and Khalti demo adapter
│   ├── schemas/             # Shared Zod validation schemas
│   ├── types/               # TypeScript domain and response types
│   └── utils/               # Image URL and presentation utilities
├── public/hostels/          # Starter hostel images
├── proxy.ts                 # Cookie-based protected-route guard
└── next.config.ts           # Next.js and Turbopack configuration
```

## Frontend configuration

Create `.env.local` in this folder:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

If omitted, the frontend uses the same local API URL by default. The backend
must allow the frontend origin through its `CLIENT_URL` CORS setting.

### Main scripts

```powershell
npm run dev
npm run lint
npm run build
npm start
```

- `dev` starts the Turbopack development server.
- `lint` runs ESLint.
- `build` performs the optimized build and TypeScript validation.
- `start` serves a completed production build.

## Run locally

From `backend`, configure `.env`, then run:

```powershell
npm install
$env:ADMIN_EMAIL="admin@example.com"
$env:ADMIN_PASSWORD="choose-a-secure-password"
npm run seed
npm run dev
```

To add or refresh only the ten starter hostel listings without changing an admin account:

```powershell
npm run seed:hostels
```

After upgrading an existing database, initialize the new administration fields once:

```powershell
npm run migrate:admin
```

With the backend running, the targeted administration smoke test verifies RBAC, moderation, suspension, reporting, and exports and cleans up its temporary records:

```powershell
npm run test:admin-smoke
```

From `D:\web_api_final\frontend`, run:

```powershell
npm install --prefix hostel_finder
npm run dev
```

The frontend defaults to `http://localhost:3000` and the API to `http://localhost:5000/api/v1`.
