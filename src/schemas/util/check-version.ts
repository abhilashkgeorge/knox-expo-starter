import { z } from 'zod';

export const checkVersionResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: z.object({
    latestVersion: z.string(),
    minimumVersion: z.string(),
    updateUrls: z.object({
      android: z.string(),
      ios: z.string(),
    }),
  }),
});

export type CheckVersionResponse = z.infer<typeof checkVersionResponseSchema>;
