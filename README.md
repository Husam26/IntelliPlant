# 🏭 IntelliPlant — AI for Industrial Knowledge Intelligence

![IntelliPlant Dashboard](https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070)

IntelliPlant is a fully-featured, demo-ready Industrial Knowledge Platform built during the **ETA Hackathon**. It transforms unstructured industrial documents (manuals, SOPs, compliance reports) into actionable intelligence using Advanced RAG (Retrieval-Augmented Generation) and Entity Extraction.

## ✨ Key Features

- **🧠 AI Copilot (RAG):** Upload any industrial document and chat with it instantly. The AI understands complex technical manuals and highlights source citations directly in its answers.
- **📊 Auto-Extracting Dashboard:** The AI automatically extracts physical assets (e.g., Pumps, Compressors, Valves) and their health status from your documents to dynamically populate the Analytics Dashboard.
- **🔍 Vector Intelligence:** Built using FAISS for lightning-fast similarity search entirely on local/CPU environments.
- **⚡ Premium UI:** An immersive, glassmorphism-inspired dark mode interface that feels like a modern industrial control room.

## 🛠️ Tech Stack

- **Frontend:** React + Vite
- **Backend:** FastAPI + SQLite
- **AI / LLM:** Google Gemini 2026 (`gemini-flash-latest`) via LangChain
- **Vector DB:** FAISS (Facebook AI Similarity Search - CPU)

---

## 🚀 Quickstart Guide

### 1. Setup Backend
Open a terminal and navigate to the backend directory:
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

**Set up your AI Key:**
Rename `.env.example` to `.env` and add your Gemini API Key:
```env
GEMINI_API_KEY=your_real_api_key_here
```

**Run the Backend Server:**
```bash
uvicorn app.main:app --reload
```

### 2. Setup Frontend
Open a **new** terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```
Open **http://localhost:5173** in your browser.

### 3. Seed Demo Data (Optional but recommended!)
To instantly populate the dashboard with realistic industrial assets without manually uploading 20 documents, run the seeder script:
```bash
cd backend
venv\Scripts\activate
python seed_demo_data.py
```
*Note: Refresh your browser after seeding.*

---

## 🏆 Hackathon Phases Completed

- **Phase 1 (Foundation):** Core React UI, FastAPI scaffold, and SQLite DB.
- **Phase 2 (Intelligence Core):** Switched to FAISS-CPU for Windows compatibility, integrated `gemini-flash-latest`, and perfected the RAG Chat pipeline with citations.
- **Phase 3 (Dashboard Wiring):** Built an automated pipeline to extract Entities/Assets using LLMs upon document upload and feed them into the live React dashboard.
- **Phase 4 (Final Polish):** Added Premium CSS glassmorphism effects, a Demo Data Seeder, and comprehensive documentation.

Made with ❤️ by Team IntelliPlant.
