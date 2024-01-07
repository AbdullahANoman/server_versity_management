import express from 'express';
import { UserControllers } from './user.controller';
import { StudentValidations } from '../student/student.validation';
import validateRequest from '../../middlewares/validateRequest';
import { createFacultyValidationSchema } from '../faculty/faculty.validation';
import { createAdminValidationSchema } from '../admin/admin.validation';
import authValidation from '../../middlewares/authValidation';
import { USER_ROLE } from './user.constant';
import { UserValidation } from './user.validation';
const router = express.Router();

// simpleMiddleware

//will call controller function
router.post(
  '/create-admin',
  validateRequest(createAdminValidationSchema),
  UserControllers.createAdmin,
);
router.post(
  '/create-student',
  authValidation(USER_ROLE.admin),
  validateRequest(StudentValidations.CreateStudentZodValidation),
  UserControllers.createStudent,
);
router.post(
  '/create-faculty',
  authValidation(USER_ROLE.admin),
  validateRequest(createFacultyValidationSchema),
  UserControllers.createFaculty,
);
router.get(
  '/me',
  authValidation('faculty', 'admin', 'student'),
  UserControllers.getMe,
);

router.post(
  '/change-status/:id',
  authValidation(USER_ROLE.admin),
  validateRequest(UserValidation.changeStatusValidationSchema),
  UserControllers.changeStatus,
);

export const UserRoutes = router;
