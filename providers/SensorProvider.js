const mongoose = require('mongoose');
const Sensor = require('../models/Sensor');

const SensorProvider = {
  create: async ({ uuid, date, currentTemperature }) => Sensor.create({
    _id: new mongoose.Types.ObjectId(),
    uuid,
    date,
    currentTemperature,
  }),
};

module.exports = SensorProvider;
