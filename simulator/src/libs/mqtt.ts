import mqtt, { type IClientOptions } from "mqtt";
import { env } from "../config/env.js";

const url = `mqtt://${env.TB_MQTT_ORIGIN}`;

export function createMQTT(deviceToken: string, options?: IClientOptions) {
  const client = mqtt.connect(url, {
    username: deviceToken,
    ...options,
  });

  client.on("connect", () => {
    console.log(`Device ${deviceToken} connected`);
  });

  client.on("close", () => {
    console.log(`Device ${deviceToken} closed`);
  });

  client.on("disconnect", () => {
    console.log(`Device ${deviceToken} disconnected`);
  });

  client.on("error", (err) => {
    console.log(`Device ${deviceToken} error: ${err}`);
  });

  client.on("message", (topic, msg) => {
    console.log(
      `Device ${deviceToken} recevied topic: ${topic}, message:${msg}`,
    );
  });

  return client;
}
