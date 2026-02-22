from litellm import AsyncOpenAI
from app.core.ai_client import create_ai_client
from app.prompts.job_analysis import (
    JOB_ANALYSIS_SYSTEM_PROMPT,
    JOB_ANALYSIS_USER_PROMPT,
)
from app.models.jobs import AIAnalysisResult, JobAnalysisResult


class AnalyzerService:
    def __init__(self):
        self.client: AsyncOpenAI = create_ai_client()

    async def analyze_job_description(self, raw_text: str) -> JobAnalysisResult:
        response = await self.client.beta.chat.completions.parse(
            model="openrouter/meta-llama/llama-4-scout",
            messages=[
                {"role": "system", "content": JOB_ANALYSIS_SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": JOB_ANALYSIS_USER_PROMPT.format(raw_text=raw_text),
                },
            ],
            response_format=AIAnalysisResult,
            temperature=0.2,
        )

        ai_result = response.choices[0].message.parsed
        if ai_result is None:
            raise ValueError("AI returned empty result")

        return JobAnalysisResult(
            raw_text=raw_text,
            parsed_text=ai_result.parsed_text,
            status="completed",
            keywords=ai_result.keywords,
        )
