import graphene
import files.schema


class Query(files.schema.Query, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query)