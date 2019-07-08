from django.db import models

from users.models import User


class Dlfile(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    posted_by = models.ForeignKey(
        User, null=True, on_delete=models.CASCADE)
