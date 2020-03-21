import { GraphQLServer } from "graphql-yoga";

//Type Definations(application schema)
const typeDefs = `
type Query{
    greeting(name:String,position:String):String!
    me:User!
    grades:[Int]!
    post:Post!
    add(numbers:[Int]):Float!
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
      let sum = 0;
      if (args.numbers.length > 0) {
        args.numbers.map(number => {
          sum = sum + number;
        });
      }
      return sum;
    },
    grades(parent, args, ctx, info) {
      return [99, 80, 93];
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
