import type { MqttClient } from "mqtt";
import { createMQTT } from "./libs/mqtt.js";
import {
  ATTRIBUTE_PATH,
  RPC_REQUEST,
  TELEMETRY_PATH,
} from "./constants/index.js";
import { randomInt } from "crypto";
import { randomDecimal } from "./utils/util.js";

class Device {
  protected client: MqttClient;
  protected deviceToken: string;
  private isRunning: boolean;

  constructor(deviceToken: string, interval: number) {
    this.isRunning = Math.random() > 0.5;
    this.deviceToken = deviceToken;
    this.client = createMQTT(deviceToken);

    this.client.on("connect", () => {
      this.setupRPC();
      this.listenChangeRunState();
      setInterval(() => {
        const data = this.generateTelemetries();

        if (Object.keys(data).length > 0) {
          this.client.publish(TELEMETRY_PATH, JSON.stringify(data));
          console.log(
            `Device ${this.deviceToken} send: ${JSON.stringify(data)}`,
          );
        }
      }, interval * 1000);
      // this.sendCurrentState();
    });
  }

  private setupRPC(): void {
    this.client.subscribe(RPC_REQUEST + "+", (err) => {
      if (!err) console.log(`Device ${this.deviceToken} ready for RPC`);
      else console.log(`Error setupRPC for device ${this.deviceToken}: ${err}`);
    });
  }

  private sendCurrentState() {
    const response = { active: this.isRunning };

    this.client.publish(ATTRIBUTE_PATH, JSON.stringify(response));
  }

  private listenChangeRunState() {
    this.client.on("message", (topic, message) => {
      if (topic.startsWith(RPC_REQUEST)) {
        // const requestId = topic.slice(RPC_REQUEST.length);
        const requestData = JSON.parse(message.toString());

        if (requestData.method !== "setState") return;

        const newState = Boolean(requestData.params);

        this.isRunning = newState;

        // const responseTopic = `${RPC_RESPONSE}${requestId}`;
        const response = { active: this.isRunning };

        this.client.publish(ATTRIBUTE_PATH, JSON.stringify(response));

        console.log(
          `Device ${this.deviceToken} response for topic ${topic} through ${ATTRIBUTE_PATH}: ${JSON.stringify(response)}`,
        );
      }
    });
  }

  protected updateTelemetry(data: Record<any, any>): void {
    if (!this.isRunning) return;

    this.client.publish(TELEMETRY_PATH, JSON.stringify(data), (err) => {
      if (err) console.log(`Device ${this.deviceToken} send error: ${err}`);
      else
        console.log(`Device ${this.deviceToken} send: ${JSON.stringify(data)}`);
    });
  }
  protected generateTelemetries(): Object {
    return {};
  }
}

export interface DeviceConfig {
  name: string;
  token: string;
  type:
    | "POWER_METER"
    | "TEMPERATURE_SENSOR"
    | "DOOR_SENSOR"
    | "ENVIRONMENT_SENSOR"
    | "GENERATOR_MONITOR";
  interval: number;
}

// --- POWER METER ---
class PowerMeter extends Device {
  private energyCount = 1250.45;

  constructor(token: string, interval: number) {
    super(token, interval);
  }

  protected generateTelemetries() {
    const power = randomDecimal(2.0, 5.0, 3); // Doc: Alarm if > 5.0
    this.energyCount += power / 360;
    return {
      voltage: randomDecimal(210, 235, 2), // Doc Alarms: <200 or >240
      current: randomDecimal(5, 100, 2), // Doc: Max 100
      power: power,
      energy: parseFloat(this.energyCount.toFixed(2)),
      frequency: randomDecimal(49.5, 50.5, 2),
      power_factor: randomDecimal(0.9, 0.99, 2),
    };
  }
}

// --- TEMPERATURE SENSOR ---
class TemperatureSensor extends Device {
  constructor(token: string, interval: number) {
    super(token, interval);
  }

  protected generateTelemetries() {
    return {
      // Doc Alarms: >40 Critical, >35 Warning, <5 Warning
      temperature: randomDecimal(20, 38, 1),
    };
  }
}

// --- DOOR SENSOR ---
class DoorSensor extends Device {
  private openCount = 0;

  constructor(token: string, interval: number) {
    super(token, interval);
  }

  protected generateTelemetries() {
    // To test "FREQUENT_OPEN" alarm (>20/hr), you might want to randomize this
    const isCurrentlyOpen = Math.random() > 0.9;
    if (isCurrentlyOpen) this.openCount++;

    return {
      door_state: isCurrentlyOpen, // Doc: Boolean (true=Open)
      open_count: this.openCount, // Doc: Integer
    };
  }
}

// --- ENVIRONMENT SENSOR ---
class EnvironmentSensor extends Device {
  constructor(token: string, interval: number) {
    super(token, interval);
  }

  protected generateTelemetries() {
    return {
      humidity: randomDecimal(30, 85, 1), // Doc Alarm: >80 or <20
      air_quality: randomInt(50, 160), // Doc Alarm: >150
      pressure: randomDecimal(1000, 1020, 1),
    };
  }
}

// --- GENERATOR MONITOR ---
class GeneratorMonitor extends Device {
  private totalRuntime = 48.2;

  constructor(token: string, interval: number) {
    super(token, interval);
  }

  protected generateTelemetries() {
    this.totalRuntime += 10 / 3600; // Increment runtime by interval (10s)

    return {
      gen_status: "STANDBY", // Doc: "OFF" | "RUNNING" | "STANDBY" | "ERROR"
      gen_voltage: 0.0,
      gen_fuel_level: randomDecimal(15, 95, 1), // Doc Alarm: <20
      gen_runtime: parseFloat(this.totalRuntime.toFixed(2)),
      gen_temperature: randomDecimal(30, 98, 1), // Doc Alarm: >95
    };
  }
}

export class DeviceManager {
  device: Device;

  constructor(config: DeviceConfig) {
    if (config.type === "POWER_METER") {
      this.device = new PowerMeter(config.token, config.interval);
    } else if (config.type === "ENVIRONMENT_SENSOR") {
      this.device = new EnvironmentSensor(config.token, config.interval);
    } else if (config.type === "DOOR_SENSOR") {
      this.device = new DoorSensor(config.token, config.interval);
    } else if (config.type === "GENERATOR_MONITOR") {
      this.device = new GeneratorMonitor(config.token, config.interval);
    } else {
      this.device = new TemperatureSensor(config.token, config.interval);
    }
  }
}
