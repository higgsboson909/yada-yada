# Yada Yada — Full Stack Note & Checklist Manager

Yada Yada is a live, multi-user web app for managing notes and checklists. Each user
signs up, logs in, and gets their **own** notes and checklists — ownership is enforced
server-side, not just hidden in the UI.

It is built and deployed for real, end to end:

| What | Where |
| --- | --- |
| 🖥️ Frontend (React SPA) | <https://yada-yadaa.netlify.app> |
| ⚙️ Backend API (FastAPI) | <https://yadayada-hkbycqc7acbcgcbv.southeastasia-01.azurewebsites.net> |
| 📚 Interactive API docs | <https://yadayada-hkbycqc7acbcgcbv.southeastasia-01.azurewebsites.net/scalar> |
| 🗄️ Database | Azure Database for PostgreSQL (Flexible Server) |
| 🔐 Cache | Upstash Redis (JWT logout blacklist) |
| 📦 Source | <https://github.com/higgsboson909/yada-yada> |

The "how it is deployed" section below is written from the actual Azure resources
(verified with the Azure CLI), not from guesswork.

---

## ✨ Features

**Product**
- **Accounts** — email/password signup and login. Passwords are hashed with
  Argon2 (`pwdlib`), sessions are stateless JWT bearer tokens (HS256).
- **Logout that actually logs out** — the token's `jti` is blacklisted in Redis for
  15 minutes, so a logged-out token stops working immediately.
- **Notes** — create, read, update, and delete notes (plain-text `title`/`content` stored server-side, edited in the client).
- **Checklists** — create checklists, add checklist items, tick them done.
- **Per-user data isolation** — every query and mutation is scoped to the
  authenticated user id in the service layer, so users can never read or mutate
  another user's rows.
- **Single-page app** — instant navigation, server state via TanStack Query (cache invalidation after mutations), error/empty/loading states throughout, delete-confirmation dialogs.

**Developer experience**
- Async-first FastAPI backend with a layered architecture (router → schema →
  service → data/model) and dependency-injected services.
- Fully typed Python (type hints + Pydantic v2 validation) and TypeScript frontend.
- Scalar-powered interactive API documentation at `/scalar`.
- Local development with `docker compose` (Postgres + Redis) — no cloud needed.

---

## 🧱 Tech Stack

### Backend (`backend/app`)
- **Python 3.14** · **FastAPI 0.141** (async)
- **SQLModel 0.0.39** (SQLAlchemy 2 + Pydantic 2) for models
- **asyncpg** PostgreSQL driver, `psycopg2-binary` for Alembic sync tooling
- **Alembic 1.19** — schema is managed with migrations (`alembic/versions/`)
- **PyJWT** (HS256) + **pwdlib[argon2]** for auth
- **redis (async, hiredis)** — JWT blacklist
- **Scalar FastAPI** — `/scalar` docs

### Frontend (`frontend/vite-project`)
- **React 19** + **TypeScript ~6.0** + **Vite 8**
- **React Router 7** · **TanStack Query 5** · **React Hook Form + Zod**
- **Tailwind CSS 4** (via `@tailwindcss/vite`) with a token-based design system
  (`src/components/styles.ts`, `ui.tsx`) and **lucide-react** icons

### Infrastructure / DevOps
- Azure App Service (Linux) · Azure Database for PostgreSQL Flexible Server ·
  Upstash Redis · Netlify · GitHub Actions · Docker Compose (local)

---

## 🏗️ Project Structure

```
yada-yada/
├── backend/
│   └── app/
│       ├── api/
│       │   ├── routers/          # Endpoint definitions (notes, checklists,
│       │   │                     #  checklist_items, users)
│       │   ├── schemas/          # Pydantic request/response models
│       │   ├── core/security.py  # JWT encode/decode helpers
│       │   ├── deps.py           # DI: current user, services
│       │   └── router.py         # master_router assembly
│       ├── models/               # SQLModel tables (user, notes, checklists, ...)
│       ├── services/             # Business logic — every query is user-scoped
│       ├── data/                 # session.py (async engine) + redis.py (blacklist)
│       ├── alembic/              # DB migrations (versions/0001_initial.py)
│       ├── config.py             # pydantic-settings, reads backend/app/.env
│       ├── main.py               # FastAPI app, CORS, exception handlers
│       ├── requirements.txt      # pinned export (used by CI + App Service)
│       └── pyproject.toml        # project + deps (uv)
├── frontend/
│   └── vite-project/
│       ├── src/
│       │   ├── api.ts            # typed fetch client, bearer-token handling
│       │   ├── App.tsx           # routes: /login, /signup, /app
│       │   ├── components/       # Auth, Workspace, NoteEditor, Checklist* ...
│       │   └── main.tsx          # React Query provider
│       ├── public/_redirects     # SPA fallback for Netlify
│       ├── index.html
│       └── package.json
├── .github/workflows/main_yadayada.yml   # CI/CD → Azure App Service
├── docker-compose.yml                    # local Postgres 17 + Redis 8
└── README.md
```

