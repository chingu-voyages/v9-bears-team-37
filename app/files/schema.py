import graphene
from graphene_django import DjangoObjectType
from .models import File

class FileType(DjangoObjectType):
    class Meta:
        model = File


class Query(graphene.ObjectType):
    files = graphene.List(FileType)

    def resolve_files(self, info):
        return File.objects.all()
