# TravelPlanner Backend (FastAPI + PostgreSQL)

## Quick start with Docker (DB only)

1. Start PostgreSQL:

```bash
docker compose up -d db
```

2. Create a Python virtualenv, install deps, and run the API:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export $(cat ../.env 2>/dev/null | xargs)  # optional if you created .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at http://localhost:8000

## Environment variables

Use `.env` at the project root or set env vars directly:

- `DB_USER` (default: travel_user)
- `DB_PASSWORD` (default: travel_pass)
- `DB_HOST` (default: localhost)
- `DB_PORT` (default: 5432)
- `DB_NAME` (default: travel_db)
- Or a full `DATABASE_URL`, e.g. `postgresql+psycopg2://user:pass@host:5432/dbname`

## API Endpoints

- `POST /trips/` – create a trip
- `GET /trips/` – list trips
- `GET /trips/{id}` – get a trip
- `PATCH /trips/{id}` – update notes and important items

CORS is enabled for all origins for local development. 