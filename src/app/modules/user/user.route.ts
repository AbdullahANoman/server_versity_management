import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './user.controller';
import { StudentValidations } from '../student/student.validation';
import validateRequest from '../../middlewares/validateRequest';
import { createFacultyZodValidationSchema } from '../faculty/faculty.validation';
import authValidation from '../../middlewares/authValidation';
import { USER_ROLE } from './user.constant';
import { UserValidation } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';
import { createAdminValidationSchema } from '../admin/admin.validation';
const router = express.Router();

// simpleMiddleware

router.post(
  '/create-student',
  authValidation(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(StudentValidations.CreateStudentZodValidation),
  UserControllers.createStudent,
);

router.post(
  '/create-faculty',
  authValidation(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createFacultyZodValidationSchema),
  UserControllers.createFaculty,
);

router.post(
  '/create-admin',
  authValidation(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createAdminValidationSchema),
  UserControllers.createAdmin,
);
router.get(
  '/me',
  authValidation(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  UserControllers.getMe,
);

router.post(
  '/change-status/:id',
  authValidation(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(UserValidation.changeStatusValidationSchema),
  UserControllers.changeStatus,
);


router.get(
  '/allUsers',
  authValidation(USER_ROLE.superAdmin),
  UserControllers.getAllUsers
)

export const UserRoutes = router;
