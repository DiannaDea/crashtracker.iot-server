const request = require('request-promise');
const config = require('config');

const CriticalProvider = require('../providers/CriticalProvider');
const logger = require('../utils/logger');

const { host, port, protocol } = config['base-api'];

async function sendCritcalToServer(sectorId, maxTimeExcess, timeExcess) {
  const options = {
    uri: `${protocol}://${host}:${port}/api/devices/critical`,
    method: 'POST',
    json: true,
    body: {
      sectorId,
      maxTimeExcess,
      timeExcess,
    },
  };
  try {
    await request(options);
    logger.info('===== send critical notification');
  } catch (error) {
    logger.error('===== ERROR sending critical notification', error);
  }
}

async function motitorCriticalTime() {
  const criticalSituations = await CriticalProvider.getAll();

  await Promise.all(criticalSituations.map(async (situation) => {
    const { uuid, timeExcess, maxTimeExcess } = situation;
    if (situation.timeExcess >= situation.maxTimeExcess) {
      await sendCritcalToServer(uuid, maxTimeExcess, timeExcess);
    }
    return situation;
  }));
}

module.exports = {
  motitorCriticalTime,
};
