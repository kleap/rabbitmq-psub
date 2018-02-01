const createContext = require('./context');
const rabbitmqFactory = require('./rabbitmq');
const { getLogger } = require('./helper');

const pendingRequests = { publish: [], subscribe: [] };

const mockContext = {
  publish: (...rest) => {
    pendingRequests.publish.push(rest);
  },
  subscribe: (...rest) => {
    pendingRequests.subscribe.push(rest);
  },
};

let activeContext = mockContext;

const initContext = (config) => {
  createContext(config, (context) => {
    const logger = getLogger(config);
    logger.info('Connection to RabbitMQ is ready.');
    activeContext = rabbitmqFactory(context);

    pendingRequests.publish.forEach((args) => {
      activeContext.publish(...args);
    });
    pendingRequests.subscribe.forEach((args) => {
      activeContext.subscribe(...args);
    });
  });
};

module.exports = (config) => {
  initContext(config);
  return {
    /**
       * Params- topic, event, data, listener
       */
    publish: (...rest) => {
      activeContext.publish(...rest);
    },

    /**
    * Params- topic, event, listener
    */
    subscribe: (...rest) => {
      activeContext.subscribe(...rest);
    },
  };
};
