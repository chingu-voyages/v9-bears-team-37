import graphene
import json
from django.conf import settings
from django.http import JsonResponse
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.views.decorators.csrf import csrf_exempt
from app.schema import Query, Mutation


query = """
    query($email: String!){
        user(email: $email) {
            id
            username
            email
            isVerified
        }
    }"""

mutation = """
    mutation($userId: Int!, $isVerified: Boolean) {
        updateUser(userId: $userId, isVerified: $isVerified) {
            user {
                id
                isVerified
            }
        }
    }"""


@csrf_exempt
def collect_email(request):
    if request.method == 'GET':
        return JsonResponse({'msg': 'Not a valid method!'})

    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    username = body.get('username', 'there')
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
        text_message = render_to_string('email/message.txt', {'name': username, 'id': id})
        html_message = render_to_string('email/message.html', {'name': username, 'id': id})

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
def confirm_email(request):
    if request.method == 'GET':
        return JsonResponse({'msg': 'Not a valid method!'})

    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode).get('user', {})
    userId = int(body.get('id', '0'))
    username = body.get('username')
    schema = graphene.Schema(mutation=Mutation)
    response = schema.execute(
        mutation,
        variables={"userId": userId, "isVerified": True},
        context_value={'username': username}
    )

    data = response.to_dict()
    print(data)
    return JsonResponse({'msg': 'done!'})
    # if data['user']:
    #     return JsonResponse({'msg': 'Email has been activated successfully!'})
    # else:
    #     return JsonResponse({'msg': 'User not found!'})
