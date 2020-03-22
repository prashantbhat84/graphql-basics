const User = {
  posts(parent, { db }, args, info) {
    return db.posts.filter(post => post.author === parent.id);
  },
  comments(parent, { db }, args, info) {
    return db.comments.filter(comment => comment.author === parent.id);
  }
};
export { User as default };
