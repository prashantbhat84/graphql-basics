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
  deleteUser(parent, args, { db }, info) {
    const user = db.users.findIndex(user => user.id === args.id);
    if (user === -1) {
      throw new Error("No user exists");
    }
    const deletedUser = db.users.splice(user, 1);
    db.posts = db.posts.filter(post => {
      const match = post.author === args.id;
      if (match) {
        db.comments = db.comments.filter(comment => comment.post !== post.id);
      }
      return !match;
    });
    db.comments = db.comments.filter(comment => comment.author !== args.id);

    return deletedUser[0];
  },
  createPost(parent, args, { db, pubsub }, info) {
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
    if (published) {
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: post
        }
      });
    }
    return post;
  },
  updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const userexists = db.posts.find(post => post.id === id);
    const originalPost = { ...userexists };

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
    if (originalPost.published && !userexists.published) {
      //deleted
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: originalPost
        }
      });
    } else if (!originalPost.published && userexists.published) {
      //created
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: userexists
        }
      });
    } else if (userexists.published) {
      //updated
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: userexists
        }
      });
    }

    return userexists;
  },
  deletePost(parent, args, { db, pubsub }, info) {
    const verifyPost = db.posts.findIndex(post => post.id === args.id);
    if (verifyPost === -1) {
      throw new Error("No Post exists");
    }

    const [deletedPost] = db.posts.splice(verifyPost, 1);

    db.comments = db.comments.filter(comment => comment.post !== args.id);
    if (deletedPost.published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: deletedPost
        }
      });
    }

    return deletedPost;
  },
  createComment(parent, args, { db, pubsub }, info) {
    const { text, author, post } = args;
    const userExists = db.users.some(user => user.id === author);
    const postexists = db.posts.some(
      post1 => post1.published === true && post1.id === post
    );

    if (!userExists || !postexists) {
      throw new Error("Post/User does not exist");
    }
    const comment = {
      id: uuidv4(),
      ...args
    };
    db.comments.push(comment);
    pubsub.publish(`comment ${post}`, {
      comment: {
        mutation: "CREATED",
        data: comment
      }
    });

    return comment;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const verifyComment = db.comments.findIndex(
      comment => comment.id === args.id
    );
    if (verifyComment === -1) {
      throw new Error("Comment does not exist");
    }
    const [deletedComment] = db.comments.splice(verifyComment, 1);

    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: "DELETED",
        data: deletedComment
      }
    });

    return deletedComment;
  },
  updateComment(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const verifyComment = db.comments.find(comment => comment.id === id);
    if (!verifyComment) {
      throw new Error("Comment does not exist");
    }

    if (typeof data.text === "string") {
      verifyComment.text = data.text;
    }
    pubsub.publish(`comment ${verifyComment.post}`, {
      comment: {
        mutation: "UPDATED",
        data: verifyComment
      }
    });
    return verifyComment;
  }
};
export { Mutation as default };
