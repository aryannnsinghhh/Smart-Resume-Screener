"""
SQLAlchemy database models for storing screening results
"""
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.database import Base
from datetime import datetime


class Candidate(Base):
    """Candidate/Resume information"""
    __tablename__ = "candidates"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    email = Column(String(255), index=True)
    phone = Column(String(50))
    location = Column(String(255))
    
    skills = Column(JSON)  # Store as JSON array
    certifications = Column(JSON)  # Store as JSON array
    summary = Column(Text)
    
    total_experience_years = Column(Float)
    resume_text = Column(Text)  # Store original resume text
    resume_filename = Column(String(255))
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    experiences = relationship("Experience", back_populates="candidate", cascade="all, delete-orphan")
    educations = relationship("Education", back_populates="candidate", cascade="all, delete-orphan")
    screening_records = relationship("ScreeningRecord", back_populates="candidate", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Candidate(id={self.id}, name='{self.name}', email='{self.email}')>"


class Experience(Base):
    """Work experience entries"""
    __tablename__ = "experiences"
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"), nullable=False)
    
    role = Column(String(255))
    company = Column(String(255))
    duration = Column(String(100))
    years = Column(Float)
    responsibilities = Column(JSON)  # Store as JSON array
    
    # Relationships
    candidate = relationship("Candidate", back_populates="experiences")
    
    def __repr__(self):
        return f"<Experience(role='{self.role}', company='{self.company}')>"


class Education(Base):
    """Education entries"""
    __tablename__ = "educations"
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"), nullable=False)
    
    degree = Column(String(255))
    institution = Column(String(255))
    year = Column(String(50))
    gpa = Column(String(20))
    
    # Relationships
    candidate = relationship("Candidate", back_populates="educations")
    
    def __repr__(self):
        return f"<Education(degree='{self.degree}', institution='{self.institution}')>"


class ScreeningRecord(Base):
    """Screening/evaluation records"""
    __tablename__ = "screening_records"
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"), nullable=False)
    
    job_description = Column(Text)
    job_title = Column(String(255), index=True)  # Extracted from job description
    
    # Match scoring
    match_score = Column(Integer)  # 1-10
    justification = Column(Text)
    strengths = Column(JSON)  # Store as JSON array
    concerns = Column(JSON)  # Store as JSON array
    recommended_action = Column(String(50), index=True)  # Shortlist/Maybe/Reject
    
    screened_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    candidate = relationship("Candidate", back_populates="screening_records")
    
    def __repr__(self):
        return f"<ScreeningRecord(id={self.id}, score={self.match_score}, action='{self.recommended_action}')>"
