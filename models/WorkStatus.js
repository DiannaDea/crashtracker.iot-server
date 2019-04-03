const mongoose = require('mongoose');

const { Schema } = mongoose;

const WorkStatusSchema = Schema({
  _id: Schema.Types.ObjectId,
  uuid: {
    type: Schema.Types.String,
    required: true,
  },
  // percent of serviceInterval in hours
  notificationHours: {
    type: Schema.Types.Number,
    required: true,
  },
  hours: {
    type: Schema.Types.Number,
    required: true,
    default: 0,
  },
  minutes: {
    type: Schema.Types.Number,
    required: true,
    default: 0,
  },
});

const WorkStatus = mongoose.model('WorkStatus', WorkStatusSchema);

module.exports = WorkStatus;
