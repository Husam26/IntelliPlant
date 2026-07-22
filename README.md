# 🏭 IntelliPlant — AI-Powered Industrial Knowledge Intelligence Platform

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.12+-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/LangChain-RAG-FF6F00?style=for-the-badge&logo=chainlink&logoColor=white" />
  <img src="https://img.shields.io/badge/FAISS-Vector_DB-4285F4?style=for-the-badge&logo=meta&logoColor=white" />
  <img src="https://img.shields.io/badge/Groq-LLaMA_3.3_70B-000000?style=for-the-badge" />
</p>

<p align="center">
  <strong>Transform unstructured industrial documents into actionable, AI-driven intelligence — in real-time.</strong>
</p>

---

## 📌 Problem Statement

Industrial plants generate enormous volumes of unstructured data — equipment manuals, P&IDs (Piping & Instrumentation Diagrams), SCADA telemetry logs, maintenance records, compliance reports, and safety SOPs. Plant engineers currently spend **60%+ of their time manually searching** through scattered documents to find answers during critical operations.

**IntelliPlant** solves this by creating a unified AI-powered knowledge layer that ingests all facility documentation, builds an intelligent vector index, and provides **instant, citation-backed answers** through a natural language AI Copilot — while simultaneously powering a **Digital Twin** visualization, **predictive analytics**, and **compliance tracking**.

---

## 🌟 Key Features

### 🧠 AI Copilot (Retrieval-Augmented Generation)
- Upload any industrial document (PDF, DOCX, XLSX, TXT) and **chat with it instantly**
- AI provides precise, grounded answers with **verifiable source citations** (document name, section, page)
- Powered by **LLaMA 3.3 70B** via Groq with **LangChain RAG** pipeline
- Intelligent **fallback engine** ensures zero downtime — always returns answers even during API failures
- Futuristic **Neural Scanner Loading Animation** with real-time pipeline stage indicators

### 🏭 Interactive Digital Twin
- **Drag-and-drop** asset positioning on a 2D plant map with real-time health indicators
- **Dynamic asset management** — Add, connect, reposition, and delete equipment directly from the UI
- **Animated process flow lines** showing connections between assets with pulsing health-based colors
- **No hardcoded data** — every position, connection, and asset is stored in the database
- Any new client/factory can start from a **blank canvas** and build their plant layout visually

### 📊 Intelligent Analytics Dashboard
- Auto-extracts physical assets (Pumps, Compressors, Valves, Motors) from uploaded documents using **Named Entity Recognition (NER)**
- Real-time KPI cards: Total Assets, Health Score, Open Incidents, Compliance Rate
- **Failure pattern detection** with AI-generated maintenance recommendations
- Severity distribution charts and incident trend analysis

### 📁 Smart Document Management
- Upload industrial documents with **automatic AI processing** (summarization + entity extraction)
- **FAISS vector indexing** for lightning-fast semantic search across all documents
- Documents are automatically linked to physical equipment tags (e.g., P-101, C-401)

### ✅ Compliance Tracker
- Track regulatory requirements (ISO 55000, OSHA, API 653) against asset compliance status
- Visual risk-level indicators: Compliant, Non-Compliant, Overdue
- Gap analysis with **automated audit readiness scoring**

### 📈 Predictive Insights
- AI-powered **failure pattern recognition** across the asset fleet
- Thermal anomaly detection, vibration analysis, and seal degradation tracking
- Maintenance recommendations ranked by **severity and recurrence count**

### 🌐 Premium Landing Page
- Responsive, dark/light mode landing page with **Three.js bioluminescent particle background**
- Asymmetric Bento Grid showcasing platform capabilities
- Interactive AI Copilot preview with live step-by-step demonstration
- Footer pages: Privacy Policy, Terms of Service, Enterprise Security, System Status

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React 19 + Vite 8)            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────────┐ │
│  │Dashboard │ │AI Copilot│ │Documents │ │   Digital Twin     │ │
│  │(KPIs)    │ │(RAG Chat)│ │(Upload)  │ │   (Plant Map)      │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────────┬───────────┘ │
│       │             │            │                │             │
│  ┌────┴─────────────┴────────────┴────────────────┴──────────┐  │
│  │                  Axios API Service Layer                   │  │
│  └────────────────────────────┬───────────────────────────────┘  │
└───────────────────────────────┼──────────────────────────────────┘
                                │ REST API (HTTP)
