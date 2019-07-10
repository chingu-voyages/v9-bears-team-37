from django.urls import path
from . import email

urlpatterns = [
    path('verification/', email.collect_email),
    path('filetoken/', email.file_token)
]
