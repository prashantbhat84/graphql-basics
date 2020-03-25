const subscription = {
  count: {
    subscribe(parent, args, { pubsub }, info) {
      let count = 0;
      setInterval(() => {
        count++;
        console.log(count);

        pubsub.publish("count", {
          count
        });
      }, 1000);
      return pubsub.asyncIterator("count");
    }
  },
  comment: {
    subscribe(parent, { postid }, { pubsub, db }, info) {
      const post = db.posts.find(post => post.id === postid && post.published);
      if (!post) {
        throw new Error("Post not found");
      }

      return pubsub.asyncIterator(`comment ${postid}`);
    }
  }
};

export { subscription as default };
