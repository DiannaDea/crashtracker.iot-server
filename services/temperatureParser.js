const request = require('request-promise');
const config = require('config');
const SensorProvider = require('../providers/SensorProvider');
const LastTempProvider = require('../providers/LastTempProvider');
const CriticalProvider = require('../providers/CriticalProvider');
const WorkStatusProvider = require('../providers/WorkStatusProvider');

const { host, port, protocol } = config['base-api'];
const { temperatureParserTime } = config.schedule;

async function getSectors() {
  const options = {
    uri: `${protocol}://${host}:${port}/api/sectors`,
    json: true,
  };

  const sectors = await request(options);

  return sectors.map(({
    uuid,
    maxTemperature,
    minTemperature,
    maxTimeExcess,
  }) => ({
    uuid,
    maxTimeExcess,
    maxTemperature,
    minTemperature,
  }));
}

function generateRandom(min, max) {
  return min + Math.random() * (max + 1 - min);
}

async function getCurrentSectorsTemp() {
  const sectors = await getSectors();
  return Promise.all(sectors.map((sectorInfo) => {
    const { maxTemperature, minTemperature } = sectorInfo;
    const currentTemperature = (generateRandom(minTemperature, maxTemperature)).toFixed(2);
    return {
      ...sectorInfo,
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

  // get new temperatures
  const sectorTemps = await getCurrentSectorsTemp();

  await Promise.all(sectorTemps.map(async (sectorTemp) => {
    const {
      uuid,
      maxTimeExcess,
      maxTemperature,
      currentTemperature,
      notificationHours,
    } = sectorTemp;

    // add new temperatures to current table
    await LastTempProvider.create(sectorTemp);

    // control critical situation
    if (currentTemperature > maxTemperature && !await CriticalProvider.checkIfExists(uuid)) {
      await CriticalProvider.create({ uuid, maxTimeExcess });
    } else if (currentTemperature > maxTemperature) {
      await CriticalProvider.updateTime(uuid);
    } else if (currentTemperature < maxTemperature && await CriticalProvider.checkIfExists(uuid)) {
      await CriticalProvider.removeCriticalSituation(uuid);
    }

    const workStatus = await WorkStatusProvider.checkIfExists(uuid);

    if (!workStatus) {
      await WorkStatusProvider.create({
        uuid,
        notificationHours,
        minutes: workStatus.minutes + temperatureParserTime,
      });
    } else if (workStatus.minutes + temperatureParserTime < 60) {
      await WorkStatusProvider.update(uuid, {
        minutes: workStatus.minutes + temperatureParserTime,
      });
    } else if (workStatus.minutes + temperatureParserTime > 60) {
      await WorkStatusProvider.update(uuid, {
        hours: workStatus.hours + 1,
        minutes: workStatus.minutes + temperatureParserTime - 60,
      });
    }
  }));
}

module.exports = {
  parseTemperature,
};
