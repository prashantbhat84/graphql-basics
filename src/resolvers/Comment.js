const Comment = {
  author(parent, { db }, args, info) {
    return db.users.find(user => {
      return user.id == parent.author;
    });
  },
  post(parent, args, { db }, info) {
    return db.posts.find(post => post.id === parent.postid);
  }
};
export { Comment as default };
