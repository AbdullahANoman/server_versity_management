/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../config';
import handleZodError from '../Errors/handleZodError';
import handleValidationError from '../Errors/handleValidationError';
import handleCastError from '../Errors/handleCastError';
import { TErrorSources } from '../interface/error';
import handleDuplicateError from '../Errors/handleDuplicateError';
import AppError from '../Errors/AppError';

const globalErrorHandler: ErrorRequestHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err,
  req,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next,
) => {
  let statusCode = err.statuscode || 500;
  let message = err.message || 'Something went wrong';
  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  if (err instanceof ZodError) {
    const valueOfError = handleZodError(err);
    message = valueOfError?.message;
    statusCode = valueOfError?.statusCode;
    errorSources = valueOfError?.errorSources;
  } else if (err.name === 'ValidationError') {
    const valueOfValidationError = handleValidationError(err);
    message = valueOfValidationError?.message;
    statusCode = valueOfValidationError?.statusCode;
    errorSources = valueOfValidationError?.errorSources;
  } else if (err.name === 'CastError') {
    const valueOfError = handleCastError(err);
    message = valueOfError?.message;
    statusCode = valueOfError?.statusCode;
    errorSources = valueOfError?.errorSources;
  } else if (err.code === 11000) {
    const valueOfError = handleDuplicateError(err);
    message = valueOfError?.message;
    statusCode = valueOfError?.statusCode;
    errorSources = valueOfError?.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err?.message;
    errorSources = [
      {
        path: '',
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err?.message;
    errorSources = [
      {
        path: '',
        message: err.message,
      },
    ];
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.Node_Env == 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;

/*
pattern for error handling 
{
  success: boolean;
  message: string;
  errorSource: object;
  stack : string; for development
}
*/
