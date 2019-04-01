const mongoose = require('mongoose');

const { Schema } = mongoose;

const LastTempSchema = Schema({
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

const LastTemp = mongoose.model('LastTemp', LastTempSchema);

module.exports = LastTemp;
