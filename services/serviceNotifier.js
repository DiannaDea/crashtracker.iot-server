const request = require('request-promise');
const config = require('config');

const WorkStatusProvider = require('../providers/WorkStatusProvider');
const logger = require('../utils/logger');

const { url } = config['base-api'];

async function sendServiceToServer({ uuid }) {
  const options = {
    uri: `${url}/api/sectors/${uuid}/service`,
    method: 'PUT',
    json: true,
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
