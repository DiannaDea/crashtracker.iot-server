const request = require('request-promise');
const config = require('config');
const SensorProvider = require('../providers/SensorProvider');
const LastTempProvider = require('../providers/LastTempProvider');

const { host, port } = config['base-api'];

async function getSectors() {
  const options = {
    uri: `http://${host}:${port}/api/sectors`,
    json: true,
  };

  const sectors = await request(options);

  return sectors.map(({ uuid, maxTemperature, minTemperature }) => ({
    uuid,
    max: maxTemperature,
    min: minTemperature,
  }));
}

function generateRandom(min, max) {
  return min + Math.random() * (max + 1 - min);
}

async function getCurrentSectorsTemp() {
  const sectors = await getSectors();
  return Promise.all(sectors.map(({ uuid, min, max }) => {
    const currentTemperature = (generateRandom(min, max)).toFixed(2);
    return {
      uuid,
      currentTemperature,
      date: new Date(),
    };
  }));
}

async function parseTemperature() {
  // move last temperatures from current to archieve
  const lastTemps = await LastTempProvider.getAll();
  await Promise.all(lastTemps.map(lastTemp => SensorProvider.create(lastTemp)));

  // truncate last temperatures
  await LastTempProvider.deleteAll();

  const sectors = await getCurrentSectorsTemp();
  await Promise.all(sectors.map(sector => LastTempProvider.create(sector)));
}

module.exports = {
  parseTemperature,
};
