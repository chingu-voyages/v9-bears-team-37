import graphene
from django.db.models import Q
from graphene_django import DjangoObjectType
from graphql import GraphQLError

from .models import Dlfile
from verification.helpers import generate_token


class DlfileType(DjangoObjectType):
    class Meta:
        model = Dlfile


class Query(graphene.ObjectType):
    dlfiles = graphene.List(
        DlfileType, 
        posted_by__id=graphene.Int(required=False), 
        posted_by__email=graphene.String(required=False),
        file_token=graphene.String(required=False))

    def resolve_dlfiles(self, info, posted_by__id=None, posted_by__email=None, file_token=None):
        if posted_by__id or posted_by__email:
            user = info.context.user
            if user.is_anonymous:
                raise GraphQLError('Log in to see the file')
            
            if posted_by__id:
                filter = (Q(posted_by__id__exact=posted_by__id))
                return Dlfile.objects.filter(filter)
            elif posted_by__email:
                filter = (Q(posted_by__email__exact=posted_by__email))
                return Dlfile.objects.filter(filter)
        elif file_token:
            filter = (Q(file_token__exact=file_token))
            return Dlfile.objects.filter(filter)
        else:
            raise GraphQLError('No query variable found!')


class CreateDlfile(graphene.Mutation):
    dlfile = graphene.Field(DlfileType)

    class Arguments:
        name = graphene.String()
        description = graphene.String()
        url = graphene.String()

    def mutate(self, info, name, description, url):
        user = info.context.user

        if user.is_anonymous:
            raise GraphQLError('Log in to upload a file')

        file_token = generate_token()

        dlfile = Dlfile(name=name, description=description,
                        url=url, file_token=file_token, posted_by=user)
        dlfile.save()
        return CreateDlfile(dlfile=dlfile)


class UpdateDlfile(graphene.Mutation):
    dlfile = graphene.Field(DlfileType)

    class Arguments:
        dlfile_id = graphene.Int(required=True)
        name = graphene.String()
        description = graphene.String()
        url = graphene.String()
        token_sent = graphene.Boolean()

    def mutate(self, info, dlfile_id, name=None, description=None, url=None, token_sent=None):
        user = info.context.user
        dlfile = Dlfile.objects.get(id=dlfile_id)

        if dlfile.posted_by != user:
            raise GraphQLError('Not permitted to update this')

        if name:
            dlfile.name = name
        if description:
            dlfile.description = description
        if url:
            dlfile.url = url
        if token_sent:
            dlfile.token_sent = token_sent

        dlfile.save()

        return UpdateDlfile(dlfile=dlfile)


class DeleteDlfile(graphene.Mutation):
    dlfile_id = graphene.Int()

    class Arguments:
        dlfile_id = graphene.Int(required=True)

    def mutate(self, info, dlfile_id):
        user = info.context.user
        dlfile = Dlfile.objects.get(id=dlfile_id)

        if dlfile.posted_by != user:
            raise GraphQLError('Not permitted to delete this file')

        dlfile.delete()

        return DeleteDlfile(dlfile_id=dlfile_id)


class Mutation(graphene.ObjectType):
    create_dlfile = CreateDlfile.Field()
    update_dlfile = UpdateDlfile.Field()
    delete_dlfile = DeleteDlfile.Field()
