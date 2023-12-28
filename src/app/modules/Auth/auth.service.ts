import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { User } from '../user/user.models';
import { TLoginUser } from './auth.interface';
import jwt from 'jsonwebtoken';
import config from '../../config';

const loginUserInDB = async (payload: TLoginUser) => {
  const user = await User.isUserExistsByCustomId(payload?.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found');
  }

  const isUserDeleted = user?.isDeleted;
  if (isUserDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User Is Deleted');
  }
  const isUserStatus = user?.status;

  if (isUserStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User Is Blocked');
  }

  const isPasswordMatch = await User.isPasswordMatched(
    payload?.password,
    user?.password,
  );
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password Did Not Match');
  }

  const jwtPayload = {
    userId: user.id,
    userRole: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: '10d',
  });
  return {
    accessToken,
    needsPasswordChange: user?.needPasswordChange,
  };
};

export const AuthServices = {
  loginUserInDB,
};
