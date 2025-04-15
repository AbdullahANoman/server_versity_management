import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import EnrolledCourse from './enrolledCourse.model';
import { MStudent } from '../student/student.models';
import mongoose from 'mongoose';

const creatEnrolledCourseIntoDB = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  /**
   * step-1 : Check if the offered course is exists in offered course database
   * step-2 : Check if the student is already enrolled in the course
   * step-3 : Create an enrolled course
   */

  const { offeredCourse } = payload;

  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found');
  }

  if (isOfferedCourseExists?.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Room is full');
  }

  const student = await MStudent.findOne({ id: userId }).select('_id');

  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExists?.semesterRegistration,
    offeredCourse,
    student: student?._id,
  });

  if (isStudentAlreadyEnrolled) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Student already enrolled in this course',
    );
  }

  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const result = await EnrolledCourse.create({
      semesterRegistration: isOfferedCourseExists?.semesterRegistration,
      academicSemester: isOfferedCourseExists?.academicSemester,
      academicFaculty: isOfferedCourseExists?.academicFaculty,
      academicDepartment: isOfferedCourseExists?.academicDepartment,
      offeredCourse: offeredCourse,
      course: isOfferedCourseExists?.course,
      student: student?._id,
      faculty: isOfferedCourseExists?.faculty,
      isEnrolled: true,
    });

    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to enroll course');
    }

    const maxCapacity = isOfferedCourseExists?.maxCapacity;
    await OfferedCourse.findByIdAndUpdate(offeredCourse, {
      maxCapacity: maxCapacity - 1,
    });
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to enrolled course');
  }
};

export const EnrolledCourseServices = {
  creatEnrolledCourseIntoDB,
};
