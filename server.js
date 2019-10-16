const { ApolloServer, gql } = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');
const { EmailAddressResolver } = require('graphql-scalars');

const logger = require('./helpers/logger');
const { petResolvers, petTypeDefs } = require('./pet/schema');
const { ownerResolvers, ownerTypeDefs } = require('./owner/schema');

const rootTypeDefs = gql`
  scalar Email

  type Query
  type Mutation
  schema {
    query: Query
    mutation: Mutation
  }
`;

const schema = makeExecutableSchema({
  typeDefs: [rootTypeDefs, petTypeDefs, ownerTypeDefs],
  resolvers: {
    Email: EmailAddressResolver,
    Query: {
      ...petResolvers.Query,
      ...ownerResolvers.Query,
    },
    Mutation: {
      ...petResolvers.Mutation,
      ...ownerResolvers.Mutation,
    },
    Pet: petResolvers.Pet,
    Owner: ownerResolvers.Owner,
  },
});

const server = new ApolloServer({
  schema,
  formatError(error) {
    logger.info('server error:', error);
    return error;
  },
  introspection: true,
  playground: true,
});

const port = process.env.PORT || 4000;

server.listen({ port }).then(({ url }) => {
  logger.info(`🚀  Server ready at ${url}`);
});

module.exports = server;
