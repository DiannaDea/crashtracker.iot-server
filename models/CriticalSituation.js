const mongoose = require('mongoose');

const { Schema } = mongoose;

const CriticalSituationSchema = Schema({
  _id: Schema.Types.ObjectId,
  uuid: {
    type: Schema.Types.String,
    required: true,
  },
  timeExcess: {
    type: Schema.Types.Number,
    allowNull: false,
  },
  maxTimeExcess: {
    type: Schema.Types.Number,
    allowNull: false,
  },
});

const CriticalSituation = mongoose.model('CriticalSituation', CriticalSituationSchema);

module.exports = CriticalSituation;
