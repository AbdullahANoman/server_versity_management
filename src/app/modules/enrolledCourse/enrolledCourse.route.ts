import express from 'express';
import authValidation from '../../middlewares/authValidation';
import { EnrolledCourseControllers } from './enrolledCourse.controller';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
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

export const EnrolledCourseRoutes = router;
