from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # username = models.CharField(max_length=50, unique=True)
    # email = models.EmailField()
    # password = models.TextField(blank=False)
    # date_joined = models.DateField(auto_now_add=True)
    # is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.username
