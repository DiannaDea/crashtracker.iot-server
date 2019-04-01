const Koa = require('koa');
const schedule = require('node-schedule');
const config = require('config');

const app = new Koa();
const logger = require('./utils/logger');
const { parseTemperature } = require('./services/temperatureParser');
const { motitorCriticalTime } = require('./services/criticalSituationNotifier.js');

require('./services/mongoConnection');

const { temperatureParserTime, criticalNotifierTime } = config.schedule;

schedule.scheduleJob(`*/${temperatureParserTime} * * * *`, () => {
  logger.info(`Parse temperature ${new Date()}`);
  parseTemperature();
});

schedule.scheduleJob(`*/${criticalNotifierTime} * * * *`, () => {
  logger.info(`Send critical notifcation ${new Date()}`);
  motitorCriticalTime();
});

module.exports = app;
