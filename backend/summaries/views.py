import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from pypdf import PdfReader
from io import BytesIO

from .models import DocumentSummary
from .serializers import DocumentSummarySerializer


def call_ollama(text: str) -> dict:
    """
    Calls local Ollama model and returns summary + action_items
    """
    prompt = f"""
You are a helpful assistant. Analyze the following document and respond in this exact format:

SUMMARY:
- Bullet point 1
- Bullet point 2
- Bullet point 3

ACTION ITEMS:
1. Action item 1
2. Action item 2
3. Action item 3

Document:
{text}
"""

    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "qwen2.5:3b",
                "prompt": prompt,
                "stream": False
            },
            timeout=300
        )
        response.raise_for_status()
        full_response = response.json().get("response", "")

        # Simple parsing
        summary = ""
        action_items = ""

        if "SUMMARY:" in full_response and "ACTION ITEMS:" in full_response:
            parts = full_response.split("ACTION ITEMS:")
            summary_part = parts[0].replace("SUMMARY:", "").strip()
            action_part = parts[1].strip()
            summary = summary_part
            action_items = action_part
        else:
            # Fallback if format is not perfect
            summary = full_response
            action_items = "No clear action items found."

        return {
            "summary": summary,
            "action_items": action_items
        }

    except Exception as e:
        raise Exception(f"Ollama error: {str(e)}")


class SummarizeView(APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request):
        text = request.data.get("text", "").strip()
        pdf_file = request.FILES.get("file")

        source_type = "text"
        original_text = ""

        # Case 1: PDF uploaded
        if pdf_file:
            if not pdf_file.name.lower().endswith(".pdf"):
                return Response(
                    {"error": "Only PDF files are allowed."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                reader = PdfReader(BytesIO(pdf_file.read()))
                extracted = []
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        extracted.append(page_text)

                original_text = "\n".join(extracted).strip()
                source_type = "pdf"

                if not original_text:
                    return Response(
                        {"error": "Could not extract any text from this PDF."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except Exception as e:
                return Response(
                    {"error": f"Failed to process PDF: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Case 2: Plain text
        elif text:
            original_text = text
            source_type = "text"

        else:
            return Response(
                {"error": "Please provide either text or a PDF file."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Call Ollama
        try:
            ai_result = call_ollama(original_text)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        # Save to database
        summary_obj = DocumentSummary.objects.create(
            original_text=original_text,
            summary=ai_result["summary"],
            action_items=ai_result["action_items"],
            source_type=source_type
        )

        serializer = DocumentSummarySerializer(summary_obj)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SummaryListView(APIView):
    def get(self, request):
        summaries = DocumentSummary.objects.all()[:20]  # latest 20
        serializer = DocumentSummarySerializer(summaries, many=True)
        return Response(serializer.data)


class SummaryDetailView(APIView):
    def get(self, request, pk):
        try:
            summary = DocumentSummary.objects.get(pk=pk)
        except DocumentSummary.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = DocumentSummarySerializer(summary)
        return Response(serializer.data)

    def delete(self, request, pk):
        try:
            summary = DocumentSummary.objects.get(pk=pk)
            summary.delete()
            return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except DocumentSummary.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)