import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorHandling } from '../interface/error';

const handleCastError = (
  error: mongoose.Error.CastError,
): TGenericErrorHandling => {
  const errorSources: TErrorSources = [
    {
      path: error.path,
      message: error?.message,
    },
  ];

  const message = error?.message;
  const statusCode = 400;

  return {
    message,
    statusCode,
    errorSources,
  };
};

export default handleCastError;
