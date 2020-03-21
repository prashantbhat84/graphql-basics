import { GraphQLServer } from "graphql-yoga";

//Type Definations(application schema)
const typeDefs = `
type Query{
    greeting(name:String,position:String):String!
    me:User!
    post:Post!
    add(val1:Float!,val2:Float):Float!
}

type User{
    id:ID!
    name:String!
    email:String!
    age:Int

}
type Post{
    id:ID!
    title:String!
    body:String!
    published:Boolean!
}
`;

//Resolvers (functions)

const resolvers = {
  Query: {
    // four args parent(relational data)
    // args operation args
    // ctx context data
    //info  operation info
    greeting(parent, args, ctx, info) {
      if (args.name) {
        return `hello ! ${args.name} and you are hired as ${args.position}`;
      }
      return "hello";
    },
    add(parent, args, ctx, info) {
      if (!args.val2) {
        return args.val1 + 50;
      }
      return args.val1 + args.val2;
    },
    me() {
      return {
        id: "abc123",
        name: "Prashant Bhat",
        email: "prashant@gmail.com"
      };
    },
    post() {
      return {
        id: "alpa123",
        title: "My graphql api",
        body: "My own api",
        published: false
      };
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
