import { GraphQLServer, PubSub } from "graphql-yoga";

import db from "./db";
import Comment from "./resolvers/Comment";
import User from "./resolvers/User";
import Post from "./resolvers/Post";
import Mutation from "./resolvers/Mutation";
import Query from "./resolvers/Query";
import Subscription from "./resolvers/Subscription";

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: "./src/schemas/schema.graphql",
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Comment,
    Post
  },
  context: {
    db,
    pubsub
  }
});

const options = {
  port: 5000
};
server.start(options, () => {
  console.log("Server started");
});
