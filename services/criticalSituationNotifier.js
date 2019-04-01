const CriticalProvider = require('../providers/CriticalProvider');
const logger = require('../utils/logger');

async function motitorCriticalTime() {
  const criticalSituations = await CriticalProvider.getAll();

  await Promise.all(criticalSituations.map((situation) => {
    if (situation.timeExcess >= situation.maxTimeExcess) {
      logger.info('===== send critical notifcation');
    }
    return situation;
  }));
}

module.exports = {
  motitorCriticalTime,
};
