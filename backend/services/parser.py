from langchain_core.documents import Document
from pypdf import PdfReader


def extract_documents_from_pdf(file_path: str):

    reader = PdfReader(file_path)

    documents = []

    for page_number, page in enumerate(reader.pages, start=1):

        text = page.extract_text()

        if text:

            documents.append(
                Document(
                    page_content=text,
                    metadata={
                        "page": page_number
                    }
                )
            )

    return documents