---

## 🚀 Local Development

### Prerequisites

- **Python 3.14** and **uv** (see `backend/app/.python-version`)
- **Node.js 20.19+ / 22.12+** (Vite 8 requirement) and **npm**
- **Docker** (for the local Postgres + Redis)

### 1. Start local Postgres and Redis

```bash
docker compose up -d
```

This runs the stack defined in `docker-compose.yml`:

| Service | Image | Local endpoint | Credentials (dev only) |
| --- | --- | --- | --- |
| PostgreSQL | `postgres:17-alpine` | `localhost:5432` | `yada_user` / `postgres` / db `yada_yada_db` |
| Redis | `redis:8-alpine` | `localhost:6379` | — |

### 2. Run the backend

```bash
cd backend/app
uv sync                # install deps from pyproject/uv.lock
```

Create `backend/app/.env` (this file is gitignored — see note below):

```env
POSTGRES_SERVER=localhost
POSTGRES_USER=yada_user
POSTGRES_PASSWORD=postgres
POSTGRES_DB=yada_yada_db
POSTGRES_PORT=5432

REDIS_URL=redis://localhost:6379

JWT_SECRET=generate-a-long-random-string
JWT_ALGORITHM=HS256
```

Apply the schema, then start the server (`uv run` keeps everything inside the
project venv):

```bash
uv run alembic upgrade head   # applies alembic/versions/ migrations
uv run fastapi run main.py
```

- API: <http://localhost:8000>
- Health check: <http://localhost:8000/> → `{"name": "Yada Yada API", "status": "ok"}`
- Docs: <http://localhost:8000/scalar>

> **Environment variable note.** `config.py` loads `.env` from
> `backend/app/.env`. `.env` and `.env.example` files are **gitignored** on
> purpose; `.env.example` exists only as a checklist of required variables and
> may drift — the authoritative source is `backend/app/config.py`
> (`SecuritySettings`, `DatabaseSettings`) plus the frontend's
> `frontend/vite-project/.env.example`.

### 3. Run the frontend

```bash
cd frontend/vite-project
npm install
npm run dev
```

Open <http://localhost:5173>. During dev, Vite proxies `/user`, `/notes`,
`/checklists`, and `/checklist_items` to `http://localhost:8000`, and the backend
CORS allowlist (`main.py`) includes `http://localhost:5173`.

### Checks

```bash
# frontend
npm run lint
npm run build

# backend — start/import sanity
cd backend/app && uv run python -c "import app.main"
```

There is no automated backend test suite yet (see Roadmap).

---

## 🔌 API Overview

Interactive docs: `/scalar` (or the production URL above).

Authentication is OAuth2-style: the frontend sends
`Authorization: Bearer <access_token>` for every data call. All note, checklist,
and checklist-item endpoints require a token **and** are scoped to the calling
user — passing someone else's id returns 404/403, never their data.

### Auth — `/user`

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/user/signup` | Create account (`name`, `email`, `password`) |
| `POST` | `/user/token` | Login — form fields `username` (email) + `password` → `{access_token, type: "jwt"}` |
| `POST` | `/user/logout` | Blacklist the current token's `jti` in Redis |

### Notes — `/notes` (bearer required)

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/notes/` | List my notes |
| `GET` | `/notes/{id}` | Get one of my notes |
| `POST` | `/notes/create/` | Create a note (201) |
| `PATCH` | `/notes/{id}` | Update title/content |
| `DELETE` | `/notes/{id}` | Delete |

