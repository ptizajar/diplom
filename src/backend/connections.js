import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import { app } from "./server";
const { Pool } = require("pg");


const { createClient } = require("redis");
export const client = createClient();
client.on("error", (err) => console.log("Redis client error", err));

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "intex_db",
});

async function connectToRedis() {
  try {
    await client.connect();
    console.log("Connected to redis");
    await client.set("myKey", "myValue");
    const value = await client.get("myKey");
    console.log("Value retrieved:", value);
  } catch (err) {
    console.log("Failed to connect to redis", err);
  }
}

export const redisConnection = connectToRedis();