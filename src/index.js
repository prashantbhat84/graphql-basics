import { GraphQLServer } from "graphql-yoga";

import db from "./db";
import Comment from "./resolvers/Comment";
import User from "./resolvers/User";
import Post from "./resolvers/Post";
import Mutation from "./resolvers/Mutation";
import Query from "./resolvers/Query";

//Resolvers (functions)

const server = new GraphQLServer({
  typeDefs: "./src/schemas/schema.graphql",
  resolvers: {
    Query,
    Mutation,
    User,
    Comment,
    Post
  },
  context: {
    db
  }
});
const options = {
  port: 5000
};
server.start(options, () => {
  console.log("Server started");
});
