# TravelPlanner - Your Personal Travel Planning Assistant

A beautiful, modern web application for planning and organizing your travel adventures. Create detailed trip itineraries, manage budgets, and organize every aspect of your journey. **Now available in English and Russian!**

## ✨ Features

### 🌍 **Multilingual Support**
- **English & Russian**: Full localization in both languages
- **Language Switching**: Easy toggle between languages with persistent settings
- **Localized Content**: All text, placeholders, and notifications in both languages
- **Cultural Adaptation**: Russian ruble (₽) currency support

### 🏠 **Home Screen**
- **Calmer & brighter** palette with higher contrast
- **Feature Highlights** with subtle cards
- **My Trips** section shows saved trips
- **Quick Access** to create new trips

### 🧭 **Trip Creation & Editing**
- **Create Trip**: comprehensive template covering all essentials
- **After Creation**: editing page with
  - Basic information (summary card)
  - Main notes editor
  - "Important" list to track key items
- **Budget tools** and validation

## 🔐 Data Storage (FastAPI + PostgreSQL)

Trips are now persisted to a local PostgreSQL database via a FastAPI backend.

### Run the database (Docker)
```bash
docker compose up -d db
```

### Run the backend API
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# optional: cp .env.example .env and edit
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
API: `http://localhost:8000`

Frontend calls the API directly. If you open `index.html` from file://, CORS is configured to allow it.

## 📋 API Summary
- `POST /trips/` – create a trip
- `GET /trips/` – list trips
- `GET /trips/{id}` – get details
- `PATCH /trips/{id}` – update notes and important items

## 🖌 Design
- Softer background, brighter surfaces, higher text contrast
- Clear cards for hero and features
- Consistent typography and spacing

## 🚀 Getting Started
1. Start DB and backend (above)
2. Open `index.html` in your browser
3. Create a trip and then edit it from "My Trips"

---

**Happy Travel Planning! ✈️🌍**

**Счастливого планирования путешествий! ✈️🌍**
