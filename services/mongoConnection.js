const Mongoose = require('mongoose');
const config = require('config');

const logger = require('../utils/logger');

Mongoose.set('debug', true);
Mongoose.Promise = global.Promise;

const {
  user,
  host,
  name,
  port,
  password,
} = config['mongo-db'];

const connString = `mongodb://${user}:${password}@${host}:${port}/${name}`;

Mongoose
  .connect(connString, { useNewUrlParser: true })
  .then(() => {
    logger.info('Connection to MongoDB has been established successfully.');
  })
  .catch((err) => {
    logger.error('Unable to connect to the MongoDB database:', err);
  });