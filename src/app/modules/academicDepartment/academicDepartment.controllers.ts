import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicDepartmentServices } from './academicDepartment.services';

const createAcademicDepartment = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.createAcademicDepartmentIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department Created Successfully',
    data: result,
  });
});

const getAllAcademicDepartments = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.getAllAcademicDepartmentsFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic All Department Fetched Successfully',
    data: result,
  });
});

const getSingleAcademicDepartment = catchAsync(async (req, res) => {
  const id = req.params.departmentId;
  const result =
    await AcademicDepartmentServices.getSingleAcademicDepartmentFromDB(id);
  sendResponse(res, {
    success: true,
    message: 'Academic Department Found Successfully',
    statusCode: httpStatus.OK,
    data: result,
  });
});

const updateSingleAcademicDepartment = catchAsync(async (req, res) => {
  const id = req.params.departmentId;
  const body = req.body;
  const result = await AcademicDepartmentServices.updateSingleAcademicIntoDB(
    id,
    body,
  );
  sendResponse(res, {
    success: true,
    message: 'Academic Department Updated Successfully',
    statusCode: httpStatus.OK,
    data: result,
  });
});

export const AcademicDepartmentControllers = {
  createAcademicDepartment,
  getAllAcademicDepartments,
  getSingleAcademicDepartment,
  updateSingleAcademicDepartment,
};
