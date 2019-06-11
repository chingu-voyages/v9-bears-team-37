from django.http import HttpResponse


def index(request):
    return HttpResponse(
        '''
        <!doctype html>
        <html>
            <head>
                <title>HyperFlashDrive</title>
                <style>
                    body{
                        background-color: darkseagreen;
                    }
                    div {
                        color: darkblue;
                        text-align: center;
                    }
                    ul {
                        list-style: none;
                    }
                    ul a {
                        border: 2px solid darkblue;
                        border-radius: 5px;
                        display: inline-block;
                        padding: 5px;
                    }
                </style>
            </head>
            <body>
                <div>
                    <h1>Hello, Chingu!</h1>
                    <ul>
                        <a href="/admin" target="_blank"><li>Admin</li></a>
                        <a href="/graphql" target="_blank"><li>Graphql</li></a>
                    </ul>
                </div>
            </body>
        </html>
        '''
    )