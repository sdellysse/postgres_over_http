import { z } from "zod";

export const envSchema = z.object({
  API_KEY: z.string().describe("api key used to authenticate clients"),
  HTTP_PORT: z.string(),
  NODE_ENV: z.enum(["development", "production", "test"]),
  PGHOST: z.string(),
  PGPASSWORD: z.string(),
  PGPORT: z.coerce.number().min(1).max(65535),
  PGUSER: z.string(),
  PGDATABASE: z.string(),
});
