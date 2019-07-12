from django.db import models

from users.models import User


class Dlfile(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    file_token = models.CharField(max_length=6, null=True)
    token_sent = models.BooleanField(default=False)
    posted_by = models.ForeignKey(
        User, null=True, on_delete=models.CASCADE)
