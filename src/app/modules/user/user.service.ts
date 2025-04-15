import mongoose from 'mongoose';
import config from '../../config';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemester } from '../academicSemester/academicSemester.models';
import { TStudent } from '../student/student.interface';
import { MStudent } from '../student/student.models';
import { TUser } from './user.interface';
import { User } from './user.models';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import AppError from '../../Errors/AppError';
import httpStatus from 'http-status';
import { Faculty } from '../faculty/faculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.models';
import { TFaculty } from '../faculty/faculty.interface';
import { Admin } from '../admin/admin.model';
import { TAdmin } from '../admin/admin.interface';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const createStudentIntoDB = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: any,
  password: string,
  payload: TStudent,
) => {
  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_password as string);

  userData.role = 'student';
  userData.email = payload.email;

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

    const academicDepartment = await AcademicDepartment.findById(
      payload.academicDepartment,
    );

    if (!academicDepartment) {
      throw new AppError(400, 'Academic department not found');
    }

    payload.academicFaculty = academicDepartment.academicFaculty;

    if (file) {
      const imageName = `${userData?.id}${payload?.name?.firstName}`;
      const path = file?.path;
      // send image to cloudinary
      const result = await sendImageToCloudinary(imageName, path);
      const { secure_url } = result as { secure_url: string };
      payload.profileImage = secure_url;
    }

    //   createUser
    const newUser = await User.create([userData], { session }); //built in static method

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User creation failed');
    }
    // set id and _id  as user
    // the newUser is array that's why array 0 index will be the main data
  
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;  //reference _id

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
const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'faculty';

  //set email at faculty
  userData.email = payload.email;

  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(400, 'Academic department not found');
  }

  payload.academicFaculty = academicDepartment.academicFaculty;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateFacultyId();

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // array

    //create a faculty
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a faculty (transaction-2)

    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
const createAdminIntoDB = async (password: string, payload: TAdmin) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'admin';

  //set email at admin
  userData.email = payload.email;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateAdminId();

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    //create a admin
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getMeFromDB = async (userId: string, userRole: string) => {
  let result = null;
  if (userRole === 'admin') {
    result = await Admin.findOne({ id: userId }).populate('user');
  }
  if (userRole === 'student') {
    result = await MStudent.findOne({ id: userId }).populate('user');
  }
  if (userRole === 'faculty') {
    result = await Faculty.findOne({ id: userId }).populate('user');
  }

  return result;
};

const changeStatusFromDB = async (id: string, payload: { status: string }) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};
export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMeFromDB,
  changeStatusFromDB,
};
