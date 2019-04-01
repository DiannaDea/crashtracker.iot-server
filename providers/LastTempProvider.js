const mongoose = require('mongoose');
const LastTemperatures = require('../models/LastTemperatures');

const LastTempProvider = {
  create: async lastTempData => LastTemperatures.create({
    _id: new mongoose.Types.ObjectId(),
    ...lastTempData,
  }),
  getAll: async () => LastTemperatures.find({}),
  deleteAll: async () => LastTemperatures.deleteMany({}),
};

module.exports = LastTempProvider;
