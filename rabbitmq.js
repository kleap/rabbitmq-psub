const { SocketTypes, Routing } = require('./constants');

module.exports = (context) => ({
  publish: (topic, event, data, listener) => {
    const socket = context.socket(SocketTypes.PUB, { routing: Routing.TOPIC });
    socket.connect(topic, () => {
      socket.publish(event, JSON.stringify(data));
    });
    socket.on('error', listener);
  },
  subscribe: (topic, event, listener) => {
    const socket = context.socket(SocketTypes.SUB, { routing: Routing.TOPIC });
    socket.connect(topic, event, () => {
      socket.on('data', (data) => {
        listener(null, JSON.parse(data.toString()));
      });
    });
    socket.on('error', (err) => {
      listener(err);
    });
  },
});
