import { z } from 'zod';

/** Schema for validating message form data. */
export const messageSchema = z.object({
  content: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(10000, 'Message must be 10000 characters or fewer'),
});

/** Inferred form data type from the message schema. */
export type MessageFormData = z.infer<typeof messageSchema>;
