import { z } from 'zod';

const academicFacultyValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic Faculty must be string ',
    }),
  }),
});

const updateAcademicFacultyValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic Faculty must be string ',
    }),
  }),
});

export const AcademicFacultyValidations = {
  academicFacultyValidationSchema,
  updateAcademicFacultyValidationSchema,
};
