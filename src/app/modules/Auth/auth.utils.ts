import jwt from 'jsonwebtoken';

export const createToken = (
  jwtPayload: {
    userId: string;
    userRole: string;
  },
  secret: string,
  expiresTime: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn: expiresTime,
  });
};
