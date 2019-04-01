const mongoose = require('mongoose');
const config = require('config');
const CriticalSituation = require('../models/CriticalSituation');

const { temperatureParser } = config.schedule;

const CriticalProvider = {
  create: async criticalParams => CriticalSituation.create({
    _id: new mongoose.Types.ObjectId(),
    ...criticalParams,
    timeExcess: temperatureParser,
  }),
  checkIfExists: async uuid => CriticalSituation.findOne({ uuid }),
  updateTime: async (uuid) => {
    const critical = await CriticalSituation.findOne({ uuid });
    return critical.update({
      timeExcess: critical.timeExcess + temperatureParser,
    });
  },
  removeCriticalSituation: uuid => CriticalSituation.findOneAndDelete({ uuid }),
};

module.exports = CriticalProvider;
