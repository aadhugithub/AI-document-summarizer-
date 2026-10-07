from rest_framework import serializers
from .models import DocumentSummary

class DocumentSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentSummary
        fields = ['id', 'original_text', 'summary', 'action_items', 'source_type', 'created_at']
        read_only_fields = ['id', 'summary', 'action_items', 'created_at']