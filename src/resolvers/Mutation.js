import { v4 as uuidv4 } from "uuid";
const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some(user => user.email === args.data.email);
    if (emailTaken) {
      throw new Error("Email Taken");
    }
    const { name, email, age } = args;
    const user = {
      id: uuidv4(),
      ...args.data
    };
    db.users.push(user);
    return user;
  },
  updateUser(parent, args, { db }, info) {
    const { data, id } = args;
    const userExists = db.users.find(user => user.id === id);
    if (!userExists) {
      throw new Error("No User");
    }
    if (typeof data.email === "string") {
      const emailTaken = db.users.some(user => user.email === data.email);
      if (emailTaken) {
        throw new Error("Email Taken");
      }
      userExists.email = data.email;
    }

    if (typeof data.name === "string") {
      userExists.name = data.name;
    }
    if (typeof data.age !== undefined) {
      userExists.age = data.age;
    }
    return userExists;
  },
  createPost(parent, args, { db }, info) {
    const { title, body, published, author } = args.data;
    const userExists = db.users.some(user => user.id === author);
    if (!userExists) {
      throw new Error("No User found");
    }
    const post = {
      id: uuidv4(),
      ...args.data
    };
    db.posts.push(post);
    return post;
  },
  updatePost(parent, args, { db }, info) {
    const { id, data } = args;
    const userexists = db.posts.find(post => post.id === id);
    console.log(userexists);

    if (!userexists) {
      throw new Error("No post found");
    }
    if (typeof data.title === "string") {
      userexists.title = data.title;
    }
    if (typeof data.body === "string") {
      userexists.body = data.body;
    }
    if (typeof data.published === "boolean") {
      userexists.published = data.published;
    }

    return userexists;
  },
  createComment(parent, args, { db }, info) {
    const { text, author, post } = args;
    const userExists = db.users.some(user => user.id === author);
    const postexists = db.posts.some(
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
    db.comments.push(comment);
    console.log(db.comments);

    return comment;
  },
  deleteUser(parent, args, { db }, info) {
    const user = db.users.findIndex(user => user.id === args.id);
    if (user === -1) {
      throw new Error("No user exists");
    }
    const deletedUser = db.users.splice(user, 1);
    posts = db.posts.filter(post => post.author !== args.id); // comments to be deleted later after response from andrew
    // posts = posts.filter(post => {
    //   const match = post.filter === args.id;
    //   if (match) {
    //     comments = comments.filter(comment => comment.post !== post.id);
    //   }
    // });
    return deletedUser[0];
  }
};
export { Mutation as default };
