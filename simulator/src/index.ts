import { DeviceManager, type DeviceConfig } from "./device.js";

// prettier-ignore
const devicesBaseConfig: DeviceConfig[] = [
  // --- HO CHI MINH (HCM) ---
  { name: "PM-HCM-001", token: "PM-HCM-001_TOKEN", type: 'POWER_METER', interval: 10 },
  { name: "TS-HCM-001", token: "TS-HCM-001_TOKEN", type: 'TEMPERATURE_SENSOR', interval: 10 },
  { name: "DS-HCM-001", token: "DS-HCM-001_TOKEN", type: 'DOOR_SENSOR', interval: 10 },
  { name: "ES-HCM-001", token: "ES-HCM-001_TOKEN", type: 'ENVIRONMENT_SENSOR', interval: 10 },
  { name: "PM-HCM-002", token: "PM-HCM-002_TOKEN", type: 'POWER_METER', interval: 10 },
  { name: "TS-HCM-002", token: "TS-HCM-002_TOKEN", type: 'TEMPERATURE_SENSOR', interval: 10 },
  { name: "DS-HCM-002", token: "DS-HCM-002_TOKEN", type: 'DOOR_SENSOR', interval: 10 },
  { name: "PM-HCM-003", token: "PM-HCM-003_TOKEN", type: 'POWER_METER', interval: 10 },
  { name: "TS-HCM-003", token: "TS-HCM-003_TOKEN", type: 'TEMPERATURE_SENSOR', interval: 10 },
  { name: "DS-HCM-003", token: "DS-HCM-003_TOKEN", type: 'DOOR_SENSOR', interval: 10 },
  { name: "GE-HCM-003", token: "GE-HCM-003_TOKEN", type: 'GENERATOR_MONITOR', interval: 10 },

  // --- CAN THO (CT) ---
  { name: "PM-CT-001", token: "PM-CT-001_TOKEN", type: 'POWER_METER', interval: 10 },
  { name: "TS-CT-001", token: "TS-CT-001_TOKEN", type: 'TEMPERATURE_SENSOR', interval: 10 },
  { name: "DS-CT-001", token: "DS-CT-001_TOKEN", type: 'DOOR_SENSOR', interval: 10 },
  { name: "PM-CT-002", token: "PM-CT-002_TOKEN", type: 'POWER_METER', interval: 10 },
  { name: "TS-CT-002", token: "TS-CT-002_TOKEN", type: 'TEMPERATURE_SENSOR', interval: 10 },
  { name: "DS-CT-002", token: "DS-CT-002_TOKEN", type: 'DOOR_SENSOR', interval: 10 },
  { name: "ES-CT-002", token: "ES-CT-002_TOKEN", type: 'ENVIRONMENT_SENSOR', interval: 10 },

  // --- HA NOI (HN) ---
  { name: "PM-HN-001", token: "PM-HN-001_TOKEN", type: 'POWER_METER', interval: 10 },
  { name: "TS-HN-001", token: "TS-HN-001_TOKEN", type: 'TEMPERATURE_SENSOR', interval: 10 },
  { name: "DS-HN-001", token: "DS-HN-001_TOKEN", type: 'DOOR_SENSOR', interval: 10 },
  { name: "ES-HN-001", token: "ES-HN-001_TOKEN", type: 'ENVIRONMENT_SENSOR', interval: 10 },
  { name: "PM-HN-002", token: "PM-HN-002_TOKEN", type: 'POWER_METER', interval: 10 },
  { name: "TS-HN-002", token: "TS-HN-002_TOKEN", type: 'TEMPERATURE_SENSOR', interval: 10 },
  { name: "DS-HN-002", token: "DS-HN-002_TOKEN", type: 'DOOR_SENSOR', interval: 10 },
  { name: "PM-HN-003", token: "PM-HN-003_TOKEN", type: 'POWER_METER', interval: 10 },
  { name: "TS-HN-003", token: "TS-HN-003_TOKEN", type: 'TEMPERATURE_SENSOR', interval: 10 },
  { name: "DS-HN-003", token: "DS-HN-003_TOKEN", type: 'DOOR_SENSOR', interval: 10 },
  { name: "GE-HN-003", token: "GE-HN-003_TOKEN", type: 'GENERATOR_MONITOR', interval: 10 },

  // --- HAI PHONG (HP) ---
  { name: "PM-HP-001", token: "PM-HP-001_TOKEN", type: 'POWER_METER', interval: 10 },
  { name: "TS-HP-001", token: "TS-HP-001_TOKEN", type: 'TEMPERATURE_SENSOR', interval: 10 },
  { name: "DS-HP-001", token: "DS-HP-001_TOKEN", type: 'DOOR_SENSOR', interval: 10 }
];

devicesBaseConfig.forEach((config) => new DeviceManager(config));
