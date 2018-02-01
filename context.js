const rabbitJS = require('rabbit.js');
const { getURL } = require('./helper');
const { getLogger } = require('./helper');

function createContext(config, cb, counter = 0) {
  const reconnect = config.reconnect || 10;
  const timeout = config.timeout || 1000;
  let context = rabbitJS.createContext(getURL(config));
  context.on('error', (err) => {
    if (!err) {
      return;
    }

    getLogger(config).error(`ERROR: ${JSON.stringify(err)}`);
    getLogger(config).info(`Reconnecting to RabbitMQ in ${timeout}ms...`);
    if (counter < reconnect) {
      setTimeout((time) => {
        context = createContext(config, cb, time);
      }, timeout, counter + 1);
    }

  });
  context.on('ready', () => {
    cb(context);
  });
}


module.exports = createContext;
