const config = require("./config");
const services = require("./services/services")({ config });
const routes = require("./routes");
const Sentry = require("@sentry/node");

if (process.env.SENTRY_ENABLED) {
  Sentry.init({dsn: process.env.SENTRY_DSN, tracesSampleRate: 1.0});
}

// Require the framework and instantiate it
const fastify = require("fastify")({ logger: true });

fastify.setErrorHandler(async (error, request, reply) => {
  // Logging locally
  console.log(error);
  // Sending error to be logged in Sentry
  if (process.env.SENTRY_ENABLED) {
    Sentry.captureException(error);
  }
  reply.status(500).send({ error: "Something went wrong" });
})

// Declares routes
routes.forEach(route => fastify.route(route({ config, services })));

// Run the server!
const start = async () => {
  const server_port = process.env.PORT;
  try {
    await fastify.listen(server_port);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
