const WorkStatus = require('../models/WorkStatus');

const WorkStatusProvider = {
  create: workParams => WorkStatus.create({ ...workParams }),
  checkIfExists: uuid => WorkStatus.findOne({ uuid }),
  update: (uuid, updParams) => WorkStatus.findOneAndUpdate({ uuid }, { updParams }),
  findForService: () => WorkStatus.find({}).$where('this.hours > this.notificationHours'),
};

module.exports = WorkStatusProvider;
