/* eslint-disable node/no-process-env */
import { z } from 'zod/v4';

const envSchema = z.object({
  ENV: z.enum(['development', 'production', 'test']).default('development'),
  VITE_API_ROOT_API_URL: z.string().nonempty(),
  STATE_NAME: z.string().nonempty(),
});

try {
  envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error(
      'Missing environment variables:',
      error.issues.flatMap(issue => issue.path)
    );
  } else {
    console.error(error);
  }
  process.exit(1);
}

export const env = envSchema.parse(process.env);
