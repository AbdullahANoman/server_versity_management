import { z } from 'zod';

const createPreRequisiteCourse = z.object({
  course: z.string(),
  isDeleted: z.boolean().optional(),
});

const createCourseValidation = z.object({
  body: z.object({
    title: z.string(),
    prefix: z.string(),
    code: z.number(),
    credits: z.number(),
    isDeleted: z.boolean().optional(),
    preRequisiteCourse: z.array(createPreRequisiteCourse).optional(),
  }),
});

const updatePreRequisiteCourseValidationSchema = z.object({
  course: z.string(),
  isDeleted: z.boolean().optional(),
});
const updateCourseValidation = z.object({
  body: z.object({
    title: z.string().optional(),
    prefix: z.string().optional(),
    code: z.number().optional(),
    credits: z.number().optional(),
    isDeleted: z.boolean().optional(),
    preRequisiteCourse: z
      .array(updatePreRequisiteCourseValidationSchema)
      .optional(),
  }),
});

export const CourseValidation = {
  createCourseValidation,
  updateCourseValidation,
};
