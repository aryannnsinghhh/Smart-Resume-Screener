"""
Resume data extraction service using LLM (Google Gemini)
"""
import google.generativeai as genai
import json
import logging
from typing import Dict, Any
from backend.schemas import CandidateProfile, MatchScore, ScreeningResult
import os
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# Validate API key
api_key = os.getenv("GEMINI_API_KEY")
if not api_key or api_key == "your_gemini_api_key_here":
    logger.error("Gemini API key not configured properly")
    raise ValueError("Please set a valid GEMINI_API_KEY in your .env file")

# Configure Gemini - Use the correct model name with "models/" prefix
genai.configure(api_key=api_key)
model = genai.GenerativeModel('models/gemini-2.0-flash')


class ResumeExtractor:
    """Extract structured data from resumes using LLM"""
    
    @staticmethod
    def extract_candidate_data(resume_text: str) -> CandidateProfile:
        """
        Extract structured candidate information from resume text
        
        Args:
            resume_text: Raw text extracted from resume PDF
            
        Returns:
            CandidateProfile: Structured candidate data
        """
        prompt = f"""
Extract structured information from the following resume and return it as a JSON object.

Resume:
{resume_text}

Return a JSON object with this exact structure:
{{
    "name": "Full name or null",
    "email": "Email address or null",
    "phone": "Phone number or null",
    "location": "City/Location or null",
    "skills": ["skill1", "skill2", ...],
    "experience": [
        {{
            "role": "Job title",
            "company": "Company name",
            "duration": "e.g., Jan 2020 - Dec 2022",
            "years": 2.5,
            "responsibilities": ["responsibility1", "responsibility2"]
        }}
    ],
    "education": [
        {{
            "degree": "Degree name",
            "institution": "School/University",
            "year": "Graduation year or Expected graduation",
            "gpa": "GPA/CGPA with scale (e.g., 8.5/10, 3.5/4.0) - look carefully for this"
        }}
    ],
    "total_experience_years": 5.5,
    "certifications": ["cert1", "cert2"],
    "summary": "Brief professional summary"
}}

Important:
- Extract all technical skills, tools, frameworks, and soft skills
- Calculate total_experience_years by summing all work experience
- For GPA: Look for CGPA, GPA, percentage, grade, or any academic score. Include the scale if mentioned (e.g., "8.5/10" or "85%")
- For education year: Include "Expected" if it's a future graduation date, or "Final Year" if mentioned
- If information is not found, use null or empty list
- Return ONLY valid JSON, no additional text
"""

        try:
            logger.info("Extracting candidate data from resume")
            response = model.generate_content(prompt)
            json_str = response.text.strip()
            
            # Remove markdown code blocks if present
            if json_str.startswith("```"):
                json_str = json_str.split("```")[1]
                if json_str.startswith("json"):
                    json_str = json_str[4:]
            
            candidate_data = json.loads(json_str)
            logger.info(f"Successfully extracted data for candidate: {candidate_data.get('name', 'Unknown')}")
            return CandidateProfile(**candidate_data)
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error in candidate extraction: {e}")
            logger.error(f"Received content: {json_str[:500] if 'json_str' in locals() else 'No content'}")
            raise ValueError(f"Failed to parse LLM response as JSON: {e}")
        except Exception as e:
            logger.error(f"Error extracting candidate data: {e}")
            raise ValueError(f"Candidate data extraction failed: {e}")
    
    @staticmethod
    def compute_match_score(resume_text: str, job_description: str, candidate: CandidateProfile) -> MatchScore:
        """
        Compute semantic match score between candidate and job description
        
        Args:
            resume_text: Raw resume text
            job_description: Job requirements
            candidate: Extracted candidate profile
            
        Returns:
            MatchScore: Score (1-10) with detailed justification
        """
        # Build education details with GPA
        education_details = []
        highest_gpa = None
        if candidate.education:
            for e in candidate.education:
                detail = f"{e.degree} from {e.institution}"
                if e.year:
                    detail += f" ({e.year})"
                if e.gpa:
                    detail += f" [GPA: {e.gpa}]"
                    # Try to extract numeric GPA (on 10 scale)
                    try:
                        gpa_str = str(e.gpa).split('/')[0].strip()
                        gpa_value = float(gpa_str)
                        # Convert to 10 scale if on 4 scale
                        if gpa_value <= 4.0:
                            gpa_value = (gpa_value / 4.0) * 10
                        if highest_gpa is None or gpa_value > highest_gpa:
                            highest_gpa = gpa_value
                    except:
                        pass
                education_details.append(detail)
        
        # Determine GPA category
        gpa_category = "Not specified"
        if highest_gpa is not None:
            if highest_gpa >= 9.0:
                gpa_category = "Best (9.0+)"
            elif highest_gpa >= 8.0:
                gpa_category = "Good (8.0-9.0)"
            elif highest_gpa >= 7.0:
                gpa_category = "Average (7.0-8.0)"
            elif highest_gpa >= 6.0:
                gpa_category = "Below Average (6.0-7.0)"
            else:
                gpa_category = "Poor (<6.0)"
        
        prompt = f"""
You are an expert technical recruiter. Compare the following resume with the job description and rate the candidate's fit on a scale of 1-10 with detailed justification.

JOB DESCRIPTION:
{job_description}

CANDIDATE PROFILE:
- Name: {candidate.name}
- Skills: {', '.join(candidate.skills) if candidate.skills else 'Not specified'}
- Total Experience: {candidate.total_experience_years} years
- Education: {', '.join(education_details) if education_details else 'Not specified'}
- Academic Performance: {gpa_category}

FULL RESUME:
{resume_text}

TASK: Evaluate this candidate against the job requirements and provide a match score.

Evaluation Criteria:
1. Technical Skills Match (40%): How well do the candidate's technical skills align with job requirements?
2. Experience Relevance (30%): Is the candidate's experience relevant and sufficient?
3. Education & Qualifications (20%): Does education meet job requirements? Consider GPA if specified.
4. Overall Fit (10%): Would this candidate succeed in this role?

Scoring Scale (1.0 to 10.0):
- 9.0-10.0: Exceptional candidate - exceeds all requirements significantly
- 8.0-8.9: Strong candidate - exceeds most requirements
- 7.0-7.9: Good candidate - meets all key requirements
- 6.0-6.9: Adequate candidate - meets some requirements, gaps in others
- 5.0-5.9: Weak candidate - significant gaps in requirements
- 4.0-4.9: Poor candidate - lacks most requirements
- 1.0-3.9: Unqualified - does not meet job requirements

IMPORTANT INSTRUCTIONS:
- Be objective and precise in scoring
- Use ONE decimal place (e.g., 8.3, 6.7, 9.1)
- Differentiate between candidates - avoid giving everyone the same score
- Consider ALL criteria, not just one factor
- Base your score on actual resume content vs job requirements

Return a JSON object with this EXACT structure:
{{
    "score": <number between 1.0 and 10.0>,
    "justification": "<detailed 2-3 sentence explanation of how candidate matches job requirements>",
    "strengths": ["<specific strength 1>", "<specific strength 2>", "<specific strength 3>"],
    "concerns": ["<specific concern or gap 1>", "<specific concern or gap 2>"],
    "recommended_action": "<Shortlist or Reject>"
}}

Decision Rule for recommended_action:
- Score >= 7.0 → "Shortlist"
- Score < 7.0 → "Reject"

Return ONLY valid JSON, no additional text or markdown.
"""

        try:
            logger.info("Computing match score against job description")
            response = model.generate_content(prompt)
            json_str = response.text.strip()
            
            # Remove markdown code blocks if present
            if json_str.startswith("```"):
                json_str = json_str.split("```")[1]
                if json_str.startswith("json"):
                    json_str = json_str[4:]
            
            match_data = json.loads(json_str)
            match_score = MatchScore(**match_data)
            logger.info(f"Match score computed: {match_score.score}/10 - {match_score.recommended_action}")
            return match_score
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error in match scoring: {e}")
            logger.error(f"Received content: {json_str[:500] if 'json_str' in locals() else 'No content'}")
            raise ValueError(f"Failed to parse match score response as JSON: {e}")
        except Exception as e:
            logger.error(f"Error computing match score: {e}")
            raise ValueError(f"Match score computation failed: {e}")
    
    @staticmethod
    def screen_resume(resume_text: str, job_description: str, filename: str) -> ScreeningResult:
        """
        Complete screening pipeline: extract data + compute match score
        
        Args:
            resume_text: Raw resume text
            job_description: Job requirements
            filename: Original resume filename
            
        Returns:
            ScreeningResult: Complete screening result with candidate data and match score
            
        Raises:
            ValueError: If extraction or scoring fails
        """
        logger.info(f"Starting resume screening for: {filename}")
        
        # Input validation
        if not resume_text or len(resume_text.strip()) < 50:
            raise ValueError("Resume text is too short or empty")
        
        if not job_description or len(job_description.strip()) < 10:
            raise ValueError("Job description is too short or empty")
        
        try:
            # Step 1: Extract structured candidate data
            candidate = ResumeExtractor.extract_candidate_data(resume_text)
            
            # Step 2: Compute match score
            match_score = ResumeExtractor.compute_match_score(resume_text, job_description, candidate)
            
            # Step 3: Combine into screening result
            result = ScreeningResult(
                candidate=candidate,
                match_score=match_score,
                job_description=job_description,
                resume_filename=filename
            )
            
            logger.info(f"Successfully screened resume: {filename} - Score: {match_score.score}/10")
            return result
            
        except Exception as e:
            logger.error(f"Resume screening failed for {filename}: {str(e)}")
            raise
