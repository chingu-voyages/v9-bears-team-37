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


class CreateFile(graphene.Mutation):
    file = graphene.Field(FileType)

    class Arguments:
        name = graphene.String()
        description = graphene.String()
        size = graphene.String()
        url = graphene.String()
        downloadable_at = graphene.DateTime()
        downloadable_during = graphene.String()

    def mutate(self, info, name, description, 
            size, url, downloadable_at, 
            downloadable_during):
        file = File(name=name, desciption=description, 
            size=size, url=url, downloadable_at=downloadable_at, 
            downloadable_during=downloadable_during)
        file.save()
        return CreateFile(file=file)




