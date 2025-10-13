"""
Generate sample screening data for testing the dashboard
Run this to populate the database with test data
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from backend.database import SessionLocal, init_db
from backend.db_service import DatabaseService
from backend.schemas import CandidateProfile, Experience, Education, MatchScore, ScreeningResult
from datetime import datetime
import random

# Initialize database
init_db()

# Sample data
sample_candidates = [
    {
        "name": "Alice Johnson",
        "email": "alice.johnson@email.com",
        "phone": "+1-555-0101",
        "location": "San Francisco, CA",
        "skills": ["Python", "FastAPI", "Django", "PostgreSQL", "Docker", "AWS", "React"],
        "experience": [
            Experience(
                role="Senior Software Engineer",
                company="Tech Giants Inc",
                duration="Jan 2020 - Present",
                years=5,
                responsibilities=["Led backend team", "Designed microservices", "Mentored junior developers"]
            ),
            Experience(
                role="Software Developer",
                company="StartupXYZ",
                duration="Jun 2018 - Dec 2019",
                years=1.5,
                responsibilities=["Built RESTful APIs", "Implemented CI/CD pipelines"]
            )
        ],
        "education": [
            Education(
                degree="MS Computer Science",
                institution="Stanford University",
                year="2018",
                gpa="3.9"
            )
        ],
        "total_experience_years": 6.5,
        "certifications": ["AWS Certified Developer", "Python Professional Certificate"],
        "summary": "Experienced software engineer specializing in backend systems and cloud architecture"
    },
    {
        "name": "Bob Martinez",
        "email": "bob.martinez@email.com",
        "phone": "+1-555-0102",
        "location": "Austin, TX",
        "skills": ["Java", "Spring Boot", "Kubernetes", "MongoDB", "Kafka", "Microservices"],
        "experience": [
            Experience(
                role="Backend Developer",
                company="Enterprise Solutions Corp",
                duration="Mar 2021 - Present",
                years=3,
                responsibilities=["Developed payment processing systems", "Optimized database queries"]
            )
        ],
        "education": [
            Education(
                degree="BS Software Engineering",
                institution="University of Texas",
                year="2020",
                gpa="3.5"
            )
        ],
        "total_experience_years": 3,
        "certifications": ["Oracle Java Certified"],
        "summary": "Backend developer with strong experience in enterprise systems"
    },
    {
        "name": "Carol Davis",
        "email": "carol.davis@email.com",
        "phone": "+1-555-0103",
        "location": "New York, NY",
        "skills": ["Python", "Machine Learning", "TensorFlow", "Pandas", "NumPy", "Scikit-learn"],
        "experience": [
            Experience(
                role="Data Scientist",
                company="AI Innovations",
                duration="Aug 2022 - Present",
                years=2,
                responsibilities=["Built ML models", "Analyzed large datasets", "Created data pipelines"]
            )
        ],
        "education": [
            Education(
                degree="PhD Machine Learning",
                institution="MIT",
                year="2022",
                gpa="4.0"
            )
        ],
        "total_experience_years": 2,
        "certifications": ["TensorFlow Developer Certificate"],
        "summary": "Data scientist with expertise in machine learning and statistical analysis"
    },
    {
        "name": "David Chen",
        "email": "david.chen@email.com",
        "phone": "+1-555-0104",
        "location": "Seattle, WA",
        "skills": ["JavaScript", "Node.js", "Express", "MongoDB", "GraphQL"],
        "experience": [
            Experience(
                role="Junior Developer",
                company="WebDev Studio",
                duration="Jan 2024 - Present",
                years=1,
                responsibilities=["Fixed bugs", "Wrote unit tests", "Maintained documentation"]
            )
        ],
        "education": [
            Education(
                degree="BS Computer Science",
                institution="University of Washington",
                year="2023",
                gpa="3.2"
            )
        ],
        "total_experience_years": 1,
        "certifications": [],
        "summary": "Entry-level developer eager to learn and grow in web development"
    },
    {
        "name": "Emma Wilson",
        "email": "emma.wilson@email.com",
        "phone": "+1-555-0105",
        "location": "Boston, MA",
        "skills": ["Python", "FastAPI", "Flask", "REST API", "SQL", "Git", "Docker", "Redis"],
        "experience": [
            Experience(
                role="Full Stack Developer",
                company="Digital Solutions Ltd",
                duration="Apr 2019 - Present",
                years=5.5,
                responsibilities=["Developed web applications", "Designed APIs", "Implemented authentication"]
            )
        ],
        "education": [
            Education(
                degree="BS Information Technology",
                institution="Boston University",
                year="2019",
                gpa="3.7"
            )
        ],
        "total_experience_years": 5.5,
        "certifications": ["Red Hat Certified Engineer"],
        "summary": "Full-stack developer with strong backend focus and API design skills"
    }
]

job_descriptions = [
    {
        "title": "Senior Python Developer",
        "description": """Senior Python Developer

