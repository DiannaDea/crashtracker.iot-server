const Koa = require('koa');

const app = new Koa();
const { parseTemperature } = require('./services/temperatureParser');

require('./services/mongoConnection');

parseTemperature();

module.exports = app;
