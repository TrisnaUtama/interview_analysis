from pydantic import BaseModel
from typing import List, Optional


class KeywordEntry(BaseModel):
    keyword: str
    weight: float
    type: str


class AIAnalysisResult(BaseModel):
    position: str
    parsed_text: str
    keywords: List[KeywordEntry]


class JobAnalysisResult(BaseModel):
    raw_text: str
    parsed_text: str
    status: str
    keywords: List[KeywordEntry]


class AnalysisCallbackPayload(BaseModel):
    job_description_id: str
    raw_text: str
    parsed_text: str
    keywords: list[KeywordEntry]
    status: str
    error: Optional[str] = None
