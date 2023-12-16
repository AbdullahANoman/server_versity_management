import express from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { StudentValidations } from './student.validation';

const router = express.Router();

//will call controller function
router.get('/', StudentController.getAllStudent);
router.get('/:id', StudentController.getSingleStudent);
router.delete('/:id', StudentController.deleteSingleStudent);
router.patch(
  '/:id',
  validateRequest(StudentValidations.UpdateStudentZodValidation),
  StudentController.updateSingleStudent,
);
export const StudentRoutes = router;
