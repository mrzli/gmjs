import { z } from 'zod';

export const zodEnvPort = z
  .string()
  .regex(/^\d+$/)
  .transform((v) => Number.parseInt(v))
  .refine((v) => v >= 1 && v <= 65535, `Invalid port number.`);
