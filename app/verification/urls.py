from django.urls import path
from verification import email

urlpatterns = [
    path('', email.collect_email),
    path('confirm/:id', email.confirm_email),
]
