import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { AcademicSemesterServices } from './academicSemester.services';

const createAcademicSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester created successfully',
    data: result,
  });
});

const getAllAcademicSemesters = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.getAllAcademicSemestersFromDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Academic All Semester fetched successfully',
    data: result,
  });
});

const getSingleAcademicSemesters = catchAsync(async (req, res) => {
  const id = req.params.semesterId;
  const result =
    await AcademicSemesterServices.getSingleAcademicSemesterFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Academic All Semester fetched successfully',
    data: result,
  });
});

const updateASingleSemester = catchAsync(async (req, res) => {
  const id = req.params.semesterId;
  const body = req.body;
  const result = await AcademicSemesterServices.updateASingleSemesterToDB(
    id,
    body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Academic Semester updated successfully',
    data: result,
  });
});

export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemesters,
  getSingleAcademicSemesters,
  updateASingleSemester,
};
