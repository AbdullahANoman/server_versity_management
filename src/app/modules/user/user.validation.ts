import { z } from 'zod';

const userValidationSchema = z.object({
  // id: z.string(),
  password: z
    .string({
      invalid_type_error: 'Password must be string',
    })
    .max(20, { message: 'Password must be at least 20 characters' })
    .optional(),
  // needsPasswordChange: z.boolean().optional().default(false),
  // role: z.enum(['admin', 'student', 'faculty']),
  // status: z.enum(['in-progress', 'blocked']).default('in-progress'),
  // isDeleted: z.boolean().optional().default(false),
});

export const UserValidation = {
  userValidationSchema,
};
