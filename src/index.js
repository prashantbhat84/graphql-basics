import { GraphQLServer } from "graphql-yoga";
import { v4 as uuidv4 } from "uuid";

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
    id: "3",
    title: "my post 3",
    body: "my third post",
    published: false,
    author: "3"
  }
];
const comments = [
  { id: "102", text: "comment1", author: "1", postid: "1" },
  { id: "103", text: "comment2", author: "2", postid: "2" },
  { id: "104", text: "comment3", author: "3", postid: "3" },
  { id: "105", text: "commen41", author: "3", postid: "3" }
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
type Mutation{
  createUser(data:createUserInput!):User!
  createPost(data:createPostInput!):Post!
  createComment(text:String! author:ID! post:ID!):Comment!
}
input createUserInput{
  name:String!
  email:String!
  age:Int
}
input createPostInput{
  title:String!
  body:String!
  published:Boolean!
  author:ID!
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
    comments:[Comment!]!
}
type Comment{
 id:ID!
 text:String!
 author:User!
 post:Post!
  
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
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some(user => user.email === args.data.email);
      if (emailTaken) {
        throw new Error("Email Taken");
      }
      const { name, email, age } = args;
      const user = {
        id: uuidv4(),
        ...args.data
      };
      users.push(user);
      return user;
    },
    createPost(parent, args, ctx, info) {
      const { title, body, published, author } = args.data;
      const userExists = users.some(user => user.id === author);
      if (!userExists) {
        throw new Error("No User found");
      }
      const post = {
        id: uuidv4(),
        ...args.data
      };
      posts.push(post);
      return post;
    },
    createComment(parent, args, ctx, info) {
      const { text, author, post } = args;
      const userExists = users.some(user => user.id === author);
      const postexists = posts.some(
        post1 => post1.published === true && post1.id === post
      );
      console.log(postexists);
      console.log(userExists);

      if (!userExists || !postexists) {
        throw new Error("Post/User does not exist");
      }
      const comment = {
        id: uuidv4(),
        ...args
      };
      comments.push(comment);
      console.log(comments);

      return comment;
    }
  },

  //  this  is for relationship between Post and user foreign key in types (queries/read)
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    comments(parent, ctx, args, info) {
      return comments.filter(comment => comment.postid === parent.id);
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
    author(parent, ctx, args, info) {
      return users.find(user => {
        return user.id == parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find(post => post.id === parent.postid);
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});
const options = {
  port: 5000
};
server.start(options, () => {
  console.log("Server started");
});
