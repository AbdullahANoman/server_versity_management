import { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { SemesterRegistrationService } from './semesterRegistration.service';

const createSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationService.createSemesterRegistrationIntoDB(
      req.body,
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Registration successfully',
    data: result,
  });
});

const getAllSemesterRegistration: RequestHandler = catchAsync(
  async (req, res) => {
    const result =
      await SemesterRegistrationService.getAllSemesterRegistrationsFromDB(
        req.query,
      );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Semester registration are all retrieved successfully',
      data: result,
    });
  },
);

const getSingleSemesterRegistration: RequestHandler = catchAsync(
  async (req, res) => {
    const id = req.params.id;
    const result =
      await SemesterRegistrationService.getSingleSemesterRegistrationsFromDB(
        id,
      );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Course found successfully',
      data: result,
    });
  },
);

const updateSingleSemesterRegistration: RequestHandler = catchAsync(
  async (req, res) => {
    const id = req.params.id;
    const result =
      await SemesterRegistrationService.updateSemesterRegistrationIntoDB(
        id,
        req?.body,
      );
    sendResponse(res, {
      success: true,
      message: 'Update Course Successfully',
      statusCode: httpStatus.OK,
      data: result,
    });
  },
);

const deleteSingleSemesterRegistration: RequestHandler = catchAsync(
  async (req, res) => {
    const id = req.params.id;
    const result =
      await SemesterRegistrationService.deleteSemesterRegistrationFromDB(id);
    sendResponse(res, {
      success: true,
      message: 'Delete Course Successfully',
      statusCode: httpStatus.OK,
      data: result,
    });
  },
);

export const SemesterRegistrationControllers = {
  createSemesterRegistration,
  getAllSemesterRegistration,
  getSingleSemesterRegistration,
  updateSingleSemesterRegistration,
  deleteSingleSemesterRegistration,
};
