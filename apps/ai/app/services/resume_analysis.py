# app/services/resume_analysis.py

import time
from litellm import AsyncOpenAI
from mistralai import Mistral
from celery.utils.log import get_task_logger

from app.core.ai_client import create_ai_client
from app.core.mistal_client import mistral_client
from app.models.resumes import (
    AIResumeResult,
    ResumeAnalysisResult,
    Organization,
    is_organization_role,
)
from app.prompts.resume_analysis import (
    RESUME_ANALYSIS_SYSTEM_PROMPT,
    RESUME_ANALYSIS_USER_PROMPT,
)
from app.core.settings.index import settings

logger = get_task_logger(__name__)


class ResumeOCRService:
    def __init__(self):
        self.client: Mistral = mistral_client()

    def extract_text(self, file_url: str) -> str:
        start = time.time()
        logger.info(f"OCR started | url={file_url}")

        ocr_response = self.client.ocr.process(
            model="mistral-ocr-latest",
            document={"type": "document_url", "document_url": file_url},
        )

        result = "\n\n".join([page.markdown for page in ocr_response.pages]).strip()

        logger.info(
            f"OCR completed | elapsed={time.time() - start:.2f}s | chars={len(result)}"
        )
        return result


class ResumeAnalyzerService:
    def __init__(self):
        self.client: AsyncOpenAI = create_ai_client()

    async def analyze(self, raw_text: str) -> ResumeAnalysisResult:
        start = time.time()
        logger.info(f"Analysis started | input_chars={len(raw_text)}")

        response = await self.client.beta.chat.completions.parse(
            model="openrouter/meta-llama/llama-3.3-70b-instruct",
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

        logger.info(f"Analysis completed | elapsed={time.time() - start:.2f}s")

        ai_result = self._split_experience_organizations(ai_result)

        logger.info(
            f"Post-processing done | "
            f"experience={len(ai_result.experience)} | "
            f"organizations={len(ai_result.organizations)}"
        )

        return ResumeAnalysisResult(
            raw_text=raw_text, parsed_data=ai_result, status="completed"
        )

    def _split_experience_organizations(self, result: AIResumeResult) -> AIResumeResult:
        logger.info("=== POST-PROCESSING START ===")
        logger.info(f"Total experience before split: {len(result.experience)}")

        real_experience = []
        org_from_experience = []

        for exp in result.experience:
            check = is_organization_role(exp.company, exp.position)
            logger.info(
                f"  [{'ORG' if check else 'EXP'}] {exp.position} @ {exp.company}"
            )

            if check:
                org_from_experience.append(
                    Organization(
                        organization_name=exp.company,
                        position=exp.position,
                        start_date=exp.start_date,
                        end_date=exp.end_date,
                        is_current=exp.is_current,
                        description=exp.description,
                    )
                )
            else:
                real_experience.append(exp)

        all_organizations = result.organizations + org_from_experience

        logger.info(
            f"After split → experience: {len(real_experience)}, organizations: {len(all_organizations)}"
        )
        logger.info("=== POST-PROCESSING END ===")

        return AIResumeResult(
            full_name=result.full_name,
            email=result.email,
            phone=result.phone,
            location=result.location,
            summary=result.summary,
            skills=result.skills,
            languages=result.languages,
            experience=real_experience,
            education=result.education,
            certifications=result.certifications,
            organizations=all_organizations,
            total_years_experience=result.total_years_experience,
        )


class ResumeService:
    def __init__(self):
        self.ocr = ResumeOCRService()
        self.analyzer = ResumeAnalyzerService()

    async def process(self, resume_id: str, file_path: str) -> ResumeAnalysisResult:
        total_start = time.time()
        logger.info(f"Processing started | resume_id={resume_id}")

        file_url = (
            f"https://{settings.minio.MINIO_ENDPOINT}"
            f"/{settings.minio.MINIO_BUCKET_INTERVIEW}"
            f"/{file_path}"
        )

        raw_text = self.ocr.extract_text(file_url)
        result = await self.analyzer.analyze(raw_text)

        logger.info(
            f"Processing completed | resume_id={resume_id} | "
            f"total_elapsed={time.time() - total_start:.2f}s"
        )
        return result
