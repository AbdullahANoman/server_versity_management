import { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import { CourseServices } from './course.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.createCourseIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course created successfully',
    data: result,
  });
});

const getAllCourses: RequestHandler = catchAsync(async (req, res) => {
  const result = await CourseServices.getAllCoursesFromDB(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Courses found successfully',
    data: result,
  });
});

const getSingleCourse: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await CourseServices.getSingleCourseFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Course found successfully',
    data: result,
  });
});

const deleteSingleCourse: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await CourseServices.deleteSingleCourseFromDB(id);
  sendResponse(res, {
    success: true,
    message: 'Delete student successfully',
    statusCode: httpStatus.OK,
    data: result,
  });
});
const updateSingleCourse: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await CourseServices.updateSingleCourseIntoDB(id, req?.body);
  sendResponse(res, {
    success: true,
    message: 'Update Course Successfully',
    statusCode: httpStatus.OK,
    data: result,
  });
});
export const CourseControllers = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  deleteSingleCourse,
  updateSingleCourse,
};
