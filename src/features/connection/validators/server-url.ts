/**
 * @file Zod schema for validating server connection URLs.
 *
 * Accepts localhost, 127.0.0.1, or IP address URLs
 * with http:// or https:// protocol prefix and an optional port.
 */

import { z } from 'zod';

const IP_PATTERN =
  /^(https?:\/\/)(localhost|127\.0\.0\.1|((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?))(:\d{1,5})?(\/.*)?$/;

export const serverUrlSchema = z.object({
  serverUrl: z
    .string()
    .min(1, 'Server URL is required')
    .regex(IP_PATTERN, 'Enter a valid localhost or IP address URL (e.g. http://localhost:3000)'),
});

/** Inferred form data type from the server URL schema. */
export type ServerUrlFormData = z.infer<typeof serverUrlSchema>;
