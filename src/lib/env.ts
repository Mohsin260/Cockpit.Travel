import { z } from "zod";

/**
 * Zod schema for all required/optional environment variables.
 * Using safeParse ensures missing vars throw a clear, descriptive error
 * at startup rather than crashing silently at runtime.
 */
const EnvSchema = z.object({
  USE_DATABASE: z.enum(["true", "false"]).default("true"),
  MONGO_URI: z.string().default(""),
  NEXTAUTH_SECRET: z.string().default(""),
  NEXTAUTH_URL: z.string().default("http://localhost:3000"),
  // Storage providers — only required when that upload path is active
  AWS_ACCESS_KEY_ID: z.string().min(1).optional(),
  AWS_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  S3_BUCKET: z.string().min(1).optional(),
  CLOUDINARY_URL: z.string().min(1).optional(),
});

/** Call this at the top of any server-only module to get type-safe env vars. */
export function getEnv() {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join(", ");
    throw new Error(message);
  }
  return parsed.data;
}
