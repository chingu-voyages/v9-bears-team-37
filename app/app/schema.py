import graphene
import files.schema


class Query(files.schema.Query, graphene.ObjectType):
    pass


class Mutation(files.schema.Mutation, graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)