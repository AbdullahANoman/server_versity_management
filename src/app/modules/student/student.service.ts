import mongoose from 'mongoose';
import { MStudent } from './student.models';
import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { User } from '../user/user.models';
import { TStudent } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchFields } from './student.constant';

const getAllStudentFromDB = async (query: Record<string, unknown>) => {
  const studentQuery = new QueryBuilder(
    MStudent.find()
      .populate('user')
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(studentSearchFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await studentQuery.countTotal();
  const result = await studentQuery.modelQuery;
  return {
    meta,
    result,
  };
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await MStudent.findById(id);
  return result;
};
const deleteSingleStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  const userValid = await MStudent.isUserExist(id);
  if (userValid) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student Not Exist');
  } else {
    try {
      session.startTransaction();
      const deletedStudent = await MStudent.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true, session },
      );
      if (!deletedStudent) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Student Delete Failed');
      }

      const userID = deletedStudent.user;
      const deletedUser = await User.findByIdAndUpdate(
        userID,
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
  const result = await MStudent.findByIdAndUpdate(id, modifiedUpdateData, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const StudentService = {
  getAllStudentFromDB,
  getSingleStudentFromDB,
  deleteSingleStudentFromDB,
  updateSingleStudentIntoDB,
};