┌───────────────────────────────┼──────────────────────────────────┐
│                        BACKEND (FastAPI)                        │
│  ┌────────────────────────────┴──────────────────────────────┐  │
│  │                   API Router Layer                         │  │
│  │  /api/chat  /api/assets  /api/documents  /api/analytics   │  │
│  └────┬──────────────┬──────────────┬──────────────┬─────────┘  │
│       │              │              │              │             │
│  ┌────┴────┐   ┌─────┴────┐  ┌─────┴─────┐  ┌────┴─────┐      │
│  │LLM      │   │Entity    │  │Document   │  │Analytics │      │
│  │Service  │   │Extractor │  │Processor  │  │Engine    │      │
│  │(Groq/   │   │(NER)     │  │(PDF/DOCX) │  │(Patterns)│      │
│  │ Gemini) │   └──────────┘  └───────────┘  └──────────┘      │
│  └────┬────┘                                                    │
│       │                                                         │
│  ┌────┴──────────────────────────────────────────────────────┐  │
│  │              FAISS Vector Store (CPU)                      │  │
│  │        Sentence-Transformers (all-MiniLM-L6-v2)           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   SQLite Database                          │  │
│  │  Assets │ Incidents │ Documents │ Compliance │ Entities   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19, Vite 8, React Router 7 | SPA with component-based architecture |
| **UI Framework** | Custom CSS (Glassmorphism), Lucide Icons | Premium dark-mode industrial control room UI |
| **3D Effects** | Three.js | Bioluminescent particle background on landing page |
| **Backend** | FastAPI 0.115, Python 3.12+ | Async REST API with auto-generated Swagger docs |
| **Database** | SQLite + SQLAlchemy 2.0 | Zero-config relational storage with ORM |
| **Vector DB** | FAISS-CPU 1.14 | Facebook AI Similarity Search for document embeddings |
| **Embeddings** | Sentence-Transformers (all-MiniLM-L6-v2) | Lightweight, high-quality text embeddings |
| **LLM** | Groq (LLaMA 3.3 70B Versatile) | Ultra-fast inference for RAG answers |
| **RAG Framework** | LangChain 0.3 | Orchestrates retrieval, context assembly, and generation |
| **Doc Processing** | PyPDF2, python-docx, openpyxl | Multi-format document text extraction |

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.12+**
- **Node.js 18+**
- **Groq API Key** (free at [console.groq.com](https://console.groq.com))

### 1. Clone the Repository
```bash
git clone https://github.com/Husam26/IntelliPlant.git
cd IntelliPlant
```

### 2. Setup Backend
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Configure Environment
Create a `.env` file in the project root:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Seed Demo Data (Recommended)
```bash
cd backend
python seed_demo_data.py
```
This populates the database with 7 industrial assets, 4 incidents, and 4 compliance records for a realistic demonstration.

### 5. Start Backend Server
```bash
uvicorn app.main:app --reload
```
Backend runs at `http://localhost:8000` | Swagger Docs at `http://localhost:8000/docs`

### 6. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

### 7. One-Click Start (Windows)
```bash
run_project.bat
```

---

## 📂 Project Structure

```
IntelliPlant/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application entry point
│   │   ├── config.py            # Environment configuration (Pydantic Settings)
│   │   ├── database.py          # SQLAlchemy engine & session management
│   │   ├── models/
│   │   │   └── models.py        # ORM models (Asset, Document, Incident, etc.)
│   │   ├── schemas/
│   │   │   └── schemas.py       # Pydantic request/response schemas
│   │   ├── routers/
│   │   │   ├── assets.py        # CRUD endpoints for assets + Digital Twin
│   │   │   ├── chat.py          # RAG-powered AI Copilot endpoint
│   │   │   ├── documents.py     # Document upload & processing
│   │   │   ├── analytics.py     # Dashboard KPIs & pattern detection
│   │   │   └── search.py        # Semantic search endpoint
│   │   ├── services/
│   │   │   ├── llm_service.py   # LangChain RAG pipeline + Groq integration
│   │   │   ├── document_processor.py  # PDF/DOCX/XLSX parsing & FAISS indexing
│   │   │   └── entity_extractor.py    # NER for equipment tag extraction
│   │   └── utils/
│   ├── seed_demo_data.py        # Demo data seeder script
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Root router & layout
│   │   ├── pages/
│   │   │   ├── Landing.jsx      # Public landing page
│   │   │   ├── Dashboard.jsx    # Analytics dashboard
│   │   │   ├── Copilot.jsx      # AI chat interface
│   │   │   ├── Documents.jsx    # Document management
│   │   │   ├── Assets.jsx       # Asset registry
│   │   │   ├── Compliance.jsx   # Compliance tracker
│   │   │   ├── Insights.jsx     # Predictive insights
│   │   │   ├── PlantMap.jsx     # Digital Twin (interactive plant map)
│   │   │   └── InfoPages.jsx    # Privacy, Terms, Security, Status
│   │   ├── components/
│   │   │   ├── layout/Sidebar.jsx
│   │   │   ├── HeroMockup.jsx
│   │   │   └── WhiteboardBioluminescent.jsx
│   │   ├── services/
│   │   │   └── api.js           # Axios API service layer
│   │   └── styles/              # CSS modules (Glassmorphism theme)
│   └── package.json
├── data/                        # FAISS index & uploaded documents
├── sample_docs/                 # Sample industrial documents for testing
├── .env                         # Environment variables
├── .gitignore
├── run_project.bat              # One-click Windows launcher
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/analytics/overview` | Dashboard KPI summary |
| `GET` | `/api/analytics/patterns` | AI-detected failure patterns |
| `GET` | `/api/assets` | List all assets (with filters) |
| `POST` | `/api/assets` | Create new asset (Digital Twin) |
| `PUT` | `/api/assets/{id}/position` | Update asset position on map |
| `PUT` | `/api/assets/{id}/connections` | Update asset flow connections |
| `DELETE` | `/api/assets/{id}` | Delete an asset |
| `GET` | `/api/assets/{id}/incidents` | Asset incident history |
| `POST` | `/api/chat` | Send question to AI Copilot (RAG) |
| `GET` | `/api/chat/history/{session}` | Retrieve chat history |
| `POST` | `/api/documents/upload` | Upload & process document |
| `GET` | `/api/documents` | List all documents |
| `GET` | `/api/search?q=...` | Semantic search across documents |

---

## 🎨 Screenshots & UI

### Landing Page
- Responsive dark/light mode with Three.js particle animation
- Asymmetric Bento Grid with live asset health telemetry widgets
- Interactive AI Copilot preview section

### Dashboard
- Real-time KPI cards (Total Assets, Health Score, Incidents, Compliance)
- Glassmorphism-inspired premium dark UI

### AI Copilot
- Natural language chat with industrial document intelligence
- Verifiable source citations with document name and section
- Cyber-Emerald Neural Scanner loading animation with live pipeline stages

### Digital Twin (Plant Map)
- Interactive 2D plant layout with draggable asset nodes
- Real-time health colors (Green/Amber/Red) with pulsing animations
- Add Asset modal with connection picker for process flow lines
- Edit connections from the detail panel after creation

---

## 🔑 Innovation & Differentiators

| Feature | IntelliPlant | Traditional Systems |
|---------|-------------|-------------------|
| Document Intelligence | AI-powered RAG with citations | Manual keyword search |
| Asset Monitoring | Dynamic Digital Twin | Static P&ID printouts |
| Knowledge Access | Natural language Q&A | Browse folder hierarchies |
| Compliance | Automated real-time tracking | Manual spreadsheet audits |
| Setup Time | < 5 minutes | Weeks of configuration |
| Infrastructure | Local-first (SQLite + FAISS-CPU) | Heavy enterprise servers |

---

## 👥 Team

**Team IntelliPlant** — Built during the **ETA Hackathon 2026**

---

## 📄 License

This project was built for the ETA Hackathon 2026. All rights reserved.

---

<p align="center">
  <strong>🏭 IntelliPlant — Operate your plant with certainty.</strong>
</p>
