import express from 'express';

import validateRequest from '../../middlewares/validateRequest';

import { EnrolledCourseControllers } from './enrolledCourse.controller';
import authValidation from '../../middlewares/authValidation';
import { USER_ROLE } from '../user/user.constant';
import { EnrolledCourseValidations } from './enrolledCourse.validation';

const router = express.Router();

router.post(
  '/create-enrolled-course',
  authValidation(USER_ROLE.student),
  validateRequest(
    EnrolledCourseValidations.createEnrolledCourseValidationZodSchema,
  ),
  EnrolledCourseControllers.createEnrolledCourse,
);

router.get(
  '/',
  authValidation(USER_ROLE.faculty),
  EnrolledCourseControllers.getAllEnrolledCourses,
);

router.get(
  '/my-enrolled-courses',
  authValidation(USER_ROLE.student),
  EnrolledCourseControllers.getMyEnrolledCourses,
);

router.patch(
  '/update-enrolled-course-marks',
  authValidation(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  validateRequest(
    EnrolledCourseValidations.updateEnrolledCourseMarksValidationZodSchema,
  ),
  EnrolledCourseControllers.updateEnrolledCourseMarks,
);

export const EnrolledCourseRoutes = router;
