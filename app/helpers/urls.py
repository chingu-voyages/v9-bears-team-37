from django.urls import path
from helpers import email

urlpatterns = [
    path('', email.index)
]
