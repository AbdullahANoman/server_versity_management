import express from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { StudentValidations } from './student.validation';
import authValidation from '../../middlewares/authValidation';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get(
  '/',
  authValidation(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
  StudentController.getAllStudent,
);
router.get(
  '/:id',
  authValidation(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
  StudentController.getSingleStudent,
);
router.delete(
  '/:id',
  authValidation(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
  StudentController.deleteSingleStudent,
);
router.patch(
  '/:id',
  authValidation(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
  validateRequest(StudentValidations.UpdateStudentZodValidation),
  StudentController.updateSingleStudent,
);
export const StudentRoutes = router;
