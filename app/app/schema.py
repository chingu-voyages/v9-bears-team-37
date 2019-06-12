import graphene
import files.schema
import users.schema


class Query(users.schema.Query, files.schema.Query, graphene.ObjectType):
    pass


class Mutation(users.schema.Mutation, files.schema.Mutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)