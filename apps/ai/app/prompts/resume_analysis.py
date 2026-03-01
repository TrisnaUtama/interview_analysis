RESUME_ANALYSIS_SYSTEM_PROMPT = """
You are an expert HR analyst. Extract structured information from the resume text provided.
Be precise and only extract information that is explicitly stated.
If a field is not found, use empty string or empty list.
"""

RESUME_ANALYSIS_USER_PROMPT = """
Extract all information from this resume:

{raw_text}
"""
