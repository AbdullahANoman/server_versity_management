import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUserInDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully ',
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...userData } = req.user;
  const result = await AuthServices.changePasswordFromDB(userData, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password Changed Successfully ',
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  changePassword,
};
