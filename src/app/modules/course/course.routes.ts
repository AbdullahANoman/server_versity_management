import express from 'express';
import { CourseControllers } from './course.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidation } from './course.validations';
import authValidation from '../../middlewares/authValidation';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create-course',
  authValidation(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(CourseValidation.createCourseValidation),
  CourseControllers.createCourse,
);

router.get(
  '/',
  authValidation(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  CourseControllers.getAllCourses,
);

router.get(
  '/:id',
  authValidation(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  CourseControllers.getSingleCourse,
);

router.delete(
  '/:id',
  authValidation(USER_ROLE.admin, USER_ROLE.superAdmin),
  CourseControllers.deleteSingleCourse,
);

router.patch(
  '/:id',
  authValidation(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(CourseValidation.updateCourseValidation),
  CourseControllers.updateSingleCourse,
);

router.put(
  '/:courseId/assignFaculty',
  authValidation(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(CourseValidation.assignFacultiesWithCourseValidationsSchema),
  CourseControllers.assignFacultiesWithCourse,
);

router.get(
  '/:courseId/get-faculties',
  authValidation(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  CourseControllers.getFacultiesWithCourse,
);

router.delete(
  '/:courseId/delete-faculties',
  authValidation(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(CourseValidation.assignFacultiesWithCourseValidationsSchema),
  CourseControllers.deleteFacultiesWithCourse,
);
export const CourseRoutes = router;
