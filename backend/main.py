from fastapi import FastAPI, UploadFile, File, Form, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from starlette.middleware.sessions import SessionMiddleware
from dotenv import load_dotenv
import PyPDF2, io, logging
from typing import Optional
from services.resume_extractor import ResumeExtractor
from backend.database import get_db, init_db
from backend.db_service import DatabaseService
from backend.config import settings

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s', handlers=[logging.FileHandler('resume_screener.log'), logging.StreamHandler()])
logger = logging.getLogger(__name__)

load_dotenv()
app = FastAPI(title="Smart Resume Screener", version="2.0")

app.add_middleware(SessionMiddleware, secret_key=settings.SESSION_SECRET_KEY, session_cookie="resume_screener_session", max_age=86400, same_site="lax", https_only=False)
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://127.0.0.1:5173"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

def is_authenticated(request: Request) -> bool:
    return request.session.get("authenticated", False)

async def require_auth(request: Request):
    if not is_authenticated(request):
        raise HTTPException(status_code=401, detail="Not authenticated")
    return True

@app.on_event("startup")
async def startup_event():
    try:
        init_db()
        logger.info("Database initialized")
    except Exception as e:
        logger.error(f"Database init failed: {e}")
        raise

@app.get("/")
def read_root():
    return {"message": "Smart Resume Screener API", "version": "2.0", "status": "running"}

@app.post("/api/login")
async def login(request: Request, username: str = Form(...), password: str = Form(...)):
    if username == settings.ADMIN_USERNAME and password == settings.ADMIN_PASSWORD:
        request.session["authenticated"] = True
        request.session["username"] = username
        return JSONResponse(content={"success": True, "message": "Login successful"})
    return JSONResponse(status_code=401, content={"success": False, "detail": "Invalid credentials"})

@app.post("/api/logout")
def logout(request: Request):
    request.session.clear()
    return JSONResponse(content={"success": True})

@app.get("/api/auth/check")
def check_auth(request: Request):
    auth = is_authenticated(request)
    return JSONResponse(content={"authenticated": auth, "username": request.session.get("username") if auth else None})

@app.post("/api/analyze/")
async def analyze_resume(file: UploadFile = File(...), job_description: str = Form(...), db: Session = Depends(get_db)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="PDF only")
    if len(job_description.strip()) < 10:
        raise HTTPException(status_code=400, detail="Job description too short")
    
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File exceeds 10MB")
    
    reader = PyPDF2.PdfReader(io.BytesIO(contents))
    text = "".join([p.extract_text() for p in reader.pages if p.extract_text()])
    if not text.strip():
        raise HTTPException(status_code=400, detail="No text extracted")
    
    result = ResumeExtractor.screen_resume(text, job_description, file.filename)
    cand_id = DatabaseService.save_screening_result(db, result, text)
    logger.info(f"Score: {result.match_score.score:.1f}/10")
    
    data = result.dict()
    data['candidate_id'] = cand_id
    # Convert datetime to ISO format string for JSON serialization
    if 'screened_at' in data and data['screened_at']:
        data['screened_at'] = data['screened_at'].isoformat()
    return JSONResponse(content=data)

@app.get("/api/candidates/")
async def get_candidates(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), _: bool = Depends(require_auth)):
    candidates = DatabaseService.get_all_candidates(db, skip, limit)
    return {"candidates": [{"id": c.id, "name": c.name, "email": c.email, "phone": c.phone, "location": c.location, "skills": c.skills, "total_experience_years": c.total_experience_years, "created_at": c.created_at.isoformat() if c.created_at else None} for c in candidates], "skip": skip, "limit": limit, "count": len(candidates)}

@app.get("/api/candidates/{candidate_id}")
async def get_candidate(candidate_id: int, db: Session = Depends(get_db)):
    c = DatabaseService.get_candidate_by_id(db, candidate_id)
    if not c:
        raise HTTPException(status_code=404, detail="Not found")
    return {"id": c.id, "name": c.name, "email": c.email, "phone": c.phone, "location": c.location, "skills": c.skills, "certifications": c.certifications, "summary": c.summary, "total_experience_years": c.total_experience_years, "resume_filename": c.resume_filename, "experiences": [{"role": e.role, "company": e.company, "duration": e.duration, "years": e.years, "responsibilities": e.responsibilities} for e in c.experiences], "educations": [{"degree": e.degree, "institution": e.institution, "year": e.year, "gpa": e.gpa} for e in c.educations], "created_at": c.created_at.isoformat() if c.created_at else None}

@app.get("/api/screenings/")
async def get_screenings(skip: int = 0, limit: int = 100, min_score: Optional[int] = None, recommended_action: Optional[str] = None, db: Session = Depends(get_db), _: bool = Depends(require_auth)):
    screenings = DatabaseService.get_screening_records(db, skip, limit, min_score, recommended_action)
    return {"screenings": [{"id": s.id, "candidate_id": s.candidate_id, "candidate_name": s.candidate.name, "candidate_email": s.candidate.email, "job_title": s.job_title, "match_score": s.match_score, "recommended_action": s.recommended_action, "justification": s.justification, "strengths": s.strengths, "concerns": s.concerns, "screened_at": s.screened_at.isoformat() if s.screened_at else None} for s in screenings], "skip": skip, "limit": limit, "count": len(screenings)}

@app.get("/api/shortlisted/")
async def get_shortlisted(limit: int = 50, db: Session = Depends(get_db)):
    results = DatabaseService.get_shortlisted_candidates(db, limit)
    return {"shortlisted_candidates": [{"candidate_id": c.id, "name": c.name, "email": c.email, "skills": c.skills, "total_experience_years": c.total_experience_years, "match_score": s.match_score, "job_title": s.job_title, "strengths": s.strengths, "screened_at": s.screened_at.isoformat() if s.screened_at else None} for c, s in results], "count": len(results)}

@app.get("/api/stats/")
async def get_stats(db: Session = Depends(get_db), _: bool = Depends(require_auth)):
    return DatabaseService.get_database_stats(db)

@app.delete("/api/candidates/{candidate_id}")
async def delete_candidate(candidate_id: int, db: Session = Depends(get_db), _: bool = Depends(require_auth)):
    result = DatabaseService.delete_candidate(db, candidate_id)
    if not result["success"]:
        raise HTTPException(status_code=404, detail=result["message"])
    return result
