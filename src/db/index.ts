import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Add it to .env.local");
}

const client = postgres(connectionString, {
  prepare: false,
  max: 1,
  idle_timeout: 20,
});

export const db = drizzle(client, { schema });
export * as tables from "./schema";
