const mongoose = require('mongoose');
const WorkStatus = require('../models/WorkStatus');

const WorkStatusProvider = {
  create: workParams => WorkStatus.create({
    _id: new mongoose.Types.ObjectId(),
    ...workParams,
  }),
  checkIfExists: uuid => WorkStatus.findOne({ uuid }),
  update: (uuid, updParams) => WorkStatus.updateOne({ uuid }, { ...updParams }),
  increaseValues: (uuid, fields) => WorkStatus.updateOne({ uuid }, {
    $inc: fields,
  }),
  findForService: () => WorkStatus.find({}).$where('this.hours >= this.notificationHours'),
};

module.exports = WorkStatusProvider;
