const http = require('http');
const config = require('config');
const app = require('./app');
const logger = require('./utils/logger');

const { host, port } = config.app;

http
  .createServer(app.callback())
  .listen(port, err => ((err)
    ? logger.error('Error in running server', err)
    : logger.info(`Server running on  ${host}:${port}`)));