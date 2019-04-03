const request = require('request-promise');
const config = require('config');

const LastTempProvider = require('../providers/LastTempProvider');
const logger = require('../utils/logger');

const { host, port, protocol } = config['base-api'];

async function updateTemps() {
  const lastTemps = await LastTempProvider.getAll();
  const sectorTemperatures = lastTemps.map(({ uuid, currentTemperature }) => ({
    uuid,
    currentTemp: currentTemperature,
  }));

  const options = {
    uri: `${protocol}://${host}:${port}/api/sectors/temperatures`,
    method: 'PUT',
    json: true,
    body: {
      sectorTemperatures,
    },
  };
  try {
    await request(options);
    logger.info('Send updated temperatures to base server');
  } catch (error) {
    logger.error('Error sending updated temperatures to base server', error);
  }
}

module.exports = {
  updateTemps,
};