### Checklists — `/checklists` (bearer required)

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/checklists/` | List my checklists |
| `GET` | `/checklists/{id}` | Get one checklist |
| `POST` | `/checklists/create` | Create (201) |
| `PATCH` | `/checklists/{id}` | Rename |
| `DELETE` | `/checklists/{id}` | Delete |

### Checklist items — `/checklist_items` (bearer required)

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/checklist_items/{checklist_id}` | Items of one of my checklists |
| `POST` | `/checklist_items/{checklist_id}/create` | Add an item (201) |
| `PATCH` | `/checklist_items/{checklist_item_id}` | Edit / toggle `is_done` |
| `DELETE` | `/checklist_items/{checklist_item_id}` | Remove |

Error responses are `{"message": "..."}` JSON (custom exception handlers in
`main.py` for 404s and database errors).

---

## 🗄️ Data Model

Schema is defined in `backend/app/models/` (SQLModel) and materialized by Alembic
migration `alembic/versions/0001_initial.py`. All primary keys are UUIDs
(defaulted server-side by the app via `uuid4`).

```
user                          notes                        checklists
────────────                  ─────                        ──────────
id          UUID PK  ◄──┐     id          UUID PK          id         UUID PK
name        text         │     title       text            title      text
email       text,unique  ├──── user_id     UUID FK ────►   user_id    UUID FK ────► user.id
password_hash text       │        │                             │
                         │        └── user_id FK ────────────────┘
                         └──►     checklists.user_id references user.id

checklist_items
───────────────
id           UUID PK
title        text
is_done      bool (default false)
checklist_id UUID FK ────► checklists.id
```

Ownership is a first-class column (`user_id`) on notes and checklists; checklist
items inherit it through their parent checklist. Services always filter on
`user.id`, so cross-user access is denied at the data layer.

---

## 🏛️ Architecture

### Backend (layered, async)

```
HTTP request
   │
   ▼
API layer   api/routers/*.py   routes + status codes, FastAPI deps
   ▼
Schema layer api/schemas/*.py  Pydantic validation of request/response
   ▼
Service layer services/*.py    business rules + USER-SCOPED queries
   ▼
Data layer  data/session.py    async SQLAlchemy engine / sessions
   ▼
Model layer models/*.py        SQLModel tables (SQLAlchemy 2)
   ▼
PostgreSQL (asyncpg, TLS)      persistence
```

- **Dependency injection** — `api/deps.py` resolves the current user from the
  JWT (`userDep`) and hands services to routers.
- **Auth flow** — login verifies the Argon2 hash and mints a JWT (`core/security.py`)
  carrying `sub` (user id) and `jti`. Logout stores `jti` in Redis
  (`data/redis.py`) for 15 minutes; `userDep` rejects blacklisted tokens.
- **Migrations over `create_all`** — `main.py` deliberately does **not** create
  tables at startup; schema changes ship as Alembic revisions.
- **CORS** — allowlist in `main.py`: `http://localhost:5173` (dev) and
  `https://yada-yadaa.netlify.app` (production frontend).

### Frontend (React SPA)

- **Routing** — React Router 7: `/login`, `/signup`, and `/app` (protected);
  unknown paths redirect based on whether a token exists.
- **Server state** — TanStack Query with `queryKey`s like `["notes"]`,
  `["checklists"]`; mutations invalidate caches after create/update/delete.
- **API client** — `src/api.ts`: typed `fetch` wrapper that attaches the bearer
  token, and on a `401` clears it and dispatches a `yada:unauthorized` event so
  the UI logs out.
- **Forms** — React Hook Form + Zod (signup/login and note editor).
- **Design** — Tailwind 4 utility classes plus colocated token constants
  (`components/styles.ts` exports `buttonClass`, `inputClass`, …) and shared
  primitives (`components/ui.tsx`); no global CSS sprawl.

---

## ☁️ Deployment (current, live)

Everything below reflects the real production state, checked with the Azure CLI
(`az resource list`, `az webapp ...`, `az postgres flexible-server ...`).

### Topology

```
GitHub (main)
   │  push
   ▼
GitHub Actions ──► Azure App Service "yadayada" (FastAPI, Python 3.14)
   main_yadayada.yml        │
                            │ env vars
        ┌───────────────────┼─────────────────────────┐
        ▼                   ▼                         ▼
Azure PostgreSQL      Upstash Redis              Netlify (frontend)
Flexible Server       (JWT blacklist)            yada-yadaa.netlify.app
yadayada.postgres.          │                     (React SPA build)
database.azure.com          │
        └───────────────────┴── CORS allowlist: https://yada-yadaa.netlify.app
```

