from django.conf import settings
from django.shortcuts import render
from django.core.mail import send_mail
from django.template.loader import render_to_string


def index(request):
    name = "Picklu"
    text_message = render_to_string('email/message.txt', {'name': name})
    html_message = render_to_string('email/message/email.html', {'name': name})
    
    result = send_mail(
        subject="Hello, there",
        message=text_message,
        html_message=html_message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=['picklumithu@gmail.com'],
        fail_silently=False)
    if result:
        return render(request, 'send/success.html')
    else:
        return render(request, 'send/fail.html')
