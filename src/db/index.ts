import { config } from "dotenv";
config({ path: ".env.local" });

import dns from "node:dns";
// Try IPv4 addresses first. A broken or slow IPv6 route is a common reason
// Node stalls while connecting even though the internet itself works.
dns.setDefaultResultOrder("ipv4first");

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Add it to .env.local");
}

// In dev, hot reloads re-run this file. Keep one client on globalThis so each
// reload reuses the connection instead of opening a new one.
const globalForDb = globalThis as unknown as {
  __jnbPgClient?: ReturnType<typeof postgres>;
};

const client =
  globalForDb.__jnbPgClient ??
  postgres(connectionString, {
    ssl: "require", // always encrypt traffic between the server and the database
    prepare: false, // required by the Supabase transaction pooler (port 6543)
    max: 1,
    idle_timeout: 20, // close idle connections after 20 seconds
    connect_timeout: 30, // slow Wi-Fi to Frankfurt needs more than 15 seconds sometimes
    max_lifetime: 60 * 5, // replace the connection every 5 minutes so stale ones are not reused
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__jnbPgClient = client;
}

export const db = drizzle(client, { schema });
export * as tables from "./schema";