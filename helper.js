exports.getURL = ({ host, port }) => {
  const url = `amqp://${host}:${port}`;
  return url;
};

exports.getLogger = (config) => {
  const logger = config.logger || console;
  return logger;
};