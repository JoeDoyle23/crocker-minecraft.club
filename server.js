'use strict';

const path = require('path');
const fastify = require('fastify')({ logger: true, trustProxy: true });
const fastify_static = require('fastify-static');

fastify.register(fastify_static, {
  root: path.join(__dirname, 'public'),
  prefix: '/',
});

const start = async () => {
  try {
    await fastify.listen(process.env.PORT || 3001, '0.0.0.0');
    fastify.log.info(`Crocker Minecraft Club Server running at: ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

process.on('SIGTERM', () => {
  server.stop(() => {
    process.exit(0);
  });
});

start();
