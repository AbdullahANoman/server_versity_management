import express from 'express';
import { UserControllers } from './user.controller';
import { StudentValidations } from '../student/student.validation';
import validateRequest from '../../middlewares/validateRequest';
const router = express.Router();

// simpleMiddleware

//will call controller function
router.post(
  '/create-student',
  validateRequest(StudentValidations.CreateStudentZodValidation),
  UserControllers.createStudent,
);

export const UserRoutes = router;
