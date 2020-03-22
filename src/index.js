import { GraphQLServer } from "graphql-yoga";

// demo user data
const users = [
  { id: "1", name: "Samrth", email: "sam@gmail.com", age: 20 },
  { id: "2", name: "Pragati", email: "pra@gmail.com", age: 30 },
  { id: "3", name: "prashant", email: "prashantbhat@gmail.com" }
];
const posts = [
  {
    id: "1",
    title: "my post 1",
    body: "my first post",
    published: true,
    author: "1"
  },
  {
    id: "2",
    title: "my post 2",
    body: "my second post",
    published: true,
    author: "1"
  },
  {
    id: "1",
    title: "my post 3",
    body: "my third post",
    published: false,
    author: "3"
  }
];
const comments = [
  { id: "102", text: "comment1", author: "1" },
  { id: "103", text: "comment2", author: "2" },
  { id: "104", text: "comment3", author: "3" },
  { id: "105", text: "commen41", author: "2" }
];
//Type Definations(application schema)
// in array excalmation inside means  the arrays cannot be null an
const typeDefs = `
type Query{
   
    me:User!
     post:Post!
     users(query:String):[User!]!
    posts(search:String):[Post!]!
    comments:[Comment!]!
    
}

type User{
    id:ID!
    name:String!
    email:String!
    age:Int
    posts:[Post!]!
    comments:[Comment!]!

}
type Post{
    id:ID!
    title:String!
    body:String!
    published:Boolean!
    author:User!
}
type Comment{
 id:ID!
 text:String!
 author:User!
  
}
`;

//Resolvers (functions)

const resolvers = {
  Query: {
    // four args parent(relational data)
    // args operation args
    // ctx context data
    //info  operation info

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
    },
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter(user => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts(parent, args, ctx, info) {
      if (!args.search) {
        return posts;
      }

      return posts.filter(post => {
        return (
          post.body.toLowerCase().includes(args.search.toLowerCase()) ||
          post.title.toLowerCase().includes(args.search.toLowerCase())
        );
      });
    },
    comments(parent, args, ctx, info) {
      return comments;
    }
  },

  //  this  is for relationship between Post and user foreign key in types
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    }
  },
  User: {
    posts(parent, ctx, args, info) {
      return posts.filter(post => post.author === parent.id);
    },
    comments(parent, ctx, args, info) {
      return comments.filter(comment => comment.author === parent.id);
    }
  },
  Comment: {
    author(parent, ctc, args, info) {
      return users.find(user => {
        return user.id == parent.author;
      });
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
