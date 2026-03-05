# Kids Points Tracker

A mobile-first web app for parents to manage a point-based reward system for kids. Points represent screen-time minutes — kids earn points for good behaviour and spend them on screen time.

## Tech Stack

| Layer | Technology |
|---|---|
| Hosting | Cloudflare Pages |
| API | Cloudflare Pages Functions (edge) |
| Database | Cloudflare D1 (SQLite) |
| Frontend | Vanilla HTML / CSS / JS |
| Package manager | pnpm |
| Deploy | GitHub Actions |

## Project Structure

```
├── public/               # Static frontend (served by Cloudflare Pages)
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── functions/            # Cloudflare Pages Functions (API routes)
│   └── api/
│       ├── _utils.js             # Shared auth + response helpers
│       ├── auth.js               # POST /api/auth
│       ├── session/
│       │   └── validate.js       # GET /api/session/validate
│       ├── kids/
│       │   ├── index.js          # GET /api/kids
│       │   └── [id].js           # PUT /api/kids/:id
│       ├── transactions/
│       │   └── index.js          # GET /api/transactions  POST /api/transactions
│       └── tags/
│           └── index.js          # GET /api/tags  POST /api/tags
├── schema.sql            # D1 schema + seed data (idempotent)
├── wrangler.toml         # Cloudflare Pages + D1 config
└── .github/workflows/
    └── deploy.yml        # Auto-deploy on push to main
```

## Local Development

**Prerequisites:** Node 18+, pnpm

```bash
pnpm install
pnpm db:init       # Apply schema to local D1
pnpm dev           # Start local dev server (localhost:8788)
```

Default password: `parent123`

## First-Time Cloudflare Setup

```bash
# 1. Login to Cloudflare
pnpm wrangler login

# 2. Create D1 database (copy the database_id from output)
pnpm db:create

# 3. Paste the database_id into wrangler.toml

# 4. Apply schema to production D1
pnpm db:init:remote

# 5. Create the Pages project (first time only)
pnpm wrangler pages project create kids-point-tracker

# 6. Deploy
pnpm pages:deploy
```

**Set the admin password** in the Cloudflare dashboard:
> Pages → kids-point-tracker → Settings → Environment variables → Add `ADMIN_PASSWORD` (mark as Encrypted)

## Automatic Deployment (GitHub Actions)

Every push to `main` automatically applies the D1 schema and redeploys the Pages app.

Add these secrets to your GitHub repo (**Settings → Secrets → Actions**):

| Secret | Where to get it |
|---|---|
| `CLOUDFLARE_API_TOKEN` | dash.cloudflare.com → My Profile → API Tokens → "Edit Cloudflare Pages" template |
| `CLOUDFLARE_ACCOUNT_ID` | Right sidebar of your Cloudflare dashboard homepage |

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Local dev server with D1 |
| `pnpm pages:deploy` | Manual deploy to Cloudflare Pages |
| `pnpm db:create` | Create D1 database (once) |
| `pnpm db:init` | Apply schema locally |
| `pnpm db:init:remote` | Apply schema to production D1 |
