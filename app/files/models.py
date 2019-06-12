from django.db import models


class File(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    size = models.CharField(max_length=50)
    url = models.URLField()
    downloadable_at = models.DateTimeField()
    downloadable_during = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
