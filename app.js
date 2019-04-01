const Koa = require('koa');
const cron = require('node-cron');

const app = new Koa();
const logger = require('./utils/logger');
const { parseTemperature } = require('./services/temperatureParser');

require('./services/mongoConnection');

cron.schedule('*/5 * * * *', () => {
  logger.info(`Parse temperature ${new Date()}`);
  parseTemperature();
});

module.exports = app;
