import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationValidations } from './semesterRegistration.validation';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';
import authValidation from '../../middlewares/authValidation';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create-semester-registration',
  authValidation(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.createSemesterRegistration,
);

router.get(
  '/:id',
  authValidation(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.student,
    USER_ROLE.faculty,
  ),
  SemesterRegistrationControllers.getSingleSemesterRegistration,
);

router.get(
  '/:id',
  authValidation(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.student,
    USER_ROLE.faculty,
  ),
  SemesterRegistrationControllers.getSingleSemesterRegistration,
);

router.get(
  '/',
  authValidation(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.student,
    USER_ROLE.faculty,
  ),
  SemesterRegistrationControllers.getAllSemesterRegistration,
);

router.patch(
  '/:id',
  authValidation(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.updateSingleSemesterRegistration,
);

router.delete(
  '/:id',
  authValidation(USER_ROLE.admin, USER_ROLE.superAdmin),
  SemesterRegistrationControllers.deleteSingleSemesterRegistration,
);
export const semesterRegistrationRoutes = router;
