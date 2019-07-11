import graphene
import json

from django.conf import settings
from django.http import JsonResponse
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.views.decorators.csrf import csrf_exempt
from app.schema import Query

query = """
    query($email: String!){
        user(email: $email) {
            id
            username
            email
            isVerified
        }
    }"""


@csrf_exempt
def collect_email(request):
    if request.method == 'GET':
        return JsonResponse({'msg': 'Not a valid method!'})

    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    user_name = body.get('username', 'there').upper()
    email = body.get('email', '')

    schema = graphene.Schema(query=Query)
    response = schema.execute(query, variables={"email": email})

    data = response.to_dict()['data']

    if data['user']:

        user = data['user']
        if user['isVerified']:
            return JsonResponse({'msg': 'User is already verified!'})

        # User is found and the user's email is not verified
        id = user['id']
        text_message = render_to_string('email/verification.txt', {'user_name': user_name, 'id': id})
        html_message = render_to_string('email/verification.html', {'user_name': user_name, 'id': id})

        result = send_mail(
            subject="Email verification for HyperFlashDrive",
            message=text_message,
            html_message=html_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False)

        if result:
            return JsonResponse(data)
    else:
        return JsonResponse({'msg': 'User not found!'})


@csrf_exempt
def file_token(request):
    if request.method == 'GET':
        return JsonResponse({'msg': 'Not a valid method!'})

    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    user_name = body.get('username', 'there').upper()
    email = body.get('email', '')
    file_name = body.get('fileName', '')
    file_description = body.get('fileDescription', '')
    file_token = body.get('fileToken', '')

    schema = graphene.Schema(query=Query)
    response = schema.execute(query, variables={"email": email})

    data = response.to_dict()['data']

    if data['user']:
        text_message = render_to_string('email/filetoken.txt',
                                        {'user_name': user_name, 'file_name': file_name,
                                         'file_description': file_description, 'file_token': file_token})
        html_message = render_to_string('email/filetoken.html',
                                        {'user_name': user_name, 'file_name': file_name,
                                         'file_description': file_description, 'file_token': file_token})
        result = send_mail(
            subject="File downloading token",
            message=text_message,
            html_message=html_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False)

        if result:
            return JsonResponse(data)
    else:
        return JsonResponse({'msg': 'User not found!'})
