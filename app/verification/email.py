from django.conf import settings
from django.shortcuts import render
from django.core.mail import send_mail


def index(request):
    result = send_mail(
        subject='Hello from Picklu',
        message="Hello, Picklu",
        html_message='<html><body><p>Hello there, This is an <b>automated</b> html email.</p></body></html>',
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=['picklumithu@gmail.com'],
        fail_silently=False)
    if result:
        return render(request, 'send/success.html')
    else:
        return render(request, 'send/fail.html')
