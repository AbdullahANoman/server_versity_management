import express from 'express';
import { CourseControllers } from './course.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidation } from './course.validations';

const router = express.Router();

router.post(
  '/create-course',
  validateRequest(CourseValidation.createCourseValidation),
  CourseControllers.createCourse,
);

router.get('/', CourseControllers.getAllCourses);

router.get('/:id', CourseControllers.getSingleCourse);

router.delete('/:id', CourseControllers.deleteSingleCourse);

router.patch(
  '/:id',
  validateRequest(CourseValidation.updateCourseValidation),
  CourseControllers.updateSingleCourse,
);

router.put(
  '/:courseId/assignFaculty',
  validateRequest(CourseValidation.assignFacultiesWithCourseValidationsSchema),
  CourseControllers.assignFacultiesWithCourse,
);

router.delete(
  '/:courseId/delete-faculties',
  validateRequest(CourseValidation.assignFacultiesWithCourseValidationsSchema),
  CourseControllers.deleteFacultiesWithCourse,
);
export const CourseRoutes = router;
