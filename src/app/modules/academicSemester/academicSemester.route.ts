import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicValidation } from './academicSemester.validation';
import { AcademicSemesterControllers } from './academicSemester.controller';
import authValidation from '../../middlewares/authValidation';
const router = express.Router();

// simpleMiddleware

//will call controller function
router.post(
  '/create-academic-semester',
  validateRequest(AcademicValidation.academicSemesterValidationSchema),
  AcademicSemesterControllers.createAcademicSemester,
);

router.get(
  '/',
  authValidation('admin'),
  AcademicSemesterControllers.getAllAcademicSemesters,
);

router.get(
  '/:semesterId',
  AcademicSemesterControllers.getSingleAcademicSemesters,
);

router.patch(
  '/:semesterId',
  validateRequest(AcademicValidation.updateAcademicSemesterValidationSchema),
  AcademicSemesterControllers.updateASingleSemester,
);

export const AcademicSemesterRoutes = router;
