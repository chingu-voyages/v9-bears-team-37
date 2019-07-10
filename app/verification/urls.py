from django.urls import path
from verification import email

urlpatterns = [
    path('', email.collect_email)
]
