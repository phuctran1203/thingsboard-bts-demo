import "dotenv/config";

export const env = {
  TB_MQTT_ORIGIN: process.env.TB_MQTT_ORIGIN ?? "localhost:1883",
};
