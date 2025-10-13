"""
Pydantic schemas for structured resume data
"""
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime


class Experience(BaseModel):
    """Work experience entry"""
    role: str = Field(..., description="Job title/role")
    company: str = Field(..., description="Company name")
    duration: Optional[str] = Field(None, description="Duration (e.g., '2 years', 'Jan 2020 - Dec 2022')")
    years: Optional[float] = Field(None, description="Approximate years in this role")
    responsibilities: Optional[List[str]] = Field(default_factory=list, description="Key responsibilities")


class Education(BaseModel):
    """Education entry"""
    degree: str = Field(..., description="Degree name (e.g., 'BS Computer Science')")
    institution: str = Field(..., description="School/University name")
    year: Optional[str] = Field(None, description="Graduation year or duration")
    gpa: Optional[str] = Field(None, description="GPA if mentioned")


class CandidateProfile(BaseModel):
    """Structured candidate data extracted from resume"""
    name: Optional[str] = Field(None, description="Candidate full name")
    email: Optional[str] = Field(None, description="Email address")
    phone: Optional[str] = Field(None, description="Phone number")
    location: Optional[str] = Field(None, description="Location/City")
    
    skills: List[str] = Field(default_factory=list, description="Technical and soft skills")
    experience: List[Experience] = Field(default_factory=list, description="Work experience entries")
    education: List[Education] = Field(default_factory=list, description="Education history")
    
    total_experience_years: Optional[float] = Field(None, description="Total years of professional experience")
    certifications: Optional[List[str]] = Field(default_factory=list, description="Professional certifications")
    summary: Optional[str] = Field(None, description="Professional summary/bio")


class MatchScore(BaseModel):
    """Resume-Job match scoring"""
    score: float = Field(..., ge=1.0, le=10.0, description="Match score from 1.0-10.0")
    justification: str = Field(..., description="Detailed explanation of the score")
    strengths: List[str] = Field(default_factory=list, description="Candidate strengths")
    concerns: List[str] = Field(default_factory=list, description="Areas of concern")
    recommended_action: str = Field(..., description="Recommendation: 'Shortlist', 'Maybe', or 'Reject'")


class ScreeningResult(BaseModel):
    """Complete screening result"""
    candidate: CandidateProfile
    match_score: MatchScore
    job_description: str
    screened_at: datetime = Field(default_factory=datetime.now)
    resume_filename: str
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }
