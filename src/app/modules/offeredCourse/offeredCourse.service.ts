import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.models';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.models';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { OfferedCourse } from './offeredCourse.model';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
  } = payload;

  const isSemesterRegistrationExist =
    await SemesterRegistration.findById(semesterRegistration);
  if (!isSemesterRegistrationExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester registration not found');
  }

  const isAcademicDepartmentExist =
    await AcademicDepartment.findById(academicDepartment);
  if (!isAcademicDepartmentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Department not found');
  }

  //check academic Department has the academic faculty which is valid to add

  const isDepartmentBelongFaculty = await AcademicDepartment.findOne({
    _id: academicDepartment,
    academicFaculty,
  });

  const isAcademicFacultyExist =
    await AcademicFaculty.findById(academicFaculty);
  if (!isAcademicFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty not found');
  }

  if (!isDepartmentBelongFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Must be Academic Department ${isAcademicDepartmentExist.name} have not this ${isAcademicFacultyExist.name} Academic faculty `,
    );
  }

  // const academicDepartmentFromPayload =
  //   isAcademicDepartmentExist.academicFaculty;
  // if (academicDepartmentFromPayload != academicFaculty) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     `Must be Academic Department have the Academic faculty `,
  //   );
  // }

  const isCourseExist = await Course.findById(course);
  if (!isCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  const isFacultyExist = await Faculty.findById(faculty);
  if (!isFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found');
  }
  const academicSemester = isSemesterRegistrationExist.academicSemester;

  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
};
const getAllOfferedCourseFromDB = async () => {
  //check that

  const result = await OfferedCourse.find()
    .populate('semesterRegistration')
    .populate('academicSemester')
    .populate('academicDepartment')
    .populate('faculty')
    .populate('academicFaculty')
    .populate('course');
  return result;
};
export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCourseFromDB,
};
