const Koa = require('koa');
const schedule = require('node-schedule');
const config = require('config');

const app = new Koa();
const logger = require('./utils/logger');
const { parseTemperature } = require('./services/temperatureParser');
const { motitorCriticalTime } = require('./services/criticalSituationNotifier.js');
const { updateTemps } = require('./services/updateCurrentTemps');
const { monitorService } = require('./services/serviceNotifier');

require('./services/mongoConnection');

const {
  temperatureParserTime,
  criticalNotifierTime,
  updateCurTemps,
  serviceNotifierTime,
} = config.schedule;

schedule.scheduleJob(`*/${temperatureParserTime} * * * *`, () => {
  logger.info(`Parse temperature ${new Date()}`);
  parseTemperature();
});

schedule.scheduleJob(`*/${criticalNotifierTime} * * * *`, () => {
  logger.info(`Send critical notification ${new Date()}`);
  motitorCriticalTime();
});

schedule.scheduleJob(`*/${updateCurTemps} * * * *`, () => {
  logger.info(`Send updated temperatures ${new Date()}`);
  updateTemps();
});

schedule.scheduleJob(`*/${serviceNotifierTime} * * * *`, () => {
  logger.info(`Send service notification ${new Date()}`);
  monitorService();
});

module.exports = app;
