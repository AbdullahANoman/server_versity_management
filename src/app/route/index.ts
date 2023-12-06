import { Router } from 'express';
import { StudentRoutes } from '../modules/student/student.route';
import { UserRoutes } from '../modules/user/user.route';
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.route';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/students',
    element: StudentRoutes,
  },
  {
    path: '/users',
    element: UserRoutes,
  },
  {
    path: '/academic-semester',
    element: AcademicSemesterRoutes,
  },
  {
    path: '/academic-faculty',
    element: AcademicFacultyRoutes,
  },
];

moduleRoutes.forEach(({ path, element }) => router.use(path, element));

// router.use('/students', StudentRoutes);
// router.use('/users', UserRoutes);

export default router;
