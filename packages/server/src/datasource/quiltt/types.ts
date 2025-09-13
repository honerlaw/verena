import z from "zod";

export const SessionTokenSchema = z.object({
  token: z.string(),
  expiration: z.number(),
  expiresAt: z.string(),
  userId: z.string(),
  userUuid: z.string(),
  environmentId: z.string(),
});

export type SessionToken = z.infer<typeof SessionTokenSchema>;

export const ErrorResponseSchema = z.object({
  message: z.string(),
  instruction: z.string(),
  errorId: z.string().optional().nullable(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
