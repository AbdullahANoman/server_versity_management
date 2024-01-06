import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { User } from '../user/user.models';
import { TLoginUser } from './auth.interface';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcryptjs';
import { createToken } from './auth.utils';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../utils/sendEmail';
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

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires as string,
  );

  return {
    refreshToken,
    accessToken,
    needsPasswordChange: user?.needPasswordChange,
  };
};
const changePasswordFromDB = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const user = await User.isUserExistsByCustomId(userData?.userId);

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
    payload?.oldPassword,
    user?.password,
  );
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password Did Not Match');
  }

  const updatedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_sal_rounds),
  );
  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.userRole,
    },
    {
      password: updatedPassword,
      needPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );
};

const refreshTokenToGetAccessToken = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Did Not Receive Any Token ');
  }
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { userId, iat } = decoded;

  const user = await User.isUserExistsByCustomId(userId);

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
  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload = {
    userId: user.id,
    userRole: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires as string,
  );

  return {
    accessToken,
  };
};

const forgetPasswordAndGenerateLink = async (id: string) => {
  const user = await User.isUserExistsByCustomId(id);

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

  const jwtPayload = {
    userId: user.id,
    userRole: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '5m',
  );

  const resetLink = `http://localhost:3000?id=${user?.id}&token=${accessToken}`;
  sendEmail(user?.email, resetLink);
  return {
    resetLink,
  };
};

const resetPasswordFromDB = async (
  id: string,
  newPassword: string,
  token: string,
) => {
  const user = await User.isUserExistsByCustomId(id);

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

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  if (decoded.userId !== user.id) {
    throw new AppError(httpStatus.FORBIDDEN, 'User Is Not Matched with Token');
  }
  const updatedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_sal_rounds),
  );
  await User.findOneAndUpdate(
    {
      id: user.id,
    },
    {
      password: updatedPassword,
      needPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );
};
export const AuthServices = {
  loginUserInDB,
  changePasswordFromDB,
  refreshTokenToGetAccessToken,
  forgetPasswordAndGenerateLink,
  resetPasswordFromDB,
};
