const IORedis = require('ioredis');

const client = new IORedis(process.env.REDIS_URI);

const maxListener = process.env.REDIS_MAX_LISTENER_COUNT
  ? parseInt(process.env.REDIS_MAX_LISTENER_COUNT)
  : 25;

client.setMaxListeners(maxListener);

/**
 *
 * @type {any}
 */
module.exports = client;
