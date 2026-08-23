# Senka – Luxury Jewellery & Fashion Studio

A premium jewelry and fashion storefront built with Next.js, FastAPI, and PostgreSQL.

## Stack
- Frontend: Next.js 14 + TypeScript
- Backend: Python FastAPI
- Database: PostgreSQL
- Auth: JWT, admin and customer roles
- Payment: PKR-ready abstraction for Pakistan payment providers
- SEO: metadata, robots, sitemap, OG tags
- Admin: products, orders, inventory, user management

## Folder structure
```txt
Senka/
├─ frontend/
│  ├─ app/
│  ├─ public/
│  ├─ package.json
│  ├─ tsconfig.json
│  ├─ next.config.mjs
│  └─ .env.example
├─ backend/
│  ├─ app/
│  ├─ tests/
│  ├─ requirements.txt
│  └─ .env.example
├─ database/
│  └─ schema.sql
├─ docs/
│  ├─ PROJECT_LOG.md
│  └─ LAUNCH_CHECKLIST.md
├─ docker-compose.yml
├─ .gitignore
├─ README.md
└─ .env.example
```

## Quick start

### 1) Start Postgres
```bash
docker-compose up -d db
```

### 2) Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### 3) Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Payment note
For Pakistan, the real payment gateway must be selected through an approved local merchant account capable of PKR and card processing. This project includes a payment abstraction and mock provider for local testing.

## Production recommendation
- Frontend: Vercel
- Backend: Render or Railway
- Database: managed PostgreSQL
- Storage: Cloudinary or S3
- Domain: your purchased domain and hosting
