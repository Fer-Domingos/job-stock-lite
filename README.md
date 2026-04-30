# Job Stock Lite

Simple inventory control web app with Next.js + SQLite.

## Features
- Dashboard with total stock, last update, and stock table
- Entry form for IN/OUT movements
- Automatic stock recalculation
- Admin vs Viewer behavior
- Simple API endpoint: `GET /api/movements`

## Run locally
```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Roles
- Viewer (default): read-only
- Admin: send request header `x-role: admin` to enable form submit

## Deploy (Vercel)
- Framework preset: Next.js
- Build command: `npm run build`
- Start command: `npm run start`

> SQLite data file (`inventory.sqlite`) is local to the runtime filesystem.
