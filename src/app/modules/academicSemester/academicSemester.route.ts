import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicValidation } from './academicSemester.validation';
import { AcademicSemesterControllers } from './academicSemester.controller';
import authValidation from '../../middlewares/authValidation';
import { USER_ROLE } from '../user/user.constant';
const router = express.Router();

// simpleMiddleware

//will call controller function
router.post(
  '/create-academic-semester',
  authValidation(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(AcademicValidation.academicSemesterValidationSchema),
  AcademicSemesterControllers.createAcademicSemester,
);

router.get(
  '/',
  authValidation(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.student,
    USER_ROLE.faculty,
  ),
  AcademicSemesterControllers.getAllAcademicSemesters,
);

router.get(
  '/:semesterId',
  authValidation(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.student,
    USER_ROLE.faculty,
  ),
  AcademicSemesterControllers.getSingleAcademicSemesters,
);

router.patch(
  '/:semesterId',
  authValidation(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(AcademicValidation.updateAcademicSemesterValidationSchema),
  AcademicSemesterControllers.updateASingleSemester,
);

export const AcademicSemesterRoutes = router;
