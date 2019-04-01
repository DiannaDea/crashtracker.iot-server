const mongoose = require('mongoose');
const Sensor = require('../models/Sensor');

const SensorProvider = {
  create: async ({ uuid, date, currentTemperature }) => {
    return Sensor.create({
      uuid,
      date,
      currentTemperature,
      _id: new mongoose.Types.ObjectId(),
    });
  },
};

module.exports = SensorProvider;
