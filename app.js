const Koa = require('koa');
const cron = require('node-cron');
const config = require('config');

const app = new Koa();
const logger = require('./utils/logger');
const { parseTemperature } = require('./services/temperatureParser');

require('./services/mongoConnection');

const { temperatureParser } = config.schedule;

cron.schedule(`*/${temperatureParser} * * * *`, () => {
  logger.info(`Parse temperature ${new Date()}`);
  parseTemperature();
});

module.exports = app;
