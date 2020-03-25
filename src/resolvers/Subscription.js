const subscription = {
  count: {
    subscribe(parent, ctx, args, info) {
      const { pubsub } = ctx;
      let count = 0;

      return pubsub.asyncIterator("count");
    }
  }
};

export { subscription as default };
