import mongoose from 'mongoose';
import { MStudent } from './student.models';
import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { User } from '../user/user.models';
import { TStudent } from './student.interface';

const getAllStudentFromDB = async () => {
  const result = await MStudent.find()
    .populate('user')
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await MStudent.findOne({ id });
  return result;
};
const deleteSingleStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  const userValid = await MStudent.isUserExist(id);
  if (!userValid) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student Not Exist');
  } else {
    try {
      session.startTransaction();
      const deletedStudent = await MStudent.findOneAndUpdate(
        { id: id },
        { isDeleted: true },
        { new: true, session },
      );
      if (!deletedStudent) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Student Delete Failed');
      }

      const deletedUser = await User.findOneAndUpdate(
        { id: id },
        { isDeleted: true },
        { new: true, session },
      );
      if (!deletedUser) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User delete failed');
      }
      await session.commitTransaction();
      await session.endSession();
      return deletedStudent;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw new AppError(httpStatus.BAD_REQUEST, 'Delete Request Failed');
    }
  }
};

const updateSingleStudentIntoDB = async (
  id: string,
  body: Partial<TStudent>,
) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = body || {};

  const modifiedUpdateData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [keys, value] of Object.entries(name)) {
      modifiedUpdateData[`name.${keys}`] = value;
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [keys, value] of Object.entries(guardian)) {
      modifiedUpdateData[`guardian.${keys}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [keys, value] of Object.entries(localGuardian)) {
      modifiedUpdateData[`localGuardian.${keys}`] = value;
    }
  }
  const result = await MStudent.findOneAndUpdate(
    { id: id },
    modifiedUpdateData,
    { new: true, runValidators: true },
  );
  return result;
};

export const StudentService = {
  getAllStudentFromDB,
  getSingleStudentFromDB,
  deleteSingleStudentFromDB,
  updateSingleStudentIntoDB,
};
