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

  constructor(deviceToken: string) {
    this.isRunning = Math.random() > 0.5;
    this.deviceToken = deviceToken;
    this.client = createMQTT(deviceToken);

    this.client.on("connect", () => {
      this.setupRPC();
      this.listenChangeRunState();
      this.sendCurrentState();
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
}

const INTERVAL_TIME = 10_000;

export class CNCMillingMachine extends Device {
  constructor(deviceToken: string) {
    super(deviceToken);
    this.client.on("connect", () => {
      setInterval(() => {
        const data = {
          spindle_load: randomInt(40, 100), // Alarm > 90
          spindle_speed: randomInt(8000, 15000), // Alarm > 14000
          axis_x: randomDecimal(140.4, 140.6),
        };
        this.updateTelemetry(data);
      }, INTERVAL_TIME);
    });
  }
}

export class CNCLathe extends Device {
  constructor(deviceToken: string) {
    super(deviceToken);
    this.client.on("connect", () => {
      setInterval(() => {
        const data = {
          coolant_flow: randomDecimal(1, 15), // Alarm < 5.0
          vibration: randomDecimal(0.01, 0.09), // Alarm > 0.08
        };
        this.updateTelemetry(data);
      }, INTERVAL_TIME);
    });
  }
}

export class ToolMagazine extends Device {
  constructor(deviceToken: string) {
    super(deviceToken);
    this.client.on("connect", () => {
      setInterval(() => {
        const data = {
          wear_level: randomInt(0, 100), // Alarm > 95
          tool_temp: randomInt(30, 90), // Alarm > 85
        };
        this.updateTelemetry(data);
      }, INTERVAL_TIME);
    });
  }
}

export class CoolantFiltrationSystem extends Device {
  constructor(deviceToken: string) {
    super(deviceToken);
    this.client.on("connect", () => {
      setInterval(() => {
        const data = {
          ph_level: randomDecimal(8.0, 9.5), // Alarm < 8.2 or > 9.4
          concentration: randomDecimal(8.0, 10.0),
          filter_clog: randomInt(5, 90), // Alarm > 80
        };
        this.updateTelemetry(data);
      }, INTERVAL_TIME);
    });
  }
}

export class ChipConveyor extends Device {
  constructor(deviceToken: string) {
    super(deviceToken);
    this.client.on("connect", () => {
      setInterval(() => {
        const data = {
          bin_fill_level: randomInt(0, 100), // Alarm > 90
          motor_current: randomDecimal(3.5, 5.5), // Alarm > 5.0 (Jam)
          status: "running",
        };
        this.updateTelemetry(data);
      }, INTERVAL_TIME);
    });
  }
}

export class HydraulicPowerUnit extends Device {
  constructor(deviceToken: string) {
    super(deviceToken);
    this.client.on("connect", () => {
      setInterval(() => {
        const data = {
          oil_pressure: randomInt(1400, 2300), // Alarm < 1500
          oil_temp: randomDecimal(35, 70), // Alarm > 65
          leak_detected: Math.random() > 0.95, // Rare Alarm trigger
        };
        this.updateTelemetry(data);
      }, INTERVAL_TIME);
    });
  }
}

export class CMMCoordinateMeasure extends Device {
  constructor(deviceToken: string) {
    super(deviceToken);
    this.client.on("connect", () => {
      setInterval(() => {
        const data = {
          tolerance_deviation: randomDecimal(0.001, 0.012), // Alarm > 0.010
          probe_status: "ready",
        };
        this.updateTelemetry(data);
      }, INTERVAL_TIME);
    });
  }
}

export class DeburringRobot extends Device {
  constructor(deviceToken: string) {
    super(deviceToken);
    this.client.on("connect", () => {
      setInterval(() => {
        const data = {
          arm_force: randomDecimal(10, 20),
          cycle_time: randomInt(35, 50),
          joints_temp: randomInt(30, 50), // Alarm > 45
        };
        this.updateTelemetry(data);
      }, INTERVAL_TIME);
    });
  }
}

export class PartWasher extends Device {
  constructor(deviceToken: string) {
    super(deviceToken);
    this.client.on("connect", () => {
      setInterval(() => {
        const data = {
          water_temp: randomInt(50, 70), // Alarm < 55
          detergent_level: randomInt(10, 100), // Alarm < 20
          dryer_temp: randomInt(70, 95),
        };
        this.updateTelemetry(data);
      }, INTERVAL_TIME);
    });
  }
}

export class SmartScaleOutput extends Device {
  constructor(deviceToken: string) {
    super(deviceToken);
    this.client.on("connect", () => {
      // Logic for count: starts at 120 and increases
      let count = 120;

      setInterval(() => {
        count += 1;
        const data = {
          total_weight: randomDecimal(200, 300),
          part_count: count,
          batch_id: "B-99",
        };
        this.updateTelemetry(data);
      }, INTERVAL_TIME);
    });
  }
}

export const devices = {
  CNCMillingMachine01: new CNCMillingMachine("5nse4HHtgMb2X8VLqmyb"),
  CNCLathe: new CNCLathe("bOBv6Ht0kUgZNWNVNi4L"),
  ToolMagazine: new ToolMagazine("hZpcCJtmGeF4ws1R02Qz"),
  CoolantFiltrationSystem: new CoolantFiltrationSystem("2ZVcKbf075ZFZrYPB0XX"),
  ChipConveyor: new ChipConveyor("rLdeiNf9slmxhgN63b2z"),
  HydraulicPowerUnit: new HydraulicPowerUnit("eHOiSi5Iw74dU2MWeBlg"),
  CMMCoordinateMeasure: new CMMCoordinateMeasure("i55Zair0PQizuKixhgjp"),
  DeburringRobot: new DeburringRobot("85Ag8xyHz5Q2Sfn7bIhX"),
  PartWasher: new PartWasher("OneCcTS2EBkW6WYn9nyp"),
  SmartScaleOutput: new SmartScaleOutput("PVCsR7hXNuhcC6ZAbo7t"),
};
