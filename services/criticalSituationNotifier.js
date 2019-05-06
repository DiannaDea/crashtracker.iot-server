const request = require('request-promise');
const config = require('config');

const CriticalProvider = require('../providers/CriticalProvider');
const logger = require('../utils/logger');

const { url } = config['base-api'];

async function sendCritcalToServer(sectorId, timeExcess) {
  const options = {
    uri: `${url}/api/sectors/${sectorId}/critical`,
    method: 'POST',
    json: true,
    body: {
      timeExcess,
    },
  };
  try {
    await request(options);
    logger.info(`Send critical notification to base server, sectorId: ${sectorId}`);
  } catch (error) {
    logger.error(`Error sending critical notification to base server, sectorId: ${sectorId}`, error);
  }
}

async function motitorCriticalTime() {
  // FIXME: combine if(32) + CriticalProvider.getAll()
  const criticalSituations = await CriticalProvider.getAll();

  await Promise.all(criticalSituations.map(async (situation) => {
    const { uuid, timeExcess } = situation;
    if (situation.timeExcess >= situation.maxTimeExcess) {
      await sendCritcalToServer(uuid, timeExcess);
    }
    return situation;
  }));
}

module.exports = {
  motitorCriticalTime,
};
