import { z } from 'zod';

const UserNameValidation = z.object({
  firstName: z.string().max(8, 'FirstName less than 8 characters').trim(),
  middleName: z.string().optional(),
  lastName: z.string().trim(),
});

const LocalGuardianValidation = z.object({
  address: z.string(),
  contactNo: z.string(),
  name: z.string(),
  occupation: z.string(),
});

const GuardianValidation = z.object({
  fatherName: z.string(),
  fatherContact: z.string(),
  fatherOccupation: z.string(),
  motherName: z.string(),
  motherContact: z.string(),
  motherOccupation: z.string(),
});

const CreateStudentZodValidation = z.object({
  body: z.object({
    password: z.string().max(20, 'Password less than 20 characters'),
    // .regex(
    //   /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]$/,
    //   'Password must be have Capital letter an alphanumeric with numbers separated by spaces',
    // ),
    // why there body is used do not understand clearly
    student: z.object({
      name: UserNameValidation,
      dateOfBirth: z.string().optional(),
      email: z.string().email(),
      gender: z.enum(['male', 'female', 'other']),
      contactNo: z.string(),
      emergencyContact: z.string(),
      bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
      permanentAddress: z.string(),
      presentAddress: z.string(),
      guardian: GuardianValidation,
      localGuardian: LocalGuardianValidation,
      profileImage: z.string(),
      admissionSemester: z.string(),
      academicDepartment: z.string(),
      isActive: z.enum(['active', 'block']).default('active'),
      isDeleted: z.boolean(),
    }),
  }),
});

const UpdateUserNameValidation = z.object({
  firstName: z
    .string()
    .max(8, 'FirstName less than 8 characters')
    .trim()
    .optional(),
  middleName: z.string().optional(),
  lastName: z.string().trim().optional(),
});

const UpdateLocalGuardianValidation = z.object({
  address: z.string().optional(),
  contactNo: z.string().optional(),
  name: z.string().optional(),
  occupation: z.string().optional(),
});

const UpdateGuardianValidation = z.object({
  fatherName: z.string().optional(),
  fatherContact: z.string().optional(),
  fatherOccupation: z.string().optional(),
  motherName: z.string().optional(),
  motherContact: z.string().optional(),
  motherOccupation: z.string().optional(),
});

const UpdateStudentZodValidation = z.object({
  body: z.object({
    student: z.object({
      name: UpdateUserNameValidation.optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email().optional(),
      gender: z.enum(['male', 'female', 'other']).optional(),
      contactNo: z.string().optional(),
      emergencyContact: z.string().optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      permanentAddress: z.string().optional(),
      presentAddress: z.string().optional(),
      guardian: UpdateGuardianValidation.optional(),
      localGuardian: UpdateLocalGuardianValidation.optional(),
      profileImage: z.string().optional(),
      admissionSemester: z.string().optional(),
      academicDepartment: z.string().optional(),
      isActive: z.enum(['active', 'block']).default('active').optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});
export const StudentValidations = {
  CreateStudentZodValidation,
  UpdateStudentZodValidation,
};
