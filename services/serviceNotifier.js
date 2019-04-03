const request = require('request-promise');
const config = require('config');

const WorkStatusProvider = require('../providers/WorkStatusProvider');
const logger = require('../utils/logger');

const { host, port, protocol } = config['base-api'];

async function sendServiceToServer({ uuid, hours, minutes }) {
  const options = {
    uri: `${protocol}://${host}:${port}/api/sectors/${uuid}/service`,
    method: 'POST',
    json: true,
    body: {
      hours,
      minutes,
    },
  };
  try {
    await request(options);
    logger.info(`Send service notification to base server, sectorId: ${uuid}`);
  } catch (error) {
    logger.error(`Error sending service notification to base server, sectorId: ${uuid}`, error);
  }
}

async function monitorService() {
  const workStatuses = await WorkStatusProvider.findForService();

  await Promise.all(workStatuses.map(async (workStatus) => {
    await sendServiceToServer(workStatus);
    return workStatus;
  }));
}

module.exports = {
  monitorService,
};
