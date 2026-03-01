from pydantic import BaseModel


class Language(BaseModel):
    language: str
    proficiency: str


class Experience(BaseModel):
    company: str
    position: str
    start_date: str
    end_date: str
    is_current: bool
    description: str


class Education(BaseModel):
    institution: str
    degree: str
    field: str
    start_date: str
    end_date: str


class Certification(BaseModel):
    name: str
    issuer: str
    year: str


class AIResumeResult(BaseModel):
    full_name: str
    email: str
    phone: str
    location: str
    summary: str
    skills: list[str]
    languages: list[Language]
    experience: list[Experience]
    education: list[Education]
    certifications: list[Certification]
    total_years_experience: int


class ResumeAnalysisResult(BaseModel):
    raw_text: str
    parsed_data: AIResumeResult
    status: str
