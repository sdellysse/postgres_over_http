import type { z } from "zod";
import { envSchema as rootSchema } from "~/env_schema";

export const envSchema = rootSchema;

let envInstance: z.infer<typeof envSchema> | undefined = undefined;
export const env = () => {
  if (envInstance === undefined) {
    envInstance = envSchema.parse(process.env);
  }

  return envInstance;
};
