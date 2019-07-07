from django.shortcuts import render
from django.core.mail import send_mail


def index(request):
    send_mail(
        subject='Hello from Picklu',
        message="Hello, Picklu",
        html_message='<html><body><p>Hello there, This is an <b>automated</b> email</p></body></html>',
        from_email='ohmydepicklu@gmail.com',
        recipient_list=['picklumithu@gmail.com', 'subrata.kku@gmail.com'],
        fail_silently=False)
    return render(request, 'send/index.html')