| Piece | Resource | Details (from Azure CLI) |
| --- | --- | --- |
| Backend host | **Azure App Service** — Linux app `yadayada`, resource group `yadagroup`, region **Southeast Asia** | Runtime `PYTHON\|3.14` on App Service plan `ASP-yadagroup-9ec6` (**B1, Basic**); HTTPS only, TLS ≥ 1.2, FTPS only. Public URL: `https://yadayada-hkbycqc7acbcgcbv.southeastasia-01.azurewebsites.net` |
| Database | **Azure Database for PostgreSQL — Flexible Server** `yadayada` | `yadayada.postgres.database.azure.com`, **PostgreSQL 18**, SKU `Standard_B1ms` (Burstable), public access enabled; the app connects over TLS (`?ssl=require` in `config.py`). Server admin db is `postgres`, user `yadayada`. |
| Cache | **Upstash Redis** (managed) | TLS endpoint (`rediss://...`), configured via the `REDIS_URL` app setting; only used for the JWT logout blacklist |
| Frontend | **Netlify** | <https://yada-yadaa.netlify.app>. React SPA build (publish dir `dist`); SPA fallback via `public/_redirects` (`/* /index.html 200`); the deployed bundle points at the Azure API through `VITE_API_URL` baked in at build time |
| CI/CD | **GitHub Actions** | `.github/workflows/main_yadayada.yml` — see below |

### How the backend reaches production

The App Service gets everything it needs from **app settings only** (no secrets in
the repo). The live settings are: `POSTGRES_SERVER`, `POSTGRES_USER`,
`POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT`, `REDIS_URL`,
`JWT_SECRET`, `JWT_ALGORITHM`, plus `SCM_DO_BUILD_DURING_DEPLOYMENT=1` (Oryx
build). Rotate secrets by updating these settings — never in code.

### CI/CD pipeline (`.github/workflows/main_yadayada.yml`)

1. Triggered on **push to `main`** (or `workflow_dispatch`).
2. **Build job** — checks out the repo, sets up **Python 3.14**, creates a venv
   in `backend/app`, `pip install -r requirements.txt`, and uploads the
   `backend/` tree as an artifact.
3. **Deploy job** — `azure/webapps-deploy@v3` deploys to app `yadayada`
   (slot `Production`) using the publish profile stored in the
   `AZUREAPPSERVICE_PUBLISHPROFILE_*` GitHub secret.

To ship a backend change: merge to `main` and watch the workflow — the API at
the `azurewebsites.net` URL is updated automatically.

### Shipping a frontend change

The frontend is **not** part of the GitHub Actions workflow — it deploys from
Netlify (via the Netlify UI/CLI). Build it with the API origin set, then publish
`dist`:

```bash
cd frontend/vite-project
npm install
VITE_API_URL=https://yadayada-hkbycqc7acbcgcbv.southeastasia-01.azurewebsites.net npm run build
# then deploy ./dist to Netlify (netlify deploy --prod or the Netlify dashboard)
```

If the API ever moves to a different origin, update `VITE_API_URL` **and** the
CORS allowlist in `backend/app/main.py`, then redeploy both.

---

## 🗺️ Roadmap / Status

Done and deployed on `main`:

- [x] Frontend implementation (React SPA) — deployed to Netlify
- [x] User authentication & per-user data isolation (JWT + server-scoped queries)
- [x] Local Docker Compose dev environment (Postgres + Redis)
- [x] Backend CI/CD to Azure App Service; PostgreSQL + Upstash Redis wiring

Still open:

- [ ] Automated backend test suite (route + cross-user denial tests)
- [ ] Tags / categories and search & filtering
- [ ] Sharing / collaboration
- [ ] Real-time sync (today's UI is instant, but not collaborative)
- [ ] Cloud backup / export

---

## 📚 Docs & Links

- [Backend README](./backend/app/README.md) — API + backend notes
- [Frontend README](./frontend/vite-project/README.md) — frontend scripts and env vars
- [Frontend design notes](./frontend/vite-project/DESIGN.md) — design system decisions
- Interactive API docs — `/scalar` (live: [production Scalar](https://yadayada-hkbycqc7acbcgcbv.southeastasia-01.azurewebsites.net/scalar))
- Repo conventions — [AGENTS.md](./AGENTS.md)

No LICENSE file is present in the repository.