We are looking for an experienced Python developer with:
- 5+ years of Python development experience
- Strong knowledge of FastAPI, Django, or Flask
- Experience with RESTful API design
- Database skills (PostgreSQL, MongoDB)
- Docker and containerization
- Bachelor's degree in Computer Science or related field
- Excellent problem-solving skills""",
        "target_scores": [9.2, 6.5, 4.3, 3.1, 8.7]  # Scores for each candidate (updated to 1 decimal)
    },
    {
        "title": "Machine Learning Engineer",
        "description": """Machine Learning Engineer

Looking for ML engineer with:
- 3+ years ML experience
- Strong Python and TensorFlow/PyTorch
- Experience deploying ML models
- Data pipeline experience
- Statistical analysis skills
- Master's or PhD preferred""",
        "target_scores": [5.8, 3.4, 9.5, 2.1, 4.6]
    },
    {
        "title": "Backend Developer",
        "description": """Backend Developer

Requirements:
- 3+ years backend development
- Experience with microservices
- API design and implementation
- Database optimization
- Cloud platforms (AWS/GCP/Azure)
- Strong CS fundamentals""",
        "target_scores": [8.3, 7.5, 4.8, 3.7, 7.9]
    },
    {
        "title": "Data Analyst",
        "description": """Data Analyst

Requirements:
- Strong analytical and problem-solving skills
- Experience with data visualization tools
- SQL and database knowledge
- Python or R for data analysis
- Bachelor's degree required""",
        "target_scores": [6.2, 5.5, 8.9, 2.8, 5.1]
    }
]

def generate_match_score(score, candidate_name, job_title):
    """Generate realistic match score based on target score"""
    if score >= 7.0:
        action = "Shortlist"
        justification = f"{candidate_name} is a strong fit for the {job_title} position with relevant experience and skills that align well with requirements."
        strengths = [
            "Strong technical skills matching job requirements",
            "Relevant work experience in similar roles",
            "Solid educational background",
            "Professional certifications demonstrate commitment",
            "Proven track record of successful projects"
        ][:random.randint(3, 5)]
        concerns = [
            "Could benefit from more specific domain experience",
            "Minor gaps in some advanced technologies"
        ][:random.randint(0, 1)]
    else:
        action = "Reject"
        justification = f"{candidate_name} does not meet the minimum requirements for the {job_title} position based on current qualifications and experience level."
        strengths = [
            "Shows basic programming knowledge",
            "Demonstrates willingness to learn",
            "Has foundational technical understanding"
        ][:random.randint(0, 2)]
        concerns = [
            "Lacks required years of experience for this role",
            "Missing critical technical skills mentioned in job requirements",
            "Limited relevant project experience",
            "Skill set doesn't align with position needs",
            "Experience level below minimum requirements"
        ][:random.randint(2, 4)]
    
    return MatchScore(
        score=score,
        justification=justification,
        strengths=strengths,
        concerns=concerns,
        recommended_action=action
    )

def main():
    db = SessionLocal()
    
    try:
        print("Generating sample screening data...")
        print("=" * 60)
        
        for job_idx, job in enumerate(job_descriptions):
            print(f"\nProcessing job: {job['title']}")
            print("-" * 60)
            
            for cand_idx, candidate_data in enumerate(sample_candidates):
                # Create candidate profile
                candidate = CandidateProfile(**candidate_data)
                
                # Generate match score
                target_score = job['target_scores'][cand_idx]
                match_score = generate_match_score(
                    target_score,
                    candidate.name,
                    job['title']
                )
                
                # Create screening result
                screening_result = ScreeningResult(
                    candidate=candidate,
                    match_score=match_score,
                    job_description=job['description'],
                    resume_filename=f"{candidate.name.lower().replace(' ', '_')}_resume.pdf"
                )
                
                # Save to database
                candidate_id = DatabaseService.save_screening_result(
                    db,
                    screening_result,
                    f"Sample resume text for {candidate.name}"
                )
                
                print(f"✓ {candidate.name}: Score {match_score.score}/10 - {match_score.recommended_action} (ID: {candidate_id})")
        
        print("\n" + "=" * 60)
        
        # Print statistics
        stats = DatabaseService.get_database_stats(db)
        print("\nDatabase Statistics:")
        print(f"  Total Candidates: {stats['total_candidates']}")
        print(f"  Total Screenings: {stats['total_screenings']}")
        print(f"  Shortlisted: {stats['shortlisted']}")
        print(f"  Rejected: {stats['rejected']}")
        
        print("\n✓ Sample data generated successfully!")
        
    except Exception as e:
        print(f"\n✗ Error generating sample data: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    main()
