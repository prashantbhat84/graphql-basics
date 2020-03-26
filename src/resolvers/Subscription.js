const subscription = {
  comment: {
    subscribe(parent, { postid }, { pubsub, db }, info) {
      const post = db.posts.find(post => post.id === postid && post.published);
      if (!post) {
        throw new Error("Post not found");
      }

      return pubsub.asyncIterator(`comment ${postid}`);
    }
  },
  post: {
    subscribe(parent, args, { pubsub }, info) {
      return pubsub.asyncIterator("post");
    }
  }
};

export { subscription as default };
