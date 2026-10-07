from django.db import models

class DocumentSummary(models.Model):
    SOURCE_CHOICES = (
        ('text', 'Text'),
        ('pdf', 'PDF'),
    )

    original_text = models.TextField()
    summary = models.TextField()
    action_items = models.TextField()
    source_type = models.CharField(max_length=10, choices=SOURCE_CHOICES, default='text')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Summary {self.id} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"