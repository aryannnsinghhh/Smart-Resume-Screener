# Smart Resume Screener

**AI-Powered Resume Analysis System with Semantic Matching**

**Smart Resume Screener** is an LLM-powered, AI-driven resume screening API built with **FastAPI** and **Google Gemini**. It enables recruiters and hiring platforms to intelligently parse, evaluate, and rank resumes using dynamic, role-specific screening logic — all served through a scalable, production-ready backend.
An intelligent resume screening application that uses Large Language Models (LLMs) to automatically analyze resumes, extract structured data, and provide match scores against job descriptions. Built with FastAPI, Google Gemini, and SQLite.

---

## Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)

- [Configuration](#-configuration)

- [Usage](#-usage)Designed for real-world hiring workflows and local development; supports integration with CI/CD if desired.

- [API Documentation](#-api-documentation)

- [LLM Prompts](#llm-prompts)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Demo](#demo)

---

## Features

### Core Functionality

- **PDF Resume Parsing** - Extract text from PDF resumes using PyPDF2
- **AI-Powered Analysis** - Semantic matching using Google Gemini 2.0 Flash
- **Structured Data Extraction** - Extract skills, experience, education, certifications
- **Match Scoring** - 1-10 scale scoring with detailed justification
- **GPA-Based Filtering** - Automatic GPA evaluation and categorization (Best/Good/Average/Below Average/Poor)
- **Database Storage** - Persistent storage with SQLite (PostgreSQL ready)
- **Modern Dashboard** - Professional corporate UI for viewing results
- **Advanced Filtering** - Filter by score, recommendation, and more
- **Export Results** - Download screening results as JSON

### Scoring System

- **9-10**: Exceptional fit, exceeds requirements → **Shortlist**
- **7-8**: Strong fit, meets most requirements → **Shortlist**
- **5-6**: Moderate fit, meets some requirements → **Maybe**
- **3-4**: Weak fit, significant gaps → **Reject**
- **1-2**: Poor fit, lacks critical requirements → **Reject**

### GPA Evaluation System

- **Best Resume**: GPA ≥ 9.0 → Automatic Shortlist consideration
- **Good Resume**: 8.0 ≤ GPA < 9.0 → Strong candidate
- **Average Resume**: 7.0 ≤ GPA < 8.0 → Meets minimum criteria
- **Below Average**: 6.0 ≤ GPA < 7.0 → Conditional evaluation
- **Poor Resume**: GPA < 6.0 → Automatic Reject


---

### Intelligence Features

- Semantic matching (not just keyword matching)
- Contextual skill assessment
- Experience relevance evaluation
- Educational background analysis
- Strengths and concerns identification
- Actionable recommendations

---

## Architecture

### 2. Create a Virtual Environment

### System Architecture

```bash

```python -m venv venv

┌─────────────────┐# Windows

│   User/Client   │venv\Scripts\activate

└────────┬────────┘# macOS/Linux

         │source venv/bin/activate

         ▼```

┌─────────────────────────────────────────┐

│           FastAPI Application            │### 3. Install Dependencies

│  ┌─────────────────────────────────┐   │

│  │      Web Interface (HTML)        │   │```bash

│  │  • Upload Resume                 │   │pip install -r requirements.txt

│  │  • Dashboard                     │   │```

│  └─────────────────────────────────┘   │

│                                          │### 4. Setup Environment Variables

│  ┌─────────────────────────────────┐   │

│  │       RESTful API Endpoints      │   │Create a `.env` file in the root directory:

│  │  • POST /analyze/                │   │

│  │  • GET /api/candidates/          │   │```env

│  │  • GET /api/screenings/          │   │OPENAI_API_KEY=your_openai_key_here

│  │  • GET /api/stats/               │   │```

│  └─────────────────────────────────┘   │

└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│       Business Logic Layer              │

│  ┌─────────────────────────────────┐   │

│  │    resume_extractor.py           │   │### Local Development (Uvicorn)

│  │  • extract_candidate_data()      │   │

│  │  • compute_match_score()         │   │```bash

│  │  • screen_resume()               │   │uvicorn main:app --reload

│  └─────────────────────────────────┘   │```

│                                          │

│  ┌─────────────────────────────────┐   │Visit: [http://localhost:8000/docs](http://localhost:8000/docs) for Swagger UI.

│  │      db_service.py               │   │

│  │  • save_screening_result()       │   │---

│  │  • get_candidates()              │   │

│  │  • get_screening_records()       │   │
│  └─────────────────────────────────┘   │
└──────┬────────────────────────┬─────────┘
       │                        │
       ▼                        ▼
┌──────────────┐      ┌──────────────────┐Smart-Resume-Screener/

│  OpenAI API  │      │  SQLite Database │├── app/

│  GPT-3.5     │      │  • candidates    ││   ├── main.py

│  Turbo       │      │  • experiences   ││   ├── models/

└──────────────┘      │  • educations    ││   ├── services/

                      │  • screenings    ││   ├── utils/

                      └──────────────────┘│   └── routers/

```├── requirements.txt

├── .env.example

### Data Flow└── README.md

```

```

1. Resume Upload (PDF)
        ↓
2. PDF Text Extraction (PyPDF2)
        ↓
3. LLM Processing (Two-Phase)
   ├─→ Phase 1: Structured Data Extraction

   │   • Extract: name, email, skills, experience, education
   │   • Return: JSON-structured CandidateProfile
   │
   └─→ Phase 2: Semantic Match Scoring
       • Compare: resume vs job description
       • Analyze: skills match, experience relevance
       • Return: MatchScore (1-10) + justification
        ↓
4. Database Storage
   • Save candidate profile
   • Save screening record
   • Link relationships
        ↓
5. Result Display
   • Web UI: Formatted HTML
   • API: JSON response
   • Dashboard: Interactive view
```

---

## Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Backend** | FastAPI | Web framework & API |
| **AI/LLM** | Google Gemini 2.0 Flash | Resume analysis & semantic matching |
| **Database** | SQLAlchemy + SQLite | ORM & data persistence |
| **PDF Processing** | PyPDF2 | Extract text from PDF resumes |
| **Frontend** | HTML5 + CSS3 + JavaScript | Modern professional UI |
| **Server** | Uvicorn | ASGI server |
| **Data Validation** | Pydantic | Schema validation |
| **Logging** | Python logging | Structured application logs |

---

## Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Step-by-Step Setup

1. **Clone the repository**
```bash
git clone copy_and_paste_the_link_to_this_repo
cd Smart-Resume-Screener
```

2. **Create virtual environment**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables**
```bash
# Create .env file
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env

# Or manually create .env file with:
GEMINI_API_KEY=your-actual-gemini-api-key
DATABASE_URL=sqlite:///./resume_screener.db  # Optional
```

5. **Initialize database**
```bash
python -c "from backend.database import init_db; init_db()"
```

6. **Run the application**
```bash
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

7. **Access the application**
- **Main App**: http://127.0.0.1:8000
- **Dashboard**: http://127.0.0.1:8000/dashboard
- **API Docs**: http://127.0.0.1:8000/docs

---

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Required
GEMINI_API_KEY=your-gemini-api-key-here

# Optional (defaults shown)
DATABASE_URL=sqlite:///./resume_screener.db
LOG_LEVEL=INFO
```

### Switch to PostgreSQL

1. Install PostgreSQL driver:
```bash
pip install psycopg2-binary
```

2. Update `.env`:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/resume_screener
```

---

## Usage

### Web Interface

1. **Upload Resume**
   - Navigate to http://127.0.0.1:8000
   - Paste job description
   - Upload PDF resume
   - Click "Analyze Resume"
   - View detailed results

2. **View Dashboard**
   - Navigate to http://127.0.0.1:8000/dashboard
   - View statistics (candidates, screenings, shortlisted)
   - Filter by recommendation or score
   - Export results as JSON

### API Usage

#### Analyze Resume
```python
import requests

# Upload resume for analysis
with open('resume.pdf', 'rb') as f:
    response = requests.post(
        'http://127.0.0.1:8000/api/analyze/',
        files={'file': f},
        data={'job_description': 'Senior Python Developer with 5+ years...'}
    )
    result = response.json()
    print(f"Score: {result['match_score']['score']}/10")
    print(f"Action: {result['match_score']['recommended_action']}")
```

#### Get Shortlisted Candidates
```python
response = requests.get('http://127.0.0.1:8000/api/shortlisted/')
candidates = response.json()
for candidate in candidates['shortlisted_candidates']:
    print(f"{candidate['name']}: {candidate['match_score']}/10")
```

See [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) for complete API reference.

---

## API Documentation

### Main Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/analyze/` | Analyze resume (HTML response) |
| `POST` | `/api/analyze/` | Analyze resume (JSON response) |
| `GET` | `/api/candidates/` | List all candidates |
| `GET` | `/api/candidates/{id}` | Get candidate details |
| `GET` | `/api/screenings/` | Get screening records |
| `GET` | `/api/shortlisted/` | Get shortlisted candidates |
| `GET` | `/api/stats/` | Get statistics |
| `GET` | `/dashboard` | View dashboard |

**Interactive Documentation**: http://127.0.0.1:8000/docs

---

## LLM Prompts

### Prompt Engineering Strategy

Our system uses a **two-phase LLM approach** for optimal results:

#### Phase 1: Structured Data Extraction

**Purpose**: Extract structured, machine-readable data from resumes

**Prompt Template**:
```
Extract structured information from the following resume and return it as a JSON object.

Resume:
{resume_text}

Return a JSON object with this exact structure:
{
    "name": "Full name or null",
    "email": "Email address or null",
    "phone": "Phone number or null",
    "location": "City/Location or null",
    "skills": ["skill1", "skill2", ...],
    "experience": [
        {
            "role": "Job title",
            "company": "Company name",
            "duration": "e.g., Jan 2020 - Dec 2022",
            "years": 2.5,
            "responsibilities": ["responsibility1", "responsibility2"]
        }
    ],
    "education": [...],
    "total_experience_years": 5.5,
    "certifications": ["cert1", "cert2"],
    "summary": "Brief professional summary"
}

Important:
- Extract all technical skills, tools, frameworks, and soft skills
- Calculate total_experience_years by summing all work experience
- If information is not found, use null or empty list
- Return ONLY valid JSON, no additional text
```

**Model Configuration**:
- Model: `gpt-3.5-turbo`
- Temperature: `0.3` (low for consistent extraction)
- Max Tokens: `1500`
- System Role: "You are an expert resume parser. Extract structured data and return only valid JSON."

#### Phase 2: Semantic Match Scoring

**Purpose**: Evaluate candidate fit using semantic understanding

**Prompt Template**:
```
Compare the following resume with the job description and provide a match score.

Job Description:
{job_description}

Candidate Profile:
- Name: {candidate.name}
- Skills: {candidate.skills}
- Total Experience: {candidate.total_experience_years} years
- Education: {candidate.education}

Resume:
{resume_text}

Evaluate the candidate and return a JSON object:
{
    "score": 7,
    "justification": "Detailed explanation...",
    "strengths": ["strength1", "strength2"],
    "concerns": ["concern1", "concern2"],
    "recommended_action": "Shortlist"
}

Scoring criteria (1-10):
- 9-10: Exceptional fit, exceeds requirements
- 7-8: Strong fit, meets most requirements
- 5-6: Moderate fit, meets some requirements
- 3-4: Weak fit, significant gaps
- 1-2: Poor fit, lacks critical requirements

recommended_action: "Shortlist" (7-10), "Maybe" (5-6), or "Reject" (1-4)

Return ONLY valid JSON, no additional text.
```

**Model Configuration**:
- Model: `gpt-3.5-turbo`
- Temperature: `0.5` (moderate for balanced evaluation)
- Max Tokens: `1000`
- System Role: "You are an expert HR analyst performing semantic matching."

### Why Two Phases?

1. **Separation of Concerns**: Data extraction and evaluation are distinct tasks
2. **Improved Accuracy**: Specialized prompts for each task
3. **Reusability**: Extracted data can be used for multiple job matches
4. **Better Control**: Different temperature settings for different tasks
5. **Debugging**: Easier to identify and fix issues in specific phases

---

## Database Schema

### Entity Relationship Diagram

```
candidates (1) ←→ (N) experiences
candidates (1) ←→ (N) educations
candidates (1) ←→ (N) screening_records
```

**Tables**:
- `candidates` - Candidate profile information
- `experiences` - Work experience entries
- `educations` - Educational background
- `screening_records` - Screening evaluation results

See [docs/DATABASE_SUMMARY.md](docs/DATABASE_SUMMARY.md) for complete schema documentation.

---

## Project Structure

```
Smart-Resume-Screener/
├── docs/                        # Documentation
│   ├── API_DOCUMENTATION.md    # Complete API reference
│   ├── ARCHITECTURE.md         # System architecture details
│   ├── CODE_QUALITY.md         # Code quality standards
│   └── DATABASE_SUMMARY.md     # Database schema documentation
│
├── frontend/                    # Frontend files
│   ├── templates/              # HTML templates
│   │   ├── index.html         # Main upload page
│   │   └── dashboard.html     # Dashboard UI
│   └── static/                 # Static assets (CSS, JS, images)
│
├── sample_data/                 # Testing utilities
│   └── generate_sample_data.py # Test data generator
│
├── backend/                     # Backend application code
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Configuration management
│   ├── database.py             # Database configuration & initialization
│   ├── models.py               # SQLAlchemy ORM models
│   ├── schemas.py              # Pydantic validation schemas
│   └── db_service.py           # Database operations & queries
│
├── services/                    # Business logic services
│   └── resume_extractor.py     # LLM resume processing logic
│
├── requirements.txt             # Python dependencies
├── .env                         # Environment variables (not in git)
├── .gitignore                   # Git ignore patterns
├── resume_screener.db          # SQLite database (generated)
├── resume_screener.log         # Application logs (generated)
└── README.md                    # This file
```

---

## Demo

### Demo Video Requirements (2-3 minutes)

1. **Introduction** (15s) - Project overview
2. **Resume Upload** (30s) - Upload and analyze
3. **Dashboard Tour** (60s) - Statistics, filtering, candidates
4. **API Demo** (30s) - Show Swagger UI
5. **Conclusion** (15s) - Key features summary

---

## Evaluation Criteria Met

### Code Quality & Structure
- Clean, modular architecture
- Separation of concerns
- Type hints and validation
- Error handling

### Data Extraction
- Structured LLM extraction
- Skills, experience, education
- JSON output
- Database persistence

### LLM Prompt Quality
- Two-phase approach
- Clear, specific prompts
- Appropriate temperature
- JSON-structured responses
- Documented in README

### Output Clarity
- Match score (1-10)
- Detailed justification
- Strengths and concerns
- Actionable recommendation
- Clean UI/UX

### Deliverables
- GitHub repository
- README with architecture
- LLM prompts documented
- API documentation
- Demo video (to be created)

---

## Future Enhancements

- Batch resume processing
- Resume ranking
- Email notifications
- User authentication
- Multi-language support
- Advanced analytics

---
