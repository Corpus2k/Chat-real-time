import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();
const MESSAGE_SENT = 'MESSAGE_SENT';


let messages = [];

const resolvers = {
  Query: {
    messages: () => messages, 
  },
  Mutation: {
    sendMessage: (_, { user, content }) => {
      const message = { id: Date.now().toString(), user, content };

      messages.push(message);

      pubsub.publish(MESSAGE_SENT, { messageSent: message });

      return message;
    },
  },
  Subscription: {
    messageSent: {
      subscribe: () => pubsub.asyncIterator([MESSAGE_SENT]), 
    },
  },
};

export { resolvers};
