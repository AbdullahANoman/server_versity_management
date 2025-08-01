/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

const notFoundHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  return res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Api Not Found',
    error: '',
  });
};

export default notFoundHandler;
