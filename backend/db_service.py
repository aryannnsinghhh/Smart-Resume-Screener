"""
Database service layer for CRUD operations
"""
from sqlalchemy.orm import Session
from backend.models import Candidate, Experience, Education, ScreeningRecord
from backend.schemas import CandidateProfile, ScreeningResult
from typing import List, Optional
from datetime import datetime


class DatabaseService:
    """Service for database operations"""
    
    @staticmethod
    def save_screening_result(db: Session, screening_result: ScreeningResult, resume_text: str) -> int:
        """
        Save complete screening result to database
        
        Args:
            db: Database session
            screening_result: ScreeningResult object from resume_extractor
            resume_text: Original resume text
            
        Returns:
            int: Candidate ID
        """
        candidate_data = screening_result.candidate
        match_data = screening_result.match_score
        
        # Check if candidate already exists (by email)
        existing_candidate = None
        if candidate_data.email:
            existing_candidate = db.query(Candidate).filter(
                Candidate.email == candidate_data.email
            ).first()
        
        if existing_candidate:
            # Update existing candidate
            candidate = existing_candidate
            candidate.name = candidate_data.name or candidate.name
            candidate.phone = candidate_data.phone or candidate.phone
            candidate.location = candidate_data.location or candidate.location
            candidate.skills = candidate_data.skills
            candidate.certifications = candidate_data.certifications
            candidate.summary = candidate_data.summary
            candidate.total_experience_years = candidate_data.total_experience_years
            candidate.resume_text = resume_text
            candidate.resume_filename = screening_result.resume_filename
            candidate.updated_at = datetime.utcnow()
            
            # Delete old experiences and educations
            db.query(Experience).filter(Experience.candidate_id == candidate.id).delete()
            db.query(Education).filter(Education.candidate_id == candidate.id).delete()
        else:
            # Create new candidate
            candidate = Candidate(
                name=candidate_data.name,
                email=candidate_data.email,
                phone=candidate_data.phone,
                location=candidate_data.location,
                skills=candidate_data.skills,
                certifications=candidate_data.certifications,
                summary=candidate_data.summary,
                total_experience_years=candidate_data.total_experience_years,
                resume_text=resume_text,
                resume_filename=screening_result.resume_filename
            )
            db.add(candidate)
            db.flush()  # Get candidate ID
        
        # Add experiences
        for exp_data in candidate_data.experience:
            experience = Experience(
                candidate_id=candidate.id,
                role=exp_data.role,
                company=exp_data.company,
                duration=exp_data.duration,
                years=exp_data.years,
                responsibilities=exp_data.responsibilities
            )
            db.add(experience)
        
        # Add educations
        for edu_data in candidate_data.education:
            education = Education(
                candidate_id=candidate.id,
                degree=edu_data.degree,
                institution=edu_data.institution,
                year=edu_data.year,
                gpa=edu_data.gpa
            )
            db.add(education)
        
        # Add screening record
        screening_record = ScreeningRecord(
            candidate_id=candidate.id,
            job_description=screening_result.job_description,
            job_title=DatabaseService._extract_job_title(screening_result.job_description),
            match_score=match_data.score,
            justification=match_data.justification,
            strengths=match_data.strengths,
            concerns=match_data.concerns,
            recommended_action=match_data.recommended_action
        )
        db.add(screening_record)
        
        db.commit()
        db.refresh(candidate)
        
        return candidate.id
    
    @staticmethod
    def _extract_job_title(job_description: str) -> str:
        """Extract job title from job description (first line usually)"""
        lines = job_description.strip().split('\n')
        return lines[0][:255] if lines else "Unknown Position"
    
    @staticmethod
    def get_all_candidates(db: Session, skip: int = 0, limit: int = 100) -> List[Candidate]:
        """Get all candidates with pagination"""
        return db.query(Candidate).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_candidate_by_id(db: Session, candidate_id: int) -> Optional[Candidate]:
        """Get candidate by ID with all related data"""
        return db.query(Candidate).filter(Candidate.id == candidate_id).first()
    
    @staticmethod
    def get_candidate_by_email(db: Session, email: str) -> Optional[Candidate]:
        """Get candidate by email"""
        return db.query(Candidate).filter(Candidate.email == email).first()
    
    @staticmethod
    def get_screening_records(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        min_score: Optional[int] = None,
        recommended_action: Optional[str] = None
    ) -> List[ScreeningRecord]:
        """
        Get screening records with optional filters
        
        Args:
            db: Database session
            skip: Number of records to skip (pagination)
            limit: Maximum number of records to return
            min_score: Minimum match score filter
            recommended_action: Filter by action (Shortlist/Maybe/Reject)
        """
        query = db.query(ScreeningRecord)
        
        if min_score is not None:
            query = query.filter(ScreeningRecord.match_score >= min_score)
        
        if recommended_action:
            query = query.filter(ScreeningRecord.recommended_action == recommended_action)
        
        return query.order_by(ScreeningRecord.screened_at.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_candidate_screening_history(db: Session, candidate_id: int) -> List[ScreeningRecord]:
        """Get all screening records for a specific candidate"""
        return db.query(ScreeningRecord).filter(
            ScreeningRecord.candidate_id == candidate_id
        ).order_by(ScreeningRecord.screened_at.desc()).all()
    
    @staticmethod
    def search_candidates_by_skill(db: Session, skill: str) -> List[Candidate]:
        """Search candidates who have a specific skill"""
        # SQLite JSON search (for PostgreSQL, use different syntax)
        return db.query(Candidate).filter(
            Candidate.skills.contains(skill)
        ).all()
    
    @staticmethod
    def get_shortlisted_candidates(db: Session, limit: int = 50) -> List[tuple]:
        """
        Get shortlisted candidates with their latest screening scores
        
        Returns list of (Candidate, ScreeningRecord) tuples
        """
        from sqlalchemy import and_
        
        # Subquery to get latest screening for each candidate
        subquery = db.query(
            ScreeningRecord.candidate_id,
            ScreeningRecord.id.label('latest_screening_id')
        ).filter(
            ScreeningRecord.recommended_action == 'Shortlist'
        ).group_by(
            ScreeningRecord.candidate_id
        ).subquery()
        
        # Join to get full records
        results = db.query(Candidate, ScreeningRecord).join(
            subquery,
            Candidate.id == subquery.c.candidate_id
        ).join(
            ScreeningRecord,
            ScreeningRecord.id == subquery.c.latest_screening_id
        ).order_by(
            ScreeningRecord.match_score.desc()
        ).limit(limit).all()
        
        return results
    
    @staticmethod
    def get_database_stats(db: Session) -> dict:
        """Get database statistics"""
        total_candidates = db.query(Candidate).count()
        total_screenings = db.query(ScreeningRecord).count()
        shortlisted = db.query(ScreeningRecord).filter(
            ScreeningRecord.recommended_action == 'Shortlist'
        ).count()
        maybe = db.query(ScreeningRecord).filter(
            ScreeningRecord.recommended_action == 'Maybe'
        ).count()
        rejected = db.query(ScreeningRecord).filter(
            ScreeningRecord.recommended_action == 'Reject'
        ).count()
        
        return {
            "total_candidates": total_candidates,
            "total_screenings": total_screenings,
            "shortlisted": shortlisted,
            "maybe": maybe,
            "rejected": rejected
        }
    
    @staticmethod
    def delete_candidate(db: Session, candidate_id: int) -> dict:
        """
        Delete a candidate and all related records (cascade delete)
        Returns dict with deletion summary
        """
        # Get the candidate first
        candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
        if not candidate:
            return {"success": False, "message": "Candidate not found"}
        
        candidate_name = candidate.name
        
        # Count related records before deletion
        experiences_count = db.query(Experience).filter(Experience.candidate_id == candidate_id).count()
        educations_count = db.query(Education).filter(Education.candidate_id == candidate_id).count()
        screenings_count = db.query(ScreeningRecord).filter(ScreeningRecord.candidate_id == candidate_id).count()
        
        # Delete related records (SQLAlchemy will handle this if cascade is set, but explicit is better)
        db.query(Experience).filter(Experience.candidate_id == candidate_id).delete()
        db.query(Education).filter(Education.candidate_id == candidate_id).delete()
        db.query(ScreeningRecord).filter(ScreeningRecord.candidate_id == candidate_id).delete()
        
        # Delete the candidate
        db.delete(candidate)
        db.commit()
        
        return {
            "success": True,
            "message": f"Successfully deleted {candidate_name}",
            "deleted": {
                "candidate": candidate_name,
                "experiences": experiences_count,
                "educations": educations_count,
                "screenings": screenings_count
            }
        }

