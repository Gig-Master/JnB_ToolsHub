import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

if (!process.env.MIGRATION_DATABASE_URL) {
  throw new Error("MIGRATION_DATABASE_URL is not set. Add it to .env.local — see .env.example.");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.MIGRATION_DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
