import { Router } from 'express';
import { StudentRoutes } from '../modules/student/student.route';
import { UserRoutes } from '../modules/user/user.route';
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.route';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route';
import { AcademicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.routes';
import { FacultyRoutes } from '../modules/faculty/faculty.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    element: UserRoutes,
  },
  {
    path: '/students',
    element: StudentRoutes,
  },
  {
    path: '/faculties',
    element: FacultyRoutes,
  },
  {
    path: '/academic-semester',
    element: AcademicSemesterRoutes,
  },
  {
    path: '/academic-faculty',
    element: AcademicFacultyRoutes,
  },
  {
    path: '/academic-department',
    element: AcademicDepartmentRoutes,
  },
];

moduleRoutes.forEach(({ path, element }) => router.use(path, element));

// router.use('/students', StudentRoutes);
// router.use('/users', UserRoutes);

export default router;
