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

    def mutate(self, info, **kwargs):
        user = info.context.user

        if user.is_anonymous:
            raise Exception('Log in to add a file!')
        
        name = kwargs.get('name')
        description = kwargs.get('description')
        size = kwargs.get('size')
        url = kwargs.get('url')
        downloadable_at = kwargs.get('downloadable_at')
        downloadable_during = kwargs.get('downloadable_during')

        file = File(name=name, description=description, 
            size=size, url=url, downloadable_at=downloadable_at, 
            downloadable_during=downloadable_during, posted_by=user)
        file.save()
        return CreateFile(file=file)


class UpdateFile(graphene.Mutation):
    file = graphene.Field(FileType)

    class Arguments:
        file_id = graphene.Int(required=True)
        name = graphene.String()
        description = graphene.String()
        size = graphene.String()
        url = graphene.String()
        downloadable_at = graphene.DateTime()
        downloadable_during = graphene.String()
    
    def mutate(self, info, **kwargs):
        user = info.context.user
        file = File.objects.get(id=kwargs.get("file_id"))

        if file.posted_by != user:
            raise Exception('Not permitted to update this file!')
        
        file.name = kwargs.get('name')
        file.description = kwargs.get('description')
        file.size = kwargs.get('size')
        file.url = kwargs.get('url')
        file.downloadable_at = kwargs.get('downloadable_at')
        file.downloadable_during = kwargs.get('downloadable_during')
        file.save()
        return UpdateFile(file=file)

class Mutation(graphene.ObjectType):
    create_file = CreateFile.Field()
    update_file = UpdateFile.Field()
