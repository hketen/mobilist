require('dotenv').config(); // import ENV file

const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const globalErrorHandler = require('./handlers/global-error.handler');
const controllers = require('./controllers');
const migrations = require('./utils/sequelize-migrations');
const sentry = require('./utils/sentry-express');
const isProduction = require('./utils/is-production');
const swagger = require('./utils/swagger');
const i18nextIntegration = require('./utils/i18next-integration');

module.exports = (async () => {
  const { PORT } = process.env;

  const app = express();

  await i18nextIntegration(app);

  sentry.init(app);

  app.use(cors());
  app.use(express.json({ limit: '5mb', extended: false }));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  await swagger(app);

  controllers(app);

  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.use(globalErrorHandler);

  sentry.errorHandler(app);

  await migrations();

  await app.listen(PORT);

  const envText = isProduction ? 'PROD' : 'DEV';
  console.log(
    `${process.env.npm_package_name} service ${envText} listening...\nOpen: http://localhost:${PORT}\nOpen Docs: http://localhost:${PORT}/api-docs`
  );
})();
