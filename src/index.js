import { GraphQLServer } from "graphql-yoga";

//Type Definations(application schema)
const typeDefs = `
type Query{
    hello: String!,
    name:String!,
    location:String!,
    bio:String!
}
`;

//Resolvers (functions)

const resolvers = {
  Query: {
    hello() {
      return "this is my first graphql query";
    },
    name() {
      return "Prashant Bhat";
    },
    location() {
      return "Bangalore";
    },
    bio() {
      return "I am a  software programmer";
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});
const options = {
  port: 3000
};
server.start(options, () => {
  console.log("Server started");
});
