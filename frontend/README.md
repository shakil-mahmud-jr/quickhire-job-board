# QuickHire Frontend

A modern, fully responsive job board UI built with Next.js 14 and Tailwind CSS.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Fonts**: Syne (display) + Plus Jakarta Sans (body) — via Google Fonts

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage — hero, category grid, latest jobs, CTA banner |
| `/jobs` | Job listings with search, filter, and pagination |
| `/jobs/[id]` | Job detail with full description + Apply form |
| `/admin` | Admin panel — create and delete job listings |

---

## Project Structure

```
frontend/
├── app/
│   ├── layout.js              # Root layout (navbar + footer)
│   ├── page.js                # Homepage
│   ├── loading.js             # Global loading state
│   ├── not-found.js           # 404 page
│   ├── globals.css            # Global styles + fonts
│   ├── jobs/
│   │   ├── page.js            # Job listings page
│   │   └── [id]/page.js       # Job detail page
│   └── admin/
│       └── page.js            # Admin panel
├── components/
│   ├── layout/
│   │   ├── Navbar.js          # Sticky responsive navbar
│   │   └── Footer.js          # Dark footer with links
│   ├── ui/
│   │   ├── Button.js          # Reusable button (variants + loading)
│   │   ├── Badge.js           # Type/category tags
│   │   ├── Skeleton.js        # Loading skeleton components
│   │   ├── Toast.js           # Success/error toasts
│   │   └── EmptyState.js      # Empty results state
│   ├── jobs/
│   │   ├── JobCard.js         # Individual job card
│   │   ├── JobGrid.js         # Grid wrapper with loading/empty state
│   │   ├── SearchBar.js       # Search + filter bar
│   │   ├── Pagination.js      # Page navigation
│   │   └── ApplicationForm.js # Apply Now form
│   └── admin/
│       ├── AdminJobForm.js    # Create job form
│       └── AdminJobList.js    # List + delete jobs
├── lib/
│   ├── api.js                 # All API call functions
│   └── utils.js               # Helpers, constants, formatters
├── .env.local.example
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- Backend server running (see `../backend/README.md`)

### Install and run

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local and set your API URL
npm run dev
```

App runs at **http://localhost:3000**

---

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

For production, point this to your deployed backend URL.

---

## Features

- **Search** jobs by keyword, company, or location
- **Filter** by category and job type — instant results
- **Pagination** on the jobs listing page
- **Apply form** with client-side + server validation
- **Duplicate application prevention** (shows error message)
- **Loading skeletons** on all data-fetching pages
- **Responsive** — works great on mobile, tablet, and desktop
- **Sticky navbar** that transitions on scroll
- **Admin panel** to create and delete job listings
- **Confirmation modal** before deleting a job
- **Related jobs** shown on each job detail page

---

## Deployment (Vercel)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Set root directory to `/frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
5. Deploy
