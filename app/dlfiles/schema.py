import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError

from .models import Dlfile


class DlfileType(DjangoObjectType):
    class Meta:
        model = Dlfile


class Query(graphene.ObjectType):
    dlfiles = graphene.List(DlfileType, search=graphene.String())

    def resolve_dlfiles(self, info, search=None):
        if search:
            return Dlfile.objects.filter(name__startswith=search)

        return Dlfile.objects.all()


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

        dlfile = Dlfile(name=name, description=description,
                        url=url, posted_by=user)
        dlfile.save()
        return CreateDlfile(dlfile=dlfile)


class UpdateDlfile(graphene.Mutation):
    dlfile = graphene.Field(DlfileType)

    class Arguments:
        dlfile_id = graphene.Int(required=True)
        name = graphene.String()
        description = graphene.String()
        url = graphene.String()

    def mutate(self, info, dlfile_id, name, url, description):
        user = info.context.user
        dlfile = Dlfile.objects.get(id=dlfile_id)

        if dlfile.posted_by != user:
            raise GraphQLError('Not permitted to update this')

        dlfile.name = name
        dlfile.description = description
        dlfile.url = url
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
