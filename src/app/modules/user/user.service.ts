import mongoose from 'mongoose';
import config from '../../config';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemester } from '../academicSemester/academicSemester.models';
import { TStudent } from '../student/student.interface';
import { MStudent } from '../student/student.models';
import { TUser } from './user.interface';
import { User } from './user.models';
import { generateStudentId } from './user.utils';
import AppError from '../../Errors/AppError';
import httpStatus from 'http-status';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_password as string);

  //set role
  userData.role = 'student';
  //set id

  // generate studentId

  //find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  const session = await mongoose.startSession();

  try {
    await session.startTransaction();
    userData.id = await generateStudentId(
      admissionSemester as TAcademicSemester,
    );
    //   createUser
    const newUser = await User.create([userData], { session }); //built in static method

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User creation failed');
    }
    // set id and _id  as user
    // the newUser is array that's why array 0 index will be the main data
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    const newStudent = await MStudent.create([payload], { session }); //

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Student creation failed');
    }
    await session.commitTransaction();
    await session.endSession();
    return newStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to create student');
  }
};

export const UserServices = {
  createStudentIntoDB,
};
