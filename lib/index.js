const path = require("path");
const fastify = require("fastify");
const fastifyStatic = require("@fastify/static");
const mercurius = require("mercurius");
const mercuriusUpload = require("mercurius-upload");
const gqlUpload = require("graphql-upload/GraphQLUpload.js");

const gql = String.raw;

const app = fastify({ logger: true });

app.register(fastifyStatic, {
  root: path.join(__dirname, "..", "static"),
  index: "index.html",
});

const schema = gql`
  scalar Upload

  type Query {
    dummy: Boolean
  }

  type Mutation {
    dummy(file: Upload!): Boolean
  }
`;

const resolvers = {
  Upload: gqlUpload,
  Query: {
    dummy: () => true,
  },
  Mutation: {
    dummy: async (_, { file }) => {
      throw new Error("dummy");
    },
  },
};

app.register(mercuriusUpload);
app.register(mercurius, {
  schema,
  resolvers,
  graphiql: true,
});

app.listen({
  port: 8888,
});
