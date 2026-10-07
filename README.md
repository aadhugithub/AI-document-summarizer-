# AI Document Summarizer 📄🤖

An AI-powered document summarization application built with a **Django** backend and a **React (Vite)** frontend.

## 🚀 Features

- **Document Processing**: Upload documents (PDFs, text) for AI summarization.
- **RESTful API**: Fast and modular Django API endpoints for handling document uploads and summary fetching.
- **Modern UI**: Interactive React frontend built with Vite.

## 📁 Project Structure

```
├── backend/       # Django backend (API, processing, database models)
└── frontend/      # React + Vite frontend application
```

## 🛠️ Getting Started

### Prerequisites
- Python 3.x
- Node.js & npm

### Backend Setup
1. Navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Activate virtual environment & install requirements:
   ```bash
   # Windows
   .\venv\Scripts\activate
   ```
3. Run migrations and start server:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependencies & start dev server:
   ```bash
   npm install
   npm run dev
   ```

## 🌿 Git Branching Strategy

This project follows a structured branching model:

- **`main`**: Production branch. Always stable, fully working, and deployed.
- **`feature` / `feature/<feature-name>`**: Used for developing a single feature or screen.
- **`fix` / `fix/<bug-name>`**: Used for bug fixes and hotfixes.

### Workflow Guidelines:
1. **New Feature**: Create a branch off `main` or `feature`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Bug Fix**: Create a branch off `main`:
   ```bash
   git checkout -b fix/your-bug-name
   ```
3. **Merging**: Merge verified `feature` or `fix` branches into `main` after testing:
   ```bash
   git checkout main
   git merge feature/your-feature-name
   git push origin main
   ```

