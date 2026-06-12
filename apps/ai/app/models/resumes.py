# app/models/resumes.py

from typing import Optional
from pydantic import BaseModel, Field

ORGANIZATION_COMPANY_KEYWORDS = [
    "upnyk",
    "ugm",
    "itb",
    "ui",
    "its",
    "unpad",
    "undip",
    "unair",
    "uny",
    "unsoed",
    "unib",
    "unila",
    "usu",
    "unand",
    "unmul",
    "upn",
    "uin",
]

PROFESSIONAL_COMPANY_KEYWORDS = [
    "pt.",
    "cv.",
    "tbk",
    "ltd",
    "corp",
    "inc",
    "laboratory",
    "laboratorium",
    "studio",
    "center",
    "pusat",
    "balai",
    "badan",
    "lembaga",
]

ORGANIZATION_POSITION_KEYWORDS = [
    "bem",
    "ukm",
    "himpunan",
    "student activity unit",
    "badan eksekutif",
    "mahasiswa",
    "hmtm",
    "hmj",
    "hmte",
    "senat",
    "dpm",
    "panitia",
    "vice chairman",
    "staff of art",
    "staff of sport",
    "staff bidang",
    "ketua umum",
    "wakil ketua",
    "sekretaris umum",
    "bendahara umum",
    "koordinator",
    "anggota divisi",
    "kadiv",
    "public relation –",
    "chairman –",
    "vice chairman –",
    "staff –",
]


def is_organization_role(company: str, position: str) -> bool:
    company_lower = company.lower().strip()
    position_lower = position.lower().strip()

    is_bare_university = any(
        kw in company_lower for kw in ORGANIZATION_COMPANY_KEYWORDS
    ) and not any(kw in company_lower for kw in PROFESSIONAL_COMPANY_KEYWORDS)

    has_org_position = any(
        kw in position_lower for kw in ORGANIZATION_POSITION_KEYWORDS
    )

    return is_bare_university or has_org_position


class Language(BaseModel):
    language: str
    proficiency: str


class Experience(BaseModel):
    company: str = Field(
        description="Name of the company or employer (professional/internship only, e.g. PT. Pertamina, Core Analysis Laboratory)"
    )
    position: str = Field(description="Job title or role")
    location: str = Field(description="Work location city/country")
    start_date: str
    end_date: str
    is_current: bool
    description: str = Field(description="Job responsibilities and achievements")


class Organization(BaseModel):
    organization_name: str = Field(
        description="Name of the student org, committee, or volunteer group"
    )
    position: str = Field(description="Role or title held in the organization")
    start_date: str
    end_date: str
    is_current: bool
    description: str = Field(
        description="Activities and responsibilities in the organization"
    )


class Education(BaseModel):
    institution: str
    degree: str
    field: str
    start_date: str
    end_date: Optional[str] = None


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
    experience: list[Experience] = Field(
        description=(
            "ONLY professional work: jobs, internships, lab assistants at university laboratories. "
            "Never include student orgs, BEM, UKM, or event committees here."
        )
    )
    education: list[Education]
    certifications: list[Certification]
    organizations: list[Organization] = Field(
        description=(
            "ONLY non-professional: student organizations (BEM, UKM, Himpunan), "
            "event committees, volunteer activities. Never include paid jobs or lab roles here."
        )
    )
    total_years_experience: int = Field(
        description="Total years of professional work experience only, excluding student org activities"
    )


class ResumeAnalysisResult(BaseModel):
    raw_text: str
    parsed_data: AIResumeResult
    status: str
