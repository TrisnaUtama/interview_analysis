from litellm import AsyncOpenAI
from mistralai import Mistral

from app.core.ai_client import create_ai_client
from app.core.mistal_client import mistral_client
from app.models.resumes import AIResumeResult, ResumeAnalysisResult
from app.prompts.resume_analysis import (
    RESUME_ANALYSIS_SYSTEM_PROMPT,
    RESUME_ANALYSIS_USER_PROMPT,
)
from app.core.settings.index import settings


class ResumeOCRService:
    def __init__(self):
        self.client: Mistral = mistral_client()

    def extract_text(self, file_url: str) -> str:
        ocr_response = self.client.ocr.process(
            model="mistral-ocr-latest",
            document={"type": "document_url", "document_url": file_url},
        )

        return "\n\n".join([page.markdown for page in ocr_response.pages]).strip()


class ResumeAnalyzerService:
    def __init__(self):
        self.client: AsyncOpenAI = create_ai_client()

    async def analyze(self, raw_text: str) -> ResumeAnalysisResult:
        response = await self.client.beta.chat.completions.parse(
            model="openrouter/openai/gpt-4o-mini",
            messages=[
                {"role": "system", "content": RESUME_ANALYSIS_SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": RESUME_ANALYSIS_USER_PROMPT.format(raw_text=raw_text),
                },
            ],
            response_format=AIResumeResult,
            temperature=0,
        )

        ai_result = response.choices[0].message.parsed
        if ai_result is None:
            raise ValueError("AI returned empty result")

        return ResumeAnalysisResult(
            raw_text=raw_text, parsed_data=ai_result, status="completed"
        )


class ResumeService:
    def __init__(self):
        self.ocr = ResumeOCRService()
        self.analyzer = ResumeAnalyzerService()

    async def process(self, resume_id: str, file_path: str) -> ResumeAnalysisResult:
        file_url = f"https://{settings.minio.MINIO_ENDPOINT}/{settings.minio.MINIO_BUCKET_INTERVIEW}/{file_path}"
        raw_text = self.ocr.extract_text(file_url)
        result = await self.analyzer.analyze(raw_text)
        return result
