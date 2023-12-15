import express from 'express';
import { UserControllers } from './user.controller';
import { StudentValidations } from '../student/student.validation';
import validateRequest from '../../middlewares/validateRequest';
import { createFacultyValidationSchema } from '../faculty/faculty.validation';
const router = express.Router();

// simpleMiddleware

//will call controller function
router.post(
  '/create-student',
  validateRequest(StudentValidations.CreateStudentZodValidation),
  UserControllers.createStudent,
);
router.post(
  '/create-faculty',
  validateRequest(createFacultyValidationSchema),
  UserControllers.createFaculty,
);
export const UserRoutes = router;
