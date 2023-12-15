import { RequestHandler } from 'express';
import { StudentService } from './student.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const getAllStudent: RequestHandler = catchAsync(async (req, res) => {
  const result = await StudentService.getAllStudentFromDB(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Student found successfully',
    data: result,
  });
});

const getSingleStudent: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.studentId;
  const result = await StudentService.getSingleStudentFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Student found successfully',
    data: result,
  });
});

const deleteSingleStudent: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.studentId;
  const result = await StudentService.deleteSingleStudentFromDB(id);
  sendResponse(res, {
    success: true,
    message: 'Delete student successfully',
    statusCode: httpStatus.OK,
    data: result,
  });
});
const updateSingleStudent: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.studentId;
  const { student } = req.body;
  const result = await StudentService.updateSingleStudentIntoDB(id, student);
  sendResponse(res, {
    success: true,
    message: 'Update student successfully',
    statusCode: httpStatus.OK,
    data: result,
  });
});
export const StudentController = {
  getAllStudent,
  getSingleStudent,
  deleteSingleStudent,
  updateSingleStudent,
};
