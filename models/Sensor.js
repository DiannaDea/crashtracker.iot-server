const mongoose = require('mongoose');

const { Schema } = mongoose;

const SensorSchema = Schema({
  _id: Schema.Types.ObjectId,
  uuid: {
    type: Schema.Types.String,
    required: true,
  },
  currentTemperature: {
    type: Schema.Types.String,
    required: true,
  },
  date: {
    type: Schema.Types.Date,
    default: Date.now(),
  },
});

const Sensor = mongoose.model('Sensor', SensorSchema);

module.exports = Sensor;
