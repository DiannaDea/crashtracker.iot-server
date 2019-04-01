const mongoose = require('mongoose');
const config = require('config');
const CriticalSituation = require('../models/CriticalSituation');

const { temperatureParserTime } = config.schedule;

const CriticalProvider = {
  create: criticalParams => CriticalSituation.create({
    _id: new mongoose.Types.ObjectId(),
    ...criticalParams,
    timeExcess: temperatureParserTime,
  }),
  checkIfExists: uuid => CriticalSituation.findOne({ uuid }),
  updateTime: async (uuid) => {
    const critical = await CriticalSituation.findOne({ uuid });
    return critical.update({
      timeExcess: critical.timeExcess + temperatureParserTime,
    });
  },
  removeCriticalSituation: uuid => CriticalSituation.findOneAndDelete({ uuid }),
  getAll: () => CriticalSituation.find({}),
};

module.exports = CriticalProvider;
