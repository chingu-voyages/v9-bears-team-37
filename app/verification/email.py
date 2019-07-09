from django.conf import settings
from django.http import JsonResponse
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.views.decorators.csrf import csrf_exempt
from gql import gql, Client
from gql.transport import requests
import json


query = gql(
    """query($email: String!){
        user(email: $email) {
            id
            username
            email
            isVerified
        }
}""")

def run_query(variables):
    transport = requests.RequestsHTTPTransport(url='http://localhost:8000/graphql/')
    client = Client(transport=transport)
    return client.execute(query, variables)


@csrf_exempt
def collect_email(request):
    if request.method == 'GET':
        return JsonResponse({'msg': 'Not a valid method!'})

    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    username = body.get('username', 'there')
    email = body.get('email', '')
    if not email:
        JsonResponse({'msg': 'Email id was not found!'})
    
    try:
        variables = {
            "email": email
        }
        response = run_query(variables)
    except Exception as e:
        print(e)
        return JsonResponse({'error': 'Failed to send request to graphql'})
    
    if response.status_code == 200:
        return JsonResponse(response.json())
    else:
        return JsonResponse({'msg': 'Something went wrong in the query!', 'status_code': response.status_code})

    # text_message = render_to_string('email/message.txt', {'name': username, 'id': 7})
    # html_message = render_to_string('email/message.html', {'name': username, 'id': 7})

    # result = send_mail(
    #     subject="Verify your email",
    #     message=text_message,
    #     html_message=html_message,
    #     from_email=settings.EMAIL_HOST_USER,
    #     recipient_list=[email],
    #     fail_silently=False)

    # if result:
    #     return JsonResponse({
    #         'name': name, 'email': email, 'msg': 'Email collection was successfull!'
    #     })
    # return JsonResponse({'msg': 'Something went wrong!'})


def confirm_email(request, id):
    pass
