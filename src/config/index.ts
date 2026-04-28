import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  HOST: z.string().default("0.0.0.0"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),

  // Database
  DATABASE_URL: z.string().min(1),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  // Seed users
  SEED_USER1_USERNAME: z.string().optional(),
  SEED_USER1_EMAIL: z.string().email().optional(),
  SEED_USER1_PASSWORD: z.string().min(6).optional(),
  SEED_USER2_USERNAME: z.string().optional(),
  SEED_USER2_EMAIL: z.string().email().optional(),
  SEED_USER2_PASSWORD: z.string().min(6).optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = parsed.data;

export const config = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  host: env.HOST,
  logLevel: env.LOG_LEVEL,
  isProduction: env.NODE_ENV === "production",
  isDevelopment: env.NODE_ENV === "development",
  isTest: env.NODE_ENV === "test",

  // Database
  databaseUrl: env.DATABASE_URL,

  // JWT
  jwt: {
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },

  // Seed users
  seedUsers: [
    env.SEED_USER1_USERNAME && env.SEED_USER1_EMAIL && env.SEED_USER1_PASSWORD
      ? {
          username: env.SEED_USER1_USERNAME,
          email: env.SEED_USER1_EMAIL,
          password: env.SEED_USER1_PASSWORD,
        }
      : null,
    env.SEED_USER2_USERNAME && env.SEED_USER2_EMAIL && env.SEED_USER2_PASSWORD
      ? {
          username: env.SEED_USER2_USERNAME,
          email: env.SEED_USER2_EMAIL,
          password: env.SEED_USER2_PASSWORD,
        }
      : null,
  ].filter(Boolean) as { username: string; email: string; password: string }[],
} as const;
