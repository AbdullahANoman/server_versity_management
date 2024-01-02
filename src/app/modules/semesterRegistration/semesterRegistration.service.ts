/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import AppError from '../../Errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.models';
import { RegistrationStatus } from './semesterRegistration.constant';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload.academicSemester;
  // check semester is already exist or not
  const isAcademicSemesterExist =
    await AcademicSemester.findById(academicSemester);
  if (!isAcademicSemesterExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This Semester is Already Exist !',
    );
  }
  //check semester is upcoming or ongoing
  const isSemesterStatus = await SemesterRegistration.findOne({
    $or: [
      { status: RegistrationStatus.UPCOMING },
      { status: RegistrationStatus.ONGOING },
    ],
  });

  if (isSemesterStatus) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `This Semester is an ${isSemesterStatus.status} registered !`,
    );
  }

  // Check if the semester is already registered!
  const isAcademicSemesterRegistered =
    await SemesterRegistration.findById(academicSemester);
  if (isAcademicSemesterRegistered) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This Semester is Already Registered !',
    );
  }
  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};

const getSingleSemesterRegistrationsFromDB = async (id: string) => {
  const result =
    await SemesterRegistration.findById(id).populate('academicSemester');

  return result;
};

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  // check if the semester is exist
  const requestedSemester = await SemesterRegistration.findById(id);
  if (!requestedSemester) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This Semester Registration is not Exist ',
    );
  }

  const requestedStatus = requestedSemester?.status;
  //check semester registration in ended or not
  if (requestedStatus === RegistrationStatus.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This semester registration ${requestedStatus}`,
    );
  }

  // semester status do not update upcoming to ended
  if (
    requestedStatus === RegistrationStatus.UPCOMING &&
    payload?.status === RegistrationStatus.ENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not update the status ${requestedStatus} to ${payload?.status}`,
    );
  }

  if (
    requestedStatus === RegistrationStatus.ONGOING &&
    payload?.status === RegistrationStatus.UPCOMING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not update the status ${requestedStatus} to ${payload?.status}`,
    );
  }
  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteSemesterRegistrationFromDB = async (id: string) => {
  /** 
  * Step1: Delete associated offered courses.
  * Step2: Delete semester registraton when the status is 
  'UPCOMING'.
  **/

  // checking if the semester registration is exist
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This registered semester is not found !',
    );
  }

  // checking if the status is still "UPCOMING"
  const semesterRegistrationStatus = isSemesterRegistrationExists.status;

  if (semesterRegistrationStatus !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not update as the registered semester is ${semesterRegistrationStatus}`,
    );
  }

  //deleting associated offered courses
};

export const SemesterRegistrationService = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationsFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationFromDB,
};
