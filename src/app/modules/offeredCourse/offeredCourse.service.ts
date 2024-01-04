import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.models';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.models';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { OfferedCourse } from './offeredCourse.model';
import { hasTimeConflict } from './offeredCourse.utils';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
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

  const isAcademicFacultyExist =
    await AcademicFaculty.findById(academicFaculty);
  if (!isAcademicFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty not found');
  }

  const isDepartmentBelongFaculty = await AcademicDepartment.findOne({
    _id: academicDepartment,
    academicFaculty,
  });
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

  const checkSameSectionHaveTheOfferedCourse = await OfferedCourse.findOne({
    section,
    academicFaculty,
    academicDepartment,
  });

  if (checkSameSectionHaveTheOfferedCourse) {
    throw new AppError(httpStatus.BAD_REQUEST, `Change the section`);
  }
  const isCourseExist = await Course.findById(course);
  if (!isCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  const isFacultyExist = await Faculty.findById(faculty);
  if (!isFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found');
  }
  const academicSemester = isSemesterRegistrationExist.academicSemester;

  const assignedSchedules = await OfferedCourse.find({
    faculty: faculty,
    semesterRegistration: semesterRegistration,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Faculty is not available this time please change the time an days',
    );
  }

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
const updateOfferedCourseInToDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  const { faculty, days, startTime, endTime } = payload;

  const isOfferedCourseExist = await OfferedCourse.findById(id);
  if (!isOfferedCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found');
  }

  const isFacultyExist = await Faculty.findById(faculty);
  if (!isFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found');
  }

  const semesterRegistration = isOfferedCourseExist.semesterRegistration;

  //check semester registration in ongoing or ended process or not

  const isSemesterRegistrationExist =
    await SemesterRegistration.findById(semesterRegistration);
  if (!isSemesterRegistrationExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester Registration not found');
  }
  const semesterRegistrationStatus = isSemesterRegistrationExist.status;
  if (
    semesterRegistrationStatus === 'ENDED' ||
    semesterRegistrationStatus === 'ONGOING'
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `The semester registration status ${semesterRegistrationStatus} only update when the semester registration status is UPCOMING`,
    );
  }
  const assignedSchedules = await OfferedCourse.find({
    faculty: faculty,
    semesterRegistration: semesterRegistration,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Faculty is not available this time please change the time an days',
    );
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};
export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCourseFromDB,
  updateOfferedCourseInToDB,
};
