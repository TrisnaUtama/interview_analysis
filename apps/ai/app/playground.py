from app.core.mistal_client import mistral_client

client = mistral_client()

ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document={
        "type": "document_url",
        "document_url": "https://minio-api.trisnautama.site/interview-and-analysis/resumes/941b6890-ced9-4075-97d0-427a225e50b6/15427843-57b8-4411-8a0c-4b6e27e7a5b1.pdf",
    },
)

# Lihat hasilnya
for page in ocr_response.pages:
    print(f"--- Page {page.index + 1} ---")
    print(page.markdown)
