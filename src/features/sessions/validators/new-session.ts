/**
 * @file Zod validation schema for the new session form.
 */

import { z } from 'zod';

/** Schema for validating new session form data. */
export const newSessionSchema = z.object({
  title: z.string().max(200, 'Title must be 200 characters or fewer').optional().or(z.literal('')),
});

/** Inferred form data type from the new session schema. */
export type NewSessionFormData = z.infer<typeof newSessionSchema>;